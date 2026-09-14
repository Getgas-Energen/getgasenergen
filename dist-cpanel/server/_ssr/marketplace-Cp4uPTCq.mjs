import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./router-fUomsfZT.mjs";
import { S as SectionHeading } from "./SectionHeading-BIqcZ4Gv.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { W as Wrench, p as CircleDot, S as ShieldCheck, q as Flame, r as Cylinder, G as Gauge, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
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
import "../_libs/zod.mjs";
const categories = [{
  id: "all",
  label: "All",
  icon: Gauge
}, {
  id: "pipes",
  label: "Pipes & Fittings",
  icon: Wrench
}, {
  id: "regulators",
  label: "Regulators & Valves",
  icon: CircleDot
}, {
  id: "fireplaces",
  label: "Fireplaces",
  icon: Flame
}, {
  id: "cylinders",
  label: "Cylinders & Manifolds",
  icon: Cylinder
}, {
  id: "safety",
  label: "Safety Accessories",
  icon: ShieldCheck
}];
const products = [{
  name: "Copper Pipe — 15mm × 3m",
  category: "pipes",
  spec: "EN 1057 R250, half-hard",
  icon: Wrench
}, {
  name: "Brass Compression Tee — 15mm",
  category: "pipes",
  spec: "DZR brass, BS EN 1254",
  icon: Wrench
}, {
  name: 'Black Iron Pipe — 1/2" × 6m',
  category: "pipes",
  spec: "ASTM A53, threaded ends",
  icon: Wrench
}, {
  name: "Flexible Stainless Hose",
  category: "pipes",
  spec: 'AISI 304, 1m, ½" BSP',
  icon: Wrench
}, {
  name: "Auto-Changeover Regulator",
  category: "regulators",
  spec: "2 × 4 kg/h, 37 mbar outlet",
  icon: CircleDot
}, {
  name: "OPSO / UPSO Safety Valve",
  category: "regulators",
  spec: "Excess pressure shut-off",
  icon: ShieldCheck
}, {
  name: "First-Stage Regulator — 12 kg/h",
  category: "regulators",
  spec: "0.75 bar outlet, bulk service",
  icon: CircleDot
}, {
  name: 'Ball Valve — ½" BSP',
  category: "regulators",
  spec: "Brass, lever handle, gas-rated",
  icon: CircleDot
}, {
  name: "Built-in Linear Fireplace",
  category: "fireplaces",
  spec: "1.2 m glass front, LPG, remote",
  icon: Flame
}, {
  name: "Free-standing Patio Heater",
  category: "fireplaces",
  spec: "Stainless, 13 kW, piezo ignition",
  icon: Flame
}, {
  name: "Cast Iron Stove Fireplace",
  category: "fireplaces",
  spec: "8 kW, viewing glass, LPG kit",
  icon: Flame
}, {
  name: "13 kg LPG Cylinder",
  category: "cylinders",
  spec: "EN 1442, refillable",
  icon: Cylinder
}, {
  name: "47.5 kg LOT Cylinder",
  category: "cylinders",
  spec: "Liquid off-take, manifold-ready",
  icon: Cylinder
}, {
  name: "6-Cylinder GOT Manifold",
  category: "cylinders",
  spec: "Auto-changeover, copper pigtails",
  icon: Cylinder
}, {
  name: "Gas Leak Detector",
  category: "safety",
  spec: "LPG-specific, audible + visual",
  icon: ShieldCheck
}, {
  name: "Emergency Shut-off Solenoid",
  category: "safety",
  spec: '12V DC, ½" BSP, NC',
  icon: ShieldCheck
}];
function MarketplacePage() {
  const [active, setActive] = reactExports.useState("all");
  const filtered = active === "all" ? products : products.filter((p) => p.category === active);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Marketplace", title: "Gas hardware, sourced right.", description: "Pipes, fittings, regulators, fireplaces and safety gear — request a quote and we deliver across Kenya." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex flex-wrap gap-2", children: categories.map((c) => {
        const isActive = active === c.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActive(c.id), className: isActive ? "inline-flex items-center gap-2 rounded-full bg-steel px-4 py-2 text-sm font-semibold text-steel-foreground" : "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-4 w-4" }),
          c.label
        ] }, c.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-accent/40 hover:shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square blueprint-grid bg-surface flex items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: "h-16 w-16 text-blueprint", strokeWidth: 1.4 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 text-[10px] uppercase tracking-wider rounded bg-card/90 px-2 py-1 font-semibold text-muted-foreground border border-border", children: categories.find((c) => c.id === p.category)?.label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground flex-1", children: p.spec }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", children: "Request quote" }) })
        ] })
      ] }, p.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-14 rounded-2xl border border-border bg-steel text-steel-foreground p-8 sm:p-10 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-bold", children: "Need a bulk quote or custom spec?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-white/70", children: "Share your BOQ and we'll get back with pricing, lead times and delivery options." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex lg:justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-accent text-accent-foreground hover:bg-accent/90", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/contact", children: [
          "Get a quote ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  MarketplacePage as component
};
