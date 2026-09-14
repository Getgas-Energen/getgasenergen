import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SectionHeading } from "./SectionHeading-BIqcZ4Gv.mjs";
import { h as heroImage, r as residentialImage, m as manifoldImage, c as commercialImage } from "./project-commercial-BlyvFQvU.mjs";
const projects = [{
  img: heroImage,
  type: "Bulk storage",
  title: "5,000L bulk tank & manifold",
  location: "Karen, Nairobi",
  scope: "Bulk tank installation with auto-changeover regulators and OPSO/UPSO protection for a 64-unit estate.",
  capacity: "5,000 L · 64 units"
}, {
  img: residentialImage,
  type: "Reticulation",
  title: "120-unit estate reticulation",
  location: "Kiambu Road",
  scope: "Centralized piped gas to all 120 apartments with individual metering and emergency isolation per riser.",
  capacity: "120 apartments"
}, {
  img: manifoldImage,
  type: "Manifold",
  title: "LOT cylinder manifold",
  location: "Westlands",
  scope: "47.5 kg LOT cylinder manifold with auto-changeover for a mid-rise commercial building.",
  capacity: "16 × 47.5 kg"
}, {
  img: commercialImage,
  type: "Commercial kitchen",
  title: "Hotel kitchen piped gas",
  location: "Mombasa",
  scope: "Piped LPG supply to 14 appliances across two commercial kitchens with leak detection and shut-off.",
  capacity: "14 appliances"
}, {
  img: residentialImage,
  type: "Residential",
  title: "Townhouse cluster",
  location: "Runda",
  scope: "Shared bulk tank serving 12 townhouses with individual meters and remote leak monitoring.",
  capacity: "12 units"
}, {
  img: heroImage,
  type: "Industrial",
  title: "Process heating retrofit",
  location: "Athi River",
  scope: "Converted a diesel-fired process line to bulk LPG with redundant supply and BMS integration.",
  capacity: "Industrial"
}];
const sectors = ["All", "Residential", "Commercial", "Industrial"];
function ProjectsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Projects", title: "Selected installations", description: "A snapshot of recent reticulation, bulk storage and piped gas projects we've designed and delivered." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex flex-wrap gap-2", children: sectors.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: i === 0 ? "rounded-full bg-steel px-4 py-1.5 text-xs font-semibold text-steel-foreground" : "rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground", children: s }, s)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3", children: projects.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[4/3] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.img, alt: p.title, loading: "lazy", className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-accent font-semibold", children: p.type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.location })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-display text-lg font-semibold", children: p.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: p.scope }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground", children: p.capacity })
      ] })
    ] }, i)) }) })
  ] });
}
export {
  ProjectsPage as component
};
