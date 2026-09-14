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

/* ------------------------------------------------------------------ marketplace: products */

export interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  category: "pipes" | "regulators" | "fireplaces" | "cylinders" | "safety" | "other";
  spec: string | null;
  description: string | null;
  price_kes: number | null;
  image_url: string | null;
  in_stock: boolean;
  is_active: boolean;
  sort_order: number;
}

export const listProductsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("products")
      .select(
        "id, name, slug, category, spec, description, price_kes, image_url, in_stock, is_active, sort_order",
      )
      .order("sort_order", { ascending: true })
      .limit(400);
    if (error) throw new Error(error.message);
    return { products: (data ?? []) as unknown as AdminProductRow[] };
  });

const productInput = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string().min(2).max(180),
  category: z.enum(["pipes", "regulators", "fireplaces", "cylinders", "safety", "other"]),
  spec: z.string().max(300).optional().nullable(),
  description: z.string().max(4000).optional().nullable(),
  priceKes: z.number().min(0).max(100000000).optional().nullable(),
  imageUrl: z.string().max(400).optional().nullable(),
  inStock: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => productInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const payload = {
      name: data.name,
      slug: slugify(data.name) || `item-${Date.now()}`,
      category: data.category,
      spec: data.spec || null,
      description: data.description || null,
      price_kes: data.priceKes ?? null,
      image_url: data.imageUrl || null,
      in_stock: data.inStock,
      is_active: data.isActive,
      sort_order: data.sortOrder,
    };

    if (data.id) {
      const { error } = await context.supabase.from("products").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }

    const { data: inserted, error } = await context.supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

/* ------------------------------------------------------------------ marketplace: orders */

export interface AdminOrderRow {
  id: string;
  order_no: string;
  customer_name: string;
  phone: string;
  email: string | null;
  delivery_address: string;
  county: string | null;
  items_total_kes: number;
  total_kes: number;
  status: "new" | "confirmed" | "dispatched" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed";
  payment_reference: string | null;
  customer_note: string | null;
  created_at: string;
  order_items: {
    product_name: string;
    quantity: number;
    unit_price_kes: number;
    line_total_kes: number;
  }[];
}

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("orders")
      .select(
        "id, order_no, customer_name, phone, email, delivery_address, county, items_total_kes, total_kes, status, payment_status, payment_reference, customer_note, created_at, order_items(product_name, quantity, unit_price_kes, line_total_kes)",
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { orders: (data ?? []) as unknown as AdminOrderRow[] };
  });

/** Admin changes an order stage; the customer gets an SMS for the stage change. */
export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "confirmed", "dispatched", "delivered", "cancelled"]),
        notify: z.boolean().optional().default(true),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: order, error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id)
      .select("id, order_no, customer_name, phone, total_kes")
      .single();
    if (error || !order) throw new Error(error?.message ?? "Could not update the order.");

    let sms: { delivered: boolean; error: string | null } | null = null;
    if (data.notify && data.status !== "new") {
      const { sendOrderSms } = await import("./sms.server");
      const template =
        data.status === "confirmed"
          ? "order_confirmed"
          : data.status === "dispatched"
            ? "order_dispatched"
            : data.status === "delivered"
              ? "order_delivered"
              : "order_cancelled";
      const result = await sendOrderSms({
        orderId: order.id,
        phone: order.phone,
        template,
        ctx: {
          orderNo: order.order_no,
          customerName: order.customer_name,
          totalKes: Number(order.total_kes),
        },
      });
      sms = { delivered: result.delivered, error: result.error };
    }

    return { success: true, sms };
  });

export const markOrderPaid = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({ id: z.string().uuid(), reference: z.string().max(100).optional().nullable() })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: order, error } = await context.supabase
      .from("orders")
      .update({ payment_status: "paid", payment_reference: data.reference || "manual" })
      .eq("id", data.id)
      .select("id, order_no, customer_name, phone, total_kes")
      .single();
    if (error || !order) throw new Error(error?.message ?? "Could not update the payment.");

    const { sendOrderSms } = await import("./sms.server");
    await sendOrderSms({
      orderId: order.id,
      phone: order.phone,
      template: "payment_received",
      ctx: {
        orderNo: order.order_no,
        customerName: order.customer_name,
        totalKes: Number(order.total_kes),
      },
    });
    return { success: true };
  });
