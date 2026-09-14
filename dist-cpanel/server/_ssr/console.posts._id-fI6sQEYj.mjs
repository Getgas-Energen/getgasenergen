import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { d as Route$1, a as useAccess, u as useServerFn, B as Button } from "./router-fUomsfZT.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as listAllPosts, e as savePost } from "./admin.functions-rAYqz4gJ.mjs";
import { s as supabase } from "./client-DXyBvONw.mjs";
import { L as Label, I as Input } from "./label-LPZwiXmQ.mjs";
import { T as Textarea } from "./textarea-CyIMUA6w.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-s0dTlQt3.mjs";
import "../_libs/seroval.mjs";
import { K as ArrowLeft, a3 as ImagePlus, a4 as Save } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./server-CxX94B5h.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./auth-middleware-C4Eb0lWp.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
function PostEditor() {
  const {
    id
  } = Route$1.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: access
  } = useAccess();
  const fetchPosts = useServerFn(listAllPosts);
  const save = useServerFn(savePost);
  const {
    data
  } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => fetchPosts({}),
    enabled: !isNew
  });
  const [title, setTitle] = reactExports.useState("");
  const [slug, setSlug] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("news");
  const [excerpt, setExcerpt] = reactExports.useState("");
  const [body, setBody] = reactExports.useState("");
  const [coverUrl, setCoverUrl] = reactExports.useState(null);
  const [status, setStatus] = reactExports.useState("draft");
  const [busy, setBusy] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const [loaded, setLoaded] = reactExports.useState(isNew);
  reactExports.useEffect(() => {
    if (isNew || loaded || !data) return;
    const post = data.posts.find((p) => p.id === id);
    if (!post) return;
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setBody(post.body);
    setCoverUrl(post.cover_url);
    setStatus(post.status);
    setLoaded(true);
  }, [data, id, isNew, loaded]);
  const onUpload = async (file) => {
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${(/* @__PURE__ */ new Date()).getFullYear()}/${crypto.randomUUID()}.${ext}`;
    const {
      error
    } = await supabase.storage.from("post-media").upload(path, file, {
      contentType: file.type,
      upsert: false
    });
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setCoverUrl(`/api/public/media/${path}`);
    toast.success("Cover image uploaded");
  };
  const onSave = async () => {
    setBusy(true);
    try {
      const result = await save({
        data: {
          id: isNew ? null : id,
          title,
          slug: slug || null,
          category,
          excerpt,
          body,
          coverUrl,
          status
        }
      });
      toast.success(status === "published" ? "Article published" : "Draft saved");
      queryClient.invalidateQueries({
        queryKey: ["admin-posts"]
      });
      queryClient.invalidateQueries({
        queryKey: ["published-posts"]
      });
      queryClient.invalidateQueries({
        queryKey: ["published-post", result.slug]
      });
      navigate({
        to: "/console/posts"
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the article.");
    } finally {
      setBusy(false);
    }
  };
  if (access && !access.isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Only administrators can edit articles." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/console/posts", children: "Back" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/console/posts", className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " All articles"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-display text-2xl font-bold text-foreground", children: isNew ? "New article" : "Edit article" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-5 rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "title", value: title, onChange: (e) => setTitle(e.target.value), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "slug", children: "Web address (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "slug", value: slug, onChange: (e) => setSlug(e.target.value), placeholder: "auto-generated from title" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: category, onValueChange: (v) => setCategory(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "category", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "news", children: "News" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "blog", children: "Blog" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "excerpt", children: "Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "excerpt", rows: 2, value: excerpt, onChange: (e) => setExcerpt(e.target.value), placeholder: "One or two sentences shown in the article list." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "body", children: "Article" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "body", rows: 16, value: body, onChange: (e) => setBody(e.target.value), placeholder: "Write the article here. Leave a blank line between paragraphs." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cover image" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
          coverUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: coverUrl, alt: "Cover preview", className: "h-20 w-32 rounded-md border border-border object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-4 w-4" }),
            uploading ? "Uploading…" : coverUrl ? "Replace image" : "Upload image",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload(file);
            } })
          ] }),
          coverUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCoverUrl(null), className: "text-xs text-muted-foreground underline hover:text-destructive", children: "Remove" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The image only becomes publicly visible once the article is published." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "status", children: "Visibility" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: status, onValueChange: (v) => setStatus(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "status", className: "w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft (hidden)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "published", children: "Published" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onSave, disabled: busy || uploading || title.trim().length < 3, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
          busy ? "Saving…" : "Save"
        ] })
      ] })
    ] })
  ] });
}
export {
  PostEditor as component
};
