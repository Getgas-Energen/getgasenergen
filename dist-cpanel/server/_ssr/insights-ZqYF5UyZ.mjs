import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as logoAsset, i as insightsQuery } from "./router-fUomsfZT.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { S as SectionHeading } from "./SectionHeading-BIqcZ4Gv.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { m as Newspaper, n as PenLine, o as CalendarDays } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
import "../_libs/isbot.mjs";
import "./auth-middleware-C4Eb0lWp.mjs";
import "../_libs/zod.mjs";
function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function InsightsPage() {
  const {
    data
  } = useSuspenseQuery(insightsQuery);
  const [filter, setFilter] = reactExports.useState("all");
  const posts = data.posts.filter((p) => filter === "all" || p.category === filter);
  const tabs = [{
    key: "all",
    label: "All"
  }, {
    key: "news",
    label: "News"
  }, {
    key: "blog",
    label: "Blog"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Insights", title: "News, projects and engineering notes.", description: "Announcements from Getgas Energen alongside practical articles on designing, metering and operating LPG infrastructure." }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(tab.key), className: filter === tab.key ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" : "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary", children: tab.label }, tab.key)) }),
      data.error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-sm text-muted-foreground", children: data.error }),
      !data.error && posts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 text-sm text-muted-foreground", children: "No articles published yet — check back soon." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: posts.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/insights/$slug", params: {
        slug: post.slug
      }, className: "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/9] overflow-hidden bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: post.cover_url || logoAsset.url, alt: post.title, loading: "lazy", className: post.cover_url ? "h-full w-full object-cover transition-transform group-hover:scale-[1.03]" : "h-full w-full object-contain p-10 opacity-70" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent", children: [
            post.category === "news" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-3 w-3" }),
            post.category
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary", children: post.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 flex-1 text-sm text-muted-foreground line-clamp-3", children: post.excerpt }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5" }),
            formatDate(post.published_at)
          ] })
        ] })
      ] }, post.id)) })
    ] })
  ] });
}
export {
  InsightsPage as component
};
