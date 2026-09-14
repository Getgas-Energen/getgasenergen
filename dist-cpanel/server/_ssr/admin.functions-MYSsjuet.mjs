import { c as createServerRpc } from "./createServerRpc-Cd4a5Gg1.mjs";
import { c as createServerFn } from "./server-CxX94B5h.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C4Eb0lWp.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function assertStaff(supabase, userId) {
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r) => r.role);
  if (roles.length === 0) throw new Error("Forbidden: staff access required");
  return {
    isAdmin: roles.includes("admin")
  };
}
async function assertAdmin(supabase, userId) {
  const {
    isAdmin
  } = await assertStaff(supabase, userId);
  if (!isAdmin) throw new Error("Forbidden: admin access required");
}
function slugify(input) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}
const listEnquiries_createServerFn_handler = createServerRpc({
  id: "cef7bc3fb7f232d49bcb94a03d6376f0ebe97c8b1e0772a40ab8f3f83f9d2304",
  name: "listEnquiries",
  filename: "src/lib/admin.functions.ts"
}, (opts) => listEnquiries.__executeServer(opts));
const listEnquiries = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listEnquiries_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertStaff(supabase, userId);
  const {
    data,
    error
  } = await supabase.from("contact_submissions").select("id, name, company, email, phone, project_type, message, status, attachment_path, created_at").order("created_at", {
    ascending: false
  }).limit(200);
  if (error) throw new Error(error.message);
  return {
    enquiries: data ?? []
  };
});
const getAttachmentLink_createServerFn_handler = createServerRpc({
  id: "abfcbb19ad248889167b3160ca6d170f4bb6da5f34a7498639fca17fcf1302ff",
  name: "getAttachmentLink",
  filename: "src/lib/admin.functions.ts"
}, (opts) => getAttachmentLink.__executeServer(opts));
const getAttachmentLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  path: stringType().min(1).max(300)
}).parse(data)).handler(getAttachmentLink_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertStaff(context.supabase, context.userId);
  const {
    data: signed,
    error
  } = await context.supabase.storage.from("submissions").createSignedUrl(data.path, 300);
  if (error || !signed) throw new Error("Could not create a download link.");
  return {
    url: signed.signedUrl
  };
});
const updateEnquiryStatus_createServerFn_handler = createServerRpc({
  id: "91704ae56ad06abd0900158ccd0e953157a61b9dfb1e1d9bf34013f9d18da618",
  name: "updateEnquiryStatus",
  filename: "src/lib/admin.functions.ts"
}, (opts) => updateEnquiryStatus.__executeServer(opts));
const updateEnquiryStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  status: enumType(["new", "in_progress", "quoted", "won", "closed"])
}).parse(data)).handler(updateEnquiryStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("contact_submissions").update({
    status: data.status
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const listAllPosts_createServerFn_handler = createServerRpc({
  id: "bc1243debc8c647783e75940a0e8be9e80d2bba927fb3a5c5286e4de4113312a",
  name: "listAllPosts",
  filename: "src/lib/admin.functions.ts"
}, (opts) => listAllPosts.__executeServer(opts));
const listAllPosts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAllPosts_createServerFn_handler, async ({
  context
}) => {
  await assertStaff(context.supabase, context.userId);
  const {
    data,
    error
  } = await context.supabase.from("posts").select("id, slug, title, category, excerpt, body, cover_url, status, published_at, updated_at").order("updated_at", {
    ascending: false
  }).limit(200);
  if (error) throw new Error(error.message);
  return {
    posts: data ?? []
  };
});
const postInput = objectType({
  id: stringType().uuid().optional().nullable(),
  title: stringType().min(3).max(180),
  slug: stringType().max(90).optional().nullable(),
  category: enumType(["news", "blog"]),
  excerpt: stringType().max(400).optional().default(""),
  body: stringType().max(6e4).optional().default(""),
  coverUrl: stringType().max(400).optional().nullable(),
  status: enumType(["draft", "published"])
});
const savePost_createServerFn_handler = createServerRpc({
  id: "9d5cdbf465e564d67c9c8f21883c7ff7211d3ffdaee07b653be33f2ae502fe6b",
  name: "savePost",
  filename: "src/lib/admin.functions.ts"
}, (opts) => savePost.__executeServer(opts));
const savePost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => postInput.parse(data)).handler(savePost_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
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
    published_at: data.status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null,
    author_id: userId
  };
  if (data.id) {
    const {
      data: existing
    } = await supabase.from("posts").select("published_at, status").eq("id", data.id).maybeSingle();
    if (existing?.status === "published" && data.status === "published" && existing.published_at) {
      payload.published_at = existing.published_at;
    }
    const {
      error: error2
    } = await supabase.from("posts").update(payload).eq("id", data.id);
    if (error2) throw new Error(error2.message);
    return {
      id: data.id,
      slug
    };
  }
  const {
    data: inserted,
    error
  } = await supabase.from("posts").insert(payload).select("id").single();
  if (error) throw new Error(error.message);
  return {
    id: inserted.id,
    slug
  };
});
const deletePost_createServerFn_handler = createServerRpc({
  id: "61d2f1a485e46ff0eb3e0ec858fe930d4738d44e986914f73963d7f45a3ff47c",
  name: "deletePost",
  filename: "src/lib/admin.functions.ts"
}, (opts) => deletePost.__executeServer(opts));
const deletePost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid()
}).parse(data)).handler(deletePost_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("posts").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const listStaff_createServerFn_handler = createServerRpc({
  id: "c1af7edbca370233d33088c9dbe9780c1b054f6de6009e094ff0cf89de204739",
  name: "listStaff",
  filename: "src/lib/admin.functions.ts"
}, (opts) => listStaff.__executeServer(opts));
const listStaff = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listStaff_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: roles,
    error
  } = await supabaseAdmin.from("user_roles").select("user_id, role, created_at").order("created_at", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  const {
    data: profiles
  } = await supabaseAdmin.from("profiles").select("id, full_name");
  const {
    data: authUsers
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 200
  });
  const emailById = new Map(authUsers.users.map((u) => [u.id, u.email ?? null]));
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
  return {
    staff: (roles ?? []).map((r) => ({
      userId: r.user_id,
      email: emailById.get(r.user_id) ?? null,
      fullName: nameById.get(r.user_id) ?? null,
      role: r.role,
      createdAt: r.created_at
    }))
  };
});
const createStaffAccount_createServerFn_handler = createServerRpc({
  id: "5a228c3e058f83686bbf84bbf1c3940eb7935655bedc1a63373dccc3b74afde8",
  name: "createStaffAccount",
  filename: "src/lib/admin.functions.ts"
}, (opts) => createStaffAccount.__executeServer(opts));
const createStaffAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  email: stringType().email().max(255),
  fullName: stringType().min(2).max(120),
  password: stringType().min(10).max(72),
  role: enumType(["admin", "staff"])
}).parse(data)).handler(createStaffAccount_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: created,
    error
  } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.fullName
    }
  });
  if (error || !created.user) throw new Error(error?.message ?? "Could not create the account.");
  const {
    error: roleError
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: created.user.id,
    role: data.role
  });
  if (roleError) throw new Error(roleError.message);
  return {
    success: true
  };
});
const setStaffRole_createServerFn_handler = createServerRpc({
  id: "a9020310bc6ecdd7f84c07f6c2a87d701369e39d26a038034f1869231d902459",
  name: "setStaffRole",
  filename: "src/lib/admin.functions.ts"
}, (opts) => setStaffRole.__executeServer(opts));
const setStaffRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  userId: stringType().uuid(),
  role: enumType(["admin", "staff"])
}).parse(data)).handler(setStaffRole_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
  const {
    error
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: data.userId,
    role: data.role
  });
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const revokeStaffAccess_createServerFn_handler = createServerRpc({
  id: "4952c4c4799545ba2ee7ad8a1485996e349fb88e5d4e4da8c6ecc41d05e8fb24",
  name: "revokeStaffAccess",
  filename: "src/lib/admin.functions.ts"
}, (opts) => revokeStaffAccess.__executeServer(opts));
const revokeStaffAccess = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  userId: stringType().uuid()
}).parse(data)).handler(revokeStaffAccess_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  if (data.userId === context.userId) throw new Error("You cannot revoke your own access.");
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    error
  } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
export {
  createStaffAccount_createServerFn_handler,
  deletePost_createServerFn_handler,
  getAttachmentLink_createServerFn_handler,
  listAllPosts_createServerFn_handler,
  listEnquiries_createServerFn_handler,
  listStaff_createServerFn_handler,
  revokeStaffAccess_createServerFn_handler,
  savePost_createServerFn_handler,
  setStaffRole_createServerFn_handler,
  updateEnquiryStatus_createServerFn_handler
};
