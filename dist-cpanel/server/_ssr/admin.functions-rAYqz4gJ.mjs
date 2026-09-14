import { c as createSsrRpc } from "./router-fUomsfZT.mjs";
import { c as createServerFn } from "./server-CxX94B5h.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C4Eb0lWp.mjs";
import { o as objectType, e as enumType, s as stringType } from "../_libs/zod.mjs";
const listEnquiries = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("cef7bc3fb7f232d49bcb94a03d6376f0ebe97c8b1e0772a40ab8f3f83f9d2304"));
const getAttachmentLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  path: stringType().min(1).max(300)
}).parse(data)).handler(createSsrRpc("abfcbb19ad248889167b3160ca6d170f4bb6da5f34a7498639fca17fcf1302ff"));
const updateEnquiryStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid(),
  status: enumType(["new", "in_progress", "quoted", "won", "closed"])
}).parse(data)).handler(createSsrRpc("91704ae56ad06abd0900158ccd0e953157a61b9dfb1e1d9bf34013f9d18da618"));
const listAllPosts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("bc1243debc8c647783e75940a0e8be9e80d2bba927fb3a5c5286e4de4113312a"));
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
const savePost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => postInput.parse(data)).handler(createSsrRpc("9d5cdbf465e564d67c9c8f21883c7ff7211d3ffdaee07b653be33f2ae502fe6b"));
const deletePost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  id: stringType().uuid()
}).parse(data)).handler(createSsrRpc("61d2f1a485e46ff0eb3e0ec858fe930d4738d44e986914f73963d7f45a3ff47c"));
const listStaff = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("c1af7edbca370233d33088c9dbe9780c1b054f6de6009e094ff0cf89de204739"));
const createStaffAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  email: stringType().email().max(255),
  fullName: stringType().min(2).max(120),
  password: stringType().min(10).max(72),
  role: enumType(["admin", "staff"])
}).parse(data)).handler(createSsrRpc("5a228c3e058f83686bbf84bbf1c3940eb7935655bedc1a63373dccc3b74afde8"));
const setStaffRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  userId: stringType().uuid(),
  role: enumType(["admin", "staff"])
}).parse(data)).handler(createSsrRpc("a9020310bc6ecdd7f84c07f6c2a87d701369e39d26a038034f1869231d902459"));
const revokeStaffAccess = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
  userId: stringType().uuid()
}).parse(data)).handler(createSsrRpc("4952c4c4799545ba2ee7ad8a1485996e349fb88e5d4e4da8c6ecc41d05e8fb24"));
export {
  listAllPosts as a,
  listStaff as b,
  createStaffAccount as c,
  deletePost as d,
  savePost as e,
  getAttachmentLink as g,
  listEnquiries as l,
  revokeStaffAccess as r,
  setStaffRole as s,
  updateEnquiryStatus as u
};
