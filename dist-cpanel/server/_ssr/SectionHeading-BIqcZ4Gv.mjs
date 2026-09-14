import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl", children: [
    eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-6 bg-accent" }),
      eyebrow
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-3xl sm:text-4xl font-bold text-foreground", children: title }),
    description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base text-muted-foreground leading-relaxed", children: description })
  ] });
}
export {
  SectionHeading as S
};
