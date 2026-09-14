import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useServerFn, B as Button, c as createSsrRpc } from "./router-fUomsfZT.mjs";
import { L as Label, I as Input } from "./label-LPZwiXmQ.mjs";
import { T as Textarea } from "./textarea-CyIMUA6w.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-s0dTlQt3.mjs";
import { S as SectionHeading } from "./SectionHeading-BIqcZ4Gv.mjs";
import { c as createServerFn } from "./server-CxX94B5h.mjs";
import "../_libs/seroval.mjs";
import { l as Send, a as MapPin, P as Phone, b as Mail } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
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
import "./client-DXyBvONw.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./auth-middleware-C4Eb0lWp.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
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
const contactSchema = objectType({
  name: stringType().min(1).max(100),
  company: stringType().max(200).optional().default(""),
  email: stringType().email().max(255),
  phone: stringType().min(1).max(50),
  projectType: stringType().min(1).max(100),
  message: stringType().min(1).max(5e3),
  attachmentPath: stringType().max(300).optional().nullable()
});
const submitContactForm = createServerFn({
  method: "POST"
}).inputValidator((data) => contactSchema.parse(data)).handler(createSsrRpc("24d672fb73584c0403d628777d6e29971e34c8317bf1373db52c3b2cb37fcb61"));
function ContactPage() {
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [projectType, setProjectType] = reactExports.useState("feasibility");
  const [file, setFile] = reactExports.useState(null);
  const submitForm = useServerFn(submitContactForm);
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      let attachmentPath = null;
      if (file) {
        const upload = new FormData();
        upload.append("file", file);
        const res = await fetch("/api/public/enquiry-attachment", {
          method: "POST",
          body: upload
        });
        const json = await res.json();
        if (!res.ok || !json.path) {
          throw new Error(json.error || "Could not upload your file.");
        }
        attachmentPath = json.path;
      }
      await submitForm({
        data: {
          name: String(formData.get("name") || ""),
          company: String(formData.get("company") || ""),
          email: String(formData.get("email") || ""),
          phone: String(formData.get("phone") || ""),
          projectType,
          message: String(formData.get("message") || ""),
          attachmentPath
        }
      });
      toast.success("Thanks — we'll get back to you within one business day.");
      form.reset();
      setFile(null);
      setProjectType("feasibility");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Contact", title: "Tell us about your project.", description: "Share a few details and we'll come back with next steps — design proposal, site visit, or product quote." }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Full name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", name: "name", required: true, placeholder: "Jane Mwangi" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "company", children: "Company / project" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "company", name: "company", placeholder: "Optional" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", name: "email", type: "email", required: true, placeholder: "you@example.com" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", name: "phone", type: "tel", required: true, placeholder: "+254 …" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "type", children: "Project type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "type", value: projectType, onValueChange: setProjectType, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "feasibility", children: "Feasibility Study" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "design", children: "Engineering Design" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "reticulation", children: "Gas Reticulation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "storage", children: "Bulk LPG Storage" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "epc", children: "EPC (Engineering, Procurement, Construction)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "metering", children: "Smart Metering & Vending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "safety", children: "Safety Systems" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "om", children: "Operations & Maintenance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "marketplace", children: "Equipment / Marketplace" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other", children: "Other" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "message", children: "Project details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "message", name: "message", required: true, rows: 5, placeholder: "Site location, scope, units, timeline…" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "attachment", children: "Attachment (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "attachment", name: "attachment", type: "file", accept: ".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.dwg,.zip", onChange: (e) => setFile(e.target.files?.[0] ?? null), className: "cursor-pointer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Drawings, site photos, BOQs or tender documents — up to 15 MB." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "lg", disabled: submitting, className: "bg-accent text-accent-foreground hover:bg-accent/90", children: submitting ? "Sending…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Send enquiry ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "ml-2 h-4 w-4" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-steel text-steel-foreground p-6 sm:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold", children: "Reach us directly" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-6 space-y-5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-md bg-white/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-accent" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-white/55", children: "Headquarters" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-white/90", children: "Tatu City, Nairobi, Kenya" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-md bg-white/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 text-accent" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-white/55", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:+254702947573", className: "mt-1 block text-white/90 hover:text-accent", children: "+254 702 947 573" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-md bg-white/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 text-accent" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-white/55", children: "WhatsApp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://wa.me/254747752600", target: "_blank", rel: "noopener noreferrer", className: "mt-1 block text-white/90 hover:text-accent", children: "+254 747 752 600" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-md bg-white/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-accent" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-white/55", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:getgasenergenkenya@gmail.com", className: "mt-1 block text-white/90 hover:text-accent", children: "getgasenergenkenya@gmail.com" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-6 sm:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-semibold", children: "Response time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "We reply to enquiries within one business day. Urgent? Call us directly — we'll route you to an on-call engineer." })
        ] })
      ] })
    ] })
  ] });
}
export {
  ContactPage as component
};
