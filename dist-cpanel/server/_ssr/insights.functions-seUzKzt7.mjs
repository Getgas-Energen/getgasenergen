import { c as createServerRpc } from "./createServerRpc-Cd4a5Gg1.mjs";
import { c as createServerFn } from "./server-CxX94B5h.mjs";
import { c as createPublicServerClient } from "./supabase-public.server-B2WpVwxZ.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const LIST_COLUMNS = "id, slug, title, category, excerpt, cover_url, published_at";
const listPublishedPosts_createServerFn_handler = createServerRpc({
  id: "5fe60e791ae1c4ab62ee6bd8909ae94dd24896e0fe96a3205532983707e7ff7f",
  name: "listPublishedPosts",
  filename: "src/lib/insights.functions.ts"
}, (opts) => listPublishedPosts.__executeServer(opts));
const listPublishedPosts = createServerFn({
  method: "GET"
}).handler(listPublishedPosts_createServerFn_handler, async () => {
  const supabase = createPublicServerClient();
  const {
    data,
    error
  } = await supabase.from("posts").select(LIST_COLUMNS).eq("status", "published").order("published_at", {
    ascending: false
  }).limit(60);
  if (error) {
    console.error("listPublishedPosts", error);
    return {
      posts: [],
      error: "Unable to load articles right now."
    };
  }
  return {
    posts: data ?? [],
    error: null
  };
});
const getPublishedPost_createServerFn_handler = createServerRpc({
  id: "31aff609c51e03f2604b1f92844f581e9d1e67cdd3e1733579cce5b3f166dad0",
  name: "getPublishedPost",
  filename: "src/lib/insights.functions.ts"
}, (opts) => getPublishedPost.__executeServer(opts));
const getPublishedPost = createServerFn({
  method: "GET"
}).inputValidator((data) => objectType({
  slug: stringType().min(1).max(200)
}).parse(data)).handler(getPublishedPost_createServerFn_handler, async ({
  data
}) => {
  const supabase = createPublicServerClient();
  const {
    data: post,
    error
  } = await supabase.from("posts").select(`${LIST_COLUMNS}, body`).eq("status", "published").eq("slug", data.slug).maybeSingle();
  if (error) {
    console.error("getPublishedPost", error);
    return {
      post: null
    };
  }
  return {
    post: post ?? null
  };
});
export {
  getPublishedPost_createServerFn_handler,
  listPublishedPosts_createServerFn_handler
};
