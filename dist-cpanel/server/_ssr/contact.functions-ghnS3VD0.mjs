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
const contactSchema = objectType({
  name: stringType().min(1).max(100),
  company: stringType().max(200).optional().default(""),
  email: stringType().email().max(255),
  phone: stringType().min(1).max(50),
  projectType: stringType().min(1).max(100),
  message: stringType().min(1).max(5e3),
  attachmentPath: stringType().max(300).optional().nullable()
});
const submitContactForm_createServerFn_handler = createServerRpc({
  id: "24d672fb73584c0403d628777d6e29971e34c8317bf1373db52c3b2cb37fcb61",
  name: "submitContactForm",
  filename: "src/lib/contact.functions.ts"
}, (opts) => submitContactForm.__executeServer(opts));
const submitContactForm = createServerFn({
  method: "POST"
}).inputValidator((data) => contactSchema.parse(data)).handler(submitContactForm_createServerFn_handler, async ({
  data
}) => {
  const supabase = createPublicServerClient();
  const {
    error
  } = await supabase.from("contact_submissions").insert({
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone,
    project_type: data.projectType,
    message: data.message,
    attachment_path: data.attachmentPath || null
  });
  if (error) {
    console.error("Contact submission error:", error);
    throw new Error("Failed to submit contact form. Please try again.");
  }
  return {
    success: true
  };
});
export {
  submitContactForm_createServerFn_handler
};
