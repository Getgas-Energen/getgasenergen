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
  internal_note: string | null;
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
      .select(
        "id, name, company, email, phone, project_type, message, status, internal_note, attachment_path, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw new Error(error.message);
    return { enquiries: (data ?? []) as unknown as EnquiryRow[] };
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

/* ------------------------------------------------------------------ projects */

export interface AdminProjectRow {
  id: string;
  slug: string;
  title: string;
  category: "reticulation" | "storage" | "safety" | "metering" | "maintenance" | "other";
  tags: string[];
  summary: string;
  body: string;
  client_name: string | null;
  location: string | null;
  sector: string | null;
  capacity: string | null;
  scope: string | null;
  completion_date: string | null;
  cover_url: string | null;
  gallery_urls: string[];
  pdf_path: string | null;
  featured: boolean;
  sort_order: number;
  status: "draft" | "published";
  updated_at: string;
}

const PROJECT_COLUMNS =
  "id, slug, title, category, tags, summary, body, client_name, location, sector, capacity, scope, completion_date, cover_url, gallery_urls, pdf_path, featured, sort_order, status, updated_at";

export const listProjectsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("projects")
      .select(PROJECT_COLUMNS)
      .order("updated_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { projects: (data ?? []) as unknown as AdminProjectRow[] };
  });

const projectInput = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(180),
  slug: z.string().max(90).optional().nullable(),
  category: z.enum(["reticulation", "storage", "safety", "metering", "maintenance", "other"]),
  tags: z.array(z.string().min(1).max(40)).max(12).optional().default([]),
  summary: z.string().max(500).optional().default(""),
  body: z.string().max(60000).optional().default(""),
  clientName: z.string().max(160).optional().nullable(),
  location: z.string().max(160).optional().nullable(),
  sector: z.string().max(80).optional().nullable(),
  capacity: z.string().max(120).optional().nullable(),
  scope: z.string().max(4000).optional().nullable(),
  completionDate: z.string().max(10).optional().nullable(),
  coverUrl: z.string().max(400).optional().nullable(),
  galleryUrls: z.array(z.string().max(400)).max(12).optional().default([]),
  pdfPath: z.string().max(400).optional().nullable(),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().int().min(0).max(9999).optional().default(100),
  status: z.enum(["draft", "published"]),
});

export const saveProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => projectInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const slug = slugify(data.slug || data.title) || `project-${Date.now()}`;
    const payload = {
      title: data.title,
      slug,
      category: data.category,
      tags: data.tags ?? [],
      summary: data.summary ?? "",
      body: data.body ?? "",
      client_name: data.clientName || null,
      location: data.location || null,
      sector: data.sector || null,
      capacity: data.capacity || null,
      scope: data.scope || null,
      completion_date: data.completionDate || null,
      cover_url: data.coverUrl || null,
      gallery_urls: data.galleryUrls ?? [],
      pdf_path: data.pdfPath || null,
      featured: data.featured ?? false,
      sort_order: data.sortOrder ?? 100,
      status: data.status,
    };

    if (data.id) {
      const { error } = await context.supabase.from("projects").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id, slug };
    }

    const { data: inserted, error } = await context.supabase
      .from("projects")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id, slug };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

/* ------------------------------------------------------------------ quote requests */

export interface AdminQuoteRow {
  id: string;
  reference: string;
  contact_name: string;
  company: string | null;
  email: string;
  phone: string;
  building_type: string;
  units: number;
  appliances: string | null;
  supply_type: string;
  location: string;
  timeline: string | null;
  notes: string | null;
  estimate_low_kes: number | null;
  estimate_high_kes: number | null;
  status: "new" | "reviewing" | "quoted" | "won" | "lost";
  internal_note: string | null;
  created_at: string;
}

export const listQuoteRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("quote_requests")
      .select(
        "id, reference, contact_name, company, email, phone, building_type, units, appliances, supply_type, location, timeline, notes, estimate_low_kes, estimate_high_kes, status, internal_note, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { quotes: (data ?? []) as unknown as AdminQuoteRow[] };
  });

export const updateQuoteRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "reviewing", "quoted", "won", "lost"]),
        internalNote: z.string().max(2000).optional().nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("quote_requests")
      .update({ status: data.status, internal_note: data.internalNote || null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

/* ------------------------------------------------------------------ enquiry notes */

export const updateEnquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "in_progress", "quoted", "won", "closed"]).optional(),
        internalNote: z.string().max(2000).optional().nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload: Record<string, unknown> = {};
    if (data.status) payload["status"] = data.status;
    if (data.internalNote !== undefined) payload["internal_note"] = data.internalNote || null;
    if (Object.keys(payload).length === 0) return { success: true };

    const { error } = await context.supabase
      .from("contact_submissions")
      .update(payload)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

/* ------------------------------------------------------------------ delivery jobs */

export interface DeliveryTaskRow {
  id: string;
  job_id: string;
  name: string;
  responsible: string | null;
  start_date: string;
  days_required: number;
  progress: number;
  notes: string | null;
  sort_order: number;
}

export interface DeliveryJobRow {
  id: string;
  job_code: string;
  title: string;
  client_name: string | null;
  location: string | null;
  job_type: string | null;
  owner_name: string | null;
  start_date: string | null;
  target_end_date: string | null;
  status: "planning" | "active" | "on_hold" | "complete" | "cancelled";
  contract_value_kes: number;
  budget_kes: number;
  spent_kes: number;
  invoiced_kes: number;
  received_kes: number;
  project_id: string | null;
  quote_request_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const JOB_COLUMNS =
  "id, job_code, title, client_name, location, job_type, owner_name, start_date, target_end_date, status, contract_value_kes, budget_kes, spent_kes, invoiced_kes, received_kes, project_id, quote_request_id, notes, created_at, updated_at";
const TASK_COLUMNS =
  "id, job_id, name, responsible, start_date, days_required, progress, notes, sort_order";

export const listJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const { data: jobs, error } = await context.supabase
      .from("delivery_jobs")
      .select(JOB_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);

    const { data: tasks, error: taskError } = await context.supabase
      .from("delivery_tasks")
      .select(TASK_COLUMNS)
      .order("sort_order", { ascending: true });
    if (taskError) throw new Error(taskError.message);

    return {
      jobs: (jobs ?? []) as unknown as DeliveryJobRow[],
      tasks: (tasks ?? []) as unknown as DeliveryTaskRow[],
    };
  });

export const getJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { data: job, error } = await context.supabase
      .from("delivery_jobs")
      .select(JOB_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!job) throw new Error("Job not found.");

    const { data: tasks, error: taskError } = await context.supabase
      .from("delivery_tasks")
      .select(TASK_COLUMNS)
      .eq("job_id", data.id)
      .order("sort_order", { ascending: true })
      .order("start_date", { ascending: true });
    if (taskError) throw new Error(taskError.message);

    return {
      job: job as unknown as DeliveryJobRow,
      tasks: (tasks ?? []) as unknown as DeliveryTaskRow[],
    };
  });

const jobInput = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(180),
  clientName: z.string().max(160).optional().nullable(),
  location: z.string().max(160).optional().nullable(),
  jobType: z.string().max(80).optional().nullable(),
  ownerName: z.string().max(120).optional().nullable(),
  startDate: z.string().max(10).optional().nullable(),
  targetEndDate: z.string().max(10).optional().nullable(),
  status: z.enum(["planning", "active", "on_hold", "complete", "cancelled"]),
  contractValueKes: z.number().min(0).max(1e12).optional().default(0),
  budgetKes: z.number().min(0).max(1e12).optional().default(0),
  spentKes: z.number().min(0).max(1e12).optional().default(0),
  invoicedKes: z.number().min(0).max(1e12).optional().default(0),
  receivedKes: z.number().min(0).max(1e12).optional().default(0),
  projectId: z.string().uuid().optional().nullable(),
  quoteRequestId: z.string().uuid().optional().nullable(),
  notes: z.string().max(4000).optional().nullable(),
});

export const saveJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => jobInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const payload = {
      title: data.title,
      client_name: data.clientName || null,
      location: data.location || null,
      job_type: data.jobType || null,
      owner_name: data.ownerName || null,
      start_date: data.startDate || null,
      target_end_date: data.targetEndDate || null,
      status: data.status,
      contract_value_kes: data.contractValueKes ?? 0,
      budget_kes: data.budgetKes ?? 0,
      spent_kes: data.spentKes ?? 0,
      invoiced_kes: data.invoicedKes ?? 0,
      received_kes: data.receivedKes ?? 0,
      project_id: data.projectId || null,
      quote_request_id: data.quoteRequestId || null,
      notes: data.notes || null,
    };

    if (data.id) {
      const { error } = await context.supabase
        .from("delivery_jobs")
        .update(payload)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }

    const { data: inserted, error } = await context.supabase
      .from("delivery_jobs")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id as string };
  });

export const deleteJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("delivery_jobs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const createJobFromQuote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ quoteId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: quote, error } = await context.supabase
      .from("quote_requests")
      .select(
        "id, reference, contact_name, company, building_type, location, estimate_low_kes, estimate_high_kes, notes",
      )
      .eq("id", data.quoteId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!quote) throw new Error("Quote request not found.");

    const { data: existing } = await context.supabase
      .from("delivery_jobs")
      .select("id")
      .eq("quote_request_id", data.quoteId)
      .maybeSingle();
    if (existing) return { id: existing.id as string, existed: true };

    const value = Number(quote.estimate_high_kes ?? quote.estimate_low_kes ?? 0);

    const { data: inserted, error: insertError } = await context.supabase
      .from("delivery_jobs")
      .insert({
        title: `${quote.building_type} — ${quote.location}`,
        client_name: quote.company || quote.contact_name,
        location: quote.location,
        job_type: quote.building_type,
        status: "planning",
        contract_value_kes: value,
        budget_kes: value,
        quote_request_id: quote.id,
        notes: `Created from quote ${quote.reference}.${quote.notes ? `\n\n${quote.notes}` : ""}`,
      })
      .select("id")
      .single();
    if (insertError) throw new Error(insertError.message);
    return { id: inserted.id as string, existed: false };
  });

/* ------------------------------------------------------------------ delivery tasks */

const taskInput = z.object({
  id: z.string().uuid().optional().nullable(),
  jobId: z.string().uuid(),
  name: z.string().min(2).max(200),
  responsible: z.string().max(120).optional().nullable(),
  startDate: z.string().max(10),
  daysRequired: z.number().int().min(1).max(3650),
  progress: z.number().min(0).max(100),
  notes: z.string().max(2000).optional().nullable(),
  sortOrder: z.number().int().min(0).max(9999).optional().default(100),
});

export const saveTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => taskInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const payload = {
      job_id: data.jobId,
      name: data.name,
      responsible: data.responsible || null,
      start_date: data.startDate,
      days_required: data.daysRequired,
      progress: data.progress,
      notes: data.notes || null,
      sort_order: data.sortOrder ?? 100,
    };

    if (data.id) {
      const { error } = await context.supabase
        .from("delivery_tasks")
        .update(payload)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }

    const { data: inserted, error } = await context.supabase
      .from("delivery_tasks")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id as string };
  });

export const deleteTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("delivery_tasks").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

/* ------------------------------------------------------------------ dashboard */

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertStaff(supabase, userId);

    const [enquiries, quotes, jobsRes, tasksRes, orders] = await Promise.all([
      supabase.from("contact_submissions").select("id, status, created_at").limit(1000),
      supabase.from("quote_requests").select("id, status, created_at").limit(1000),
      supabase.from("delivery_jobs").select(JOB_COLUMNS).limit(300),
      supabase.from("delivery_tasks").select(TASK_COLUMNS).limit(2000),
      supabase.from("orders").select("id, status, payment_status, total_kes").limit(1000),
    ]);

    const jobs = (jobsRes.data ?? []) as unknown as DeliveryJobRow[];
    const tasks = (tasksRes.data ?? []) as unknown as DeliveryTaskRow[];

    const money = jobs.reduce(
      (acc, j) => ({
        contract: acc.contract + Number(j.contract_value_kes),
        budget: acc.budget + Number(j.budget_kes),
        spent: acc.spent + Number(j.spent_kes),
        invoiced: acc.invoiced + Number(j.invoiced_kes),
        received: acc.received + Number(j.received_kes),
      }),
      { contract: 0, budget: 0, spent: 0, invoiced: 0, received: 0 },
    );

    const enquiryRows = (enquiries.data ?? []) as { status: string }[];
    const quoteRows = (quotes.data ?? []) as { status: string }[];
    const orderRows = (orders.data ?? []) as {
      status: string;
      payment_status: string;
      total_kes: number;
    }[];

    return {
      jobs,
      tasks,
      counts: {
        enquiriesTotal: enquiryRows.length,
        enquiriesOpen: enquiryRows.filter((e) => e.status === "new" || e.status === "in_progress")
          .length,
        quotesTotal: quoteRows.length,
        quotesOpen: quoteRows.filter((q) => q.status === "new" || q.status === "reviewing").length,
        jobsActive: jobs.filter((j) => j.status === "active").length,
        ordersOpen: orderRows.filter((o) => o.status === "new" || o.status === "confirmed").length,
        ordersUnpaid: orderRows.filter((o) => o.payment_status === "pending").length,
      },
      money,
    };
  });

/* ------------------------------------------------------------------ investor relations */

export interface InvestorLeadRow {
  id: string;
  reference: string;
  full_name: string;
  organisation: string | null;
  role_title: string | null;
  email: string;
  phone: string | null;
  investor_type: string;
  ticket_band: string | null;
  interest_area: string | null;
  message: string | null;
  nda_version: string;
  nda_accepted_at: string;
  status: "new" | "reviewing" | "nda_signed" | "access_granted" | "declined";
  internal_note: string | null;
  created_at: string;
}

export const listInvestorLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("investor_leads")
      .select(
        "id, reference, full_name, organisation, role_title, email, phone, investor_type, ticket_band, interest_area, message, nda_version, nda_accepted_at, status, internal_note, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return { leads: (data ?? []) as unknown as InvestorLeadRow[] };
  });

export const updateInvestorLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        id: z.string().uuid(),
        status: z
          .enum(["new", "reviewing", "nda_signed", "access_granted", "declined"])
          .optional(),
        internalNote: z.string().max(2000).optional().nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload: Record<string, unknown> = {};
    if (data.status) payload["status"] = data.status;
    if (data.internalNote !== undefined) payload["internal_note"] = data.internalNote || null;
    if (Object.keys(payload).length === 0) return { success: true };

    const { error } = await context.supabase
      .from("investor_leads")
      .update(payload)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });
