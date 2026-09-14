import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* ------------------------------------------------------------------ helpers */

async function assertStaff(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (roles.length === 0) throw new Error("Forbidden: staff access required");
  return { isAdmin: roles.includes("admin") };
}

async function assertAdmin(supabase: any, userId: string) {
  const { isAdmin } = await assertStaff(supabase, userId);
  if (!isAdmin) throw new Error("Forbidden: admin access required");
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

/* ------------------------------------------------------------------ enquiries */

export interface EnquiryRow {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  project_type: string;
  message: string;
  status: string;
  attachment_path: string | null;
  created_at: string;
}

export const listEnquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertStaff(supabase, userId);

    const { data, error } = await supabase
      .from("contact_submissions")
      .select("id, name, company, email, phone, project_type, message, status, attachment_path, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);
    return { enquiries: (data ?? []) as EnquiryRow[] };
  });

export const getAttachmentLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ path: z.string().min(1).max(300) }).parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);

    const { data: signed, error } = await context.supabase.storage
      .from("submissions")
      .createSignedUrl(data.path, 300);

    if (error || !signed) throw new Error("Could not create a download link.");
    return { url: signed.signedUrl };
  });

export const updateEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "in_progress", "quoted", "won", "closed"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { error } = await context.supabase
      .from("contact_submissions")
      .update({ status: data.status })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

/* ------------------------------------------------------------------ posts */

export interface AdminPostRow {
  id: string;
  slug: string;
  title: string;
  category: "news" | "blog";
  excerpt: string;
  body: string;
  cover_url: string | null;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
}

export const listAllPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);

    const { data, error } = await context.supabase
      .from("posts")
      .select("id, slug, title, category, excerpt, body, cover_url, status, published_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);
    return { posts: (data ?? []) as AdminPostRow[] };
  });

const postInput = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(180),
  slug: z.string().max(90).optional().nullable(),
  category: z.enum(["news", "blog"]),
  excerpt: z.string().max(400).optional().default(""),
  body: z.string().max(60000).optional().default(""),
  coverUrl: z.string().max(400).optional().nullable(),
  status: z.enum(["draft", "published"]),
});

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => postInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const slug = slugify(data.slug || data.title) || `post-${Date.now()}`;

    const payload = {
      title: data.title,
      slug,
      category: data.category,
      excerpt: data.excerpt ?? "",
      body: data.body ?? "",
      cover_url: data.coverUrl || null,
      status: data.status,
      published_at:
        data.status === "published" ? new Date().toISOString() : null,
      author_id: userId,
    };

    if (data.id) {
      const { data: existing } = await supabase
        .from("posts")
        .select("published_at, status")
        .eq("id", data.id)
        .maybeSingle();

      if (existing?.status === "published" && data.status === "published" && existing.published_at) {
        payload.published_at = existing.published_at;
      }

      const { error } = await supabase.from("posts").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id, slug };
    }

    const { data: inserted, error } = await supabase
      .from("posts")
      .insert(payload)
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: inserted.id, slug };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

/* ------------------------------------------------------------------ users */

export interface StaffRow {
  userId: string;
  email: string | null;
  fullName: string | null;
  role: "admin" | "staff";
  createdAt: string;
}

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const { data: profiles } = await supabaseAdmin.from("profiles").select("id, full_name");
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });

    const emailById = new Map(authUsers.users.map((u) => [u.id, u.email ?? null]));
    const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

    return {
      staff: (roles ?? []).map((r) => ({
        userId: r.user_id,
        email: emailById.get(r.user_id) ?? null,
        fullName: nameById.get(r.user_id) ?? null,
        role: r.role as "admin" | "staff",
        createdAt: r.created_at,
      })) as StaffRow[],
    };
  });

export const createStaffAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        email: z.string().email().max(255),
        fullName: z.string().min(2).max(120),
        password: z.string().min(10).max(72),
        role: z.enum(["admin", "staff"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });

    if (error || !created.user) throw new Error(error?.message ?? "Could not create the account.");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: data.role });
    if (roleError) throw new Error(roleError.message);

    return { success: true };
  });

export const setStaffRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ userId: z.string().uuid(), role: z.enum(["admin", "staff"]) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const revokeStaffAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ userId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("You cannot revoke your own access.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    if (error) throw new Error(error.message);
    return { success: true };
  });
