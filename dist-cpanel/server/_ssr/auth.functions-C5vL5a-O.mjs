import { c as createServerRpc } from "./createServerRpc-Cd4a5Gg1.mjs";
import { c as createServerFn } from "./server-CxX94B5h.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C4Eb0lWp.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
const getMyAccess_createServerFn_handler = createServerRpc({
  id: "daf599c6ea5ee66c12bdf6d5c84a05ee91c49a2dc1d44046f12414998a94be30",
  name: "getMyAccess",
  filename: "src/lib/auth.functions.ts"
}, (opts) => getMyAccess.__executeServer(opts));
const getMyAccess = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyAccess_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId,
    claims
  } = context;
  const {
    data: roles
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const {
    data: profile
  } = await supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle();
  const roleList = (roles ?? []).map((r) => r.role);
  return {
    userId,
    email: typeof claims["email"] === "string" ? claims["email"] : null,
    fullName: profile?.full_name ?? null,
    isAdmin: roleList.includes("admin"),
    isStaff: roleList.length > 0
  };
});
export {
  getMyAccess_createServerFn_handler
};
