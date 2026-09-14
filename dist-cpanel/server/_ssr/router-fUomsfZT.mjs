import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, q as queryOptions, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { U as notFound, V as redirect, I as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { R as Root, T as Trigger, P as Portal, C as Content, a as Close, b as Title, O as Overlay, D as Description } from "../_libs/radix-ui__react-dialog.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-DXyBvONw.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-CxX94B5h.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C4Eb0lWp.mjs";
import { M as Menu, a as MapPin, P as Phone, b as Mail, E as ExternalLink, X } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
function useServerFn(serverFn) {
  const router2 = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router2.stores.location.get();
        return router2.navigate(router2.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router2, serverFn]);
}
const appCss = "/assets/styles-DITD_WKk.css";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Sheet = Root;
const SheetTrigger = Trigger;
const SheetPortal = Portal;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = Content.displayName;
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = Title.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = Description.displayName;
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const url = "/__l5e/assets-v1/6717e138-01ab-45da-af77-63490e88522d/getgas-logo.png";
const logoAsset = {
  url
};
const navItems = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/projects", label: "Projects" },
  { to: "/smart-metering", label: "Smart Metering" },
  { to: "/safety-systems", label: "Safety" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];
function Header() {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAsset.url, alt: "Getgas Energen", className: "h-9 w-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline font-display text-[15px] font-semibold tracking-tight text-foreground", children: "Energen" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden xl:flex items-center gap-0.5", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: item.to,
        className: "px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors",
        activeProps: { className: "px-3 py-2 text-sm font-semibold text-primary" },
        activeOptions: { exact: item.to === "/" },
        children: item.label
      },
      item.to
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden xl:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "bg-primary text-primary-foreground hover:bg-primary/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", children: "Request a Quote" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, className: "xl:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", "aria-label": "Open menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "right", className: "w-72", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "sr-only", children: "Navigation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col gap-1", children: [
          navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: item.to,
              onClick: () => setOpen(false),
              className: "rounded-md px-3 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
              activeProps: { className: "rounded-md px-3 py-3 text-base font-semibold bg-muted text-primary" },
              activeOptions: { exact: item.to === "/" },
              children: item.label
            },
            item.to
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4 bg-primary text-primary-foreground hover:bg-primary/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", onClick: () => setOpen(false), children: "Request a Quote" }) })
        ] })
      ] })
    ] })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mt-24 border-t border-border bg-[var(--royal-deep)] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 md:grid-cols-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-12 place-items-center rounded-lg bg-white p-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoAsset.url, alt: "Getgas Energen", className: "h-full w-auto" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-lg font-bold", children: [
            "Getgas ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Energen" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-sm text-white/70 leading-relaxed max-w-sm", children: "The engineering, EPC, metering and safety division of Getgas Holdings PLC. Designing East Africa's LPG infrastructure." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs text-white/55 italic", children: "Design. Build. Meter. Protect. Operate. Scale." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold uppercase tracking-wider text-white/90", children: "Company" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-white/70", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "hover:text-accent", children: "About" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/services", className: "hover:text-accent", children: "Services" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/industries", className: "hover:text-accent", children: "Industries" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/projects", className: "hover:text-accent", children: "Projects" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/marketplace", className: "hover:text-accent", children: "Marketplace" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/insights", className: "hover:text-accent", children: "Insights" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold uppercase tracking-wider text-white/90", children: "Solutions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-white/70", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/smart-metering", className: "hover:text-accent", children: "Smart Metering & Vending" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/safety-systems", className: "hover:text-accent", children: "Safety Systems" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "EPC Delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Operations & Maintenance" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold uppercase tracking-wider text-white/90", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-3 text-sm text-white/70", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 mt-0.5 text-accent shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tatu City, Nairobi, Kenya" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 mt-0.5 text-accent shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "+254 702 947 573" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 mt-0.5 text-accent shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "getgasenergenkenya@gmail.com" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-lg border border-white/10 bg-white/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-white/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-accent", children: "Also from Getgas:" }),
        " Cooking gas on demand via AGREGAS Marketplace."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: "https://getgas.co.ke",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline",
          children: [
            "Visit AGREGAS ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/55", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Getgas Energen Ltd · A Getgas Holdings PLC company."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "EPRA · KEBS · Petroleum Act 2019 compliant" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/staff-login", rel: "nofollow", className: "text-white/40 hover:text-accent", children: "Staff" })
      ] })
    ] })
  ] }) });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-accent", children: "Error 404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-display text-6xl font-bold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "mt-6 inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90",
        children: "Back home"
      }
    )
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-semibold text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted", children: "Go home" })
    ] })
  ] }) });
}
const Route$l = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Getgas Energen — East Africa's LPG Infrastructure & Energy Engineering Company" },
      { name: "description", content: "Getgas Energen designs, builds, meters and operates LPG infrastructure for residential, commercial, industrial and institutional clients across East Africa." },
      { name: "author", content: "Getgas Energen Ltd" },
      { name: "theme-color", content: "#2E006B" },
      { property: "og:title", content: "Getgas Energen — East Africa's LPG Infrastructure & Energy Engineering Company" },
      { property: "og:description", content: "Getgas Energen designs, builds, meters and operates LPG infrastructure for residential, commercial, industrial and institutional clients across East Africa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Getgas Energen — East Africa's LPG Infrastructure & Energy Engineering Company" },
      { name: "twitter:description", content: "Getgas Energen designs, builds, meters and operates LPG infrastructure for residential, commercial, industrial and institutional clients across East Africa." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/0kd2J18DwKZZH8dzNoE0vbULLFH3/social-images/social-1780927702087-1001589134.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/0kd2J18DwKZZH8dzNoE0vbULLFH3/social-images/social-1780927702087-1001589134.webp" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$l.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
const $$splitComponentImporter$i = () => import("./index-0nmpSlmM.mjs");
const Route$k = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Getgas Energen — East Africa's LPG Infrastructure & Energy Engineering Company"
    }, {
      name: "description",
      content: "Designing, Building, Metering and Operating LPG Infrastructure for Residential, Commercial, Industrial and Institutional Clients."
    }, {
      property: "og:title",
      content: "Getgas Energen — LPG Infrastructure Engineering"
    }, {
      property: "og:description",
      content: "Design. Build. Meter. Protect. Operate. Scale."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./route-BFsOu0JM.mjs");
const Route$j = createFileRoute()({
  ssr: false,
  beforeLoad: async () => {
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({
      to: "/staff-login"
    });
    return {
      user: data.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./about-CdA__gme.mjs");
const Route$i = createFileRoute()({
  head: () => ({
    meta: [{
      title: "About — Getgas Energen Ltd | Kenya LPG Engineering"
    }, {
      name: "description",
      content: "Founded in 2016, Getgas Energen is a Kenyan LPG engineering company expanding safe access to gas through reticulation, storage and on-demand supply."
    }, {
      property: "og:title",
      content: "About Getgas Energen Ltd"
    }, {
      property: "og:description",
      content: "Kenyan LPG engineering company, founded 2016, headquartered in Nairobi with presence in Canada."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./contact-CCKUZpVN.mjs");
const Route$h = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Contact — Request a Quote | Getgas Energen Ltd"
    }, {
      name: "description",
      content: "Talk to Getgas Energen about gas reticulation design, bulk storage, installation or marketplace products. Based in Tatu City, Nairobi, Kenya."
    }, {
      property: "og:title",
      content: "Contact Getgas Energen Ltd"
    }, {
      property: "og:description",
      content: "Request a quote for LPG design, installation or hardware."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./industries-Cr_LVrDh.mjs");
const Route$g = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Industries — LPG Solutions by Sector | Getgas Energen"
    }, {
      name: "description",
      content: "LPG infrastructure tailored to residential, education, healthcare, hospitality, agriculture, industrial, commercial, government and defence clients."
    }, {
      property: "og:title",
      content: "Industries — Getgas Energen"
    }, {
      property: "og:description",
      content: "Sector-specific LPG infrastructure across East Africa."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
var createSsrRpc = (functionId) => {
  const url2 = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url: url2,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const listPublishedPosts = createServerFn({
  method: "GET"
}).handler(createSsrRpc("5fe60e791ae1c4ab62ee6bd8909ae94dd24896e0fe96a3205532983707e7ff7f"));
const getPublishedPost = createServerFn({
  method: "GET"
}).inputValidator((data) => objectType({
  slug: stringType().min(1).max(200)
}).parse(data)).handler(createSsrRpc("31aff609c51e03f2604b1f92844f581e9d1e67cdd3e1733579cce5b3f166dad0"));
const insightsQuery = queryOptions({
  queryKey: ["published-posts"],
  queryFn: () => listPublishedPosts()
});
const $$splitNotFoundComponentImporter$1 = () => import("./insights-Dy8TMaLk.mjs");
const $$splitErrorComponentImporter$1 = () => import("./insights-DjRn5QFI.mjs");
const $$splitComponentImporter$d = () => import("./insights-ZqYF5UyZ.mjs");
const Route$f = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Insights — LPG Engineering News & Articles | Getgas Energen"
    }, {
      name: "description",
      content: "News, project updates and technical articles on LPG reticulation, bulk storage, smart metering and gas safety across East Africa."
    }, {
      property: "og:title",
      content: "Insights — Getgas Energen Ltd"
    }, {
      property: "og:description",
      content: "LPG engineering news, project updates and technical articles from Getgas Energen."
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }]
  }),
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(insightsQuery),
  component: lazyRouteComponent($$splitComponentImporter$d, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent")
});
const $$splitComponentImporter$c = () => import("./marketplace-Cp4uPTCq.mjs");
const Route$e = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Marketplace — Gas Pipes, Fittings & Fireplaces | Getgas Energen"
    }, {
      name: "description",
      content: "Browse pipes, fittings, regulators, valves, fireplaces, cylinders and safety accessories. Request a quote and we deliver across Kenya."
    }, {
      property: "og:title",
      content: "Marketplace — Getgas Energen"
    }, {
      property: "og:description",
      content: "Quality gas hardware: pipes, fittings, fireplaces and more."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./projects-BUNUmTSF.mjs");
const Route$d = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Projects — LPG Installations Across Kenya | Getgas Energen"
    }, {
      name: "description",
      content: "Selected gas reticulation, bulk storage and piped LPG installations by Getgas Energen across residential, commercial and industrial sectors."
    }, {
      property: "og:title",
      content: "Projects — Getgas Energen Ltd"
    }, {
      property: "og:description",
      content: "Case studies of LPG reticulation and bulk storage installations."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./reset-password-Cbj3jLtA.mjs");
const Route$c = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Set a New Password | Getgas Energen"
    }, {
      name: "robots",
      content: "noindex, nofollow, noarchive"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./safety-systems-B0dzApq0.mjs");
const Route$b = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Safety Systems — Gas Leak Detection, ESD & Fire Integration | Getgas Energen"
    }, {
      name: "description",
      content: "Intelligent gas safety infrastructure: continuous leak detection, automatic shut-off, gas control panels, fire alarm integration, emergency shutdown and 24/7 remote monitoring."
    }, {
      property: "og:title",
      content: "Safety Systems — Getgas Energen"
    }, {
      property: "og:description",
      content: "Detect. Isolate. Protect. Respond."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./services-D5OridpE.mjs");
const Route$a = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Services — Gas Reticulation & Storage Design | Getgas Energen"
    }, {
      name: "description",
      content: "LPG reticulation design, bulk storage, engineering drawings, installation, commissioning and maintenance for residential, commercial and industrial sites."
    }, {
      property: "og:title",
      content: "Engineering Services — Getgas Energen Ltd"
    }, {
      property: "og:description",
      content: "End-to-end LPG engineering: design, install, commission, maintain."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./smart-metering-DrOPgJed.mjs");
const Route$9 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Smart Metering & Vending — The Future of LPG Utility Management"
    }, {
      name: "description",
      content: "Prepaid LPG metering, tenant billing, mobile-money integration, consumption analytics, leak detection and remote shut-off. IoT-connected meters with landlord, tenant and portfolio dashboards."
    }, {
      property: "og:title",
      content: "Smart Metering & Vending — Getgas Energen"
    }, {
      property: "og:description",
      content: "Prepaid LPG meters, mobile-money billing, leak detection and remote shut-off — built for property managers."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./staff-login-Cpq4Yzll.mjs");
const Route$8 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Staff Sign In | Getgas Energen"
    }, {
      name: "robots",
      content: "noindex, nofollow, noarchive"
    }, {
      name: "googlebot",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const getMyAccess = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("daf599c6ea5ee66c12bdf6d5c84a05ee91c49a2dc1d44046f12414998a94be30"));
const $$splitComponentImporter$5 = () => import("./console-CaukUATj.mjs");
const Route$7 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Console | Getgas Energen"
    }, {
      name: "robots",
      content: "noindex, nofollow, noarchive, nosnippet"
    }, {
      name: "googlebot",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
function useAccess() {
  const fetchAccess = useServerFn(getMyAccess);
  return useQuery({
    queryKey: ["my-access"],
    queryFn: () => fetchAccess({})
  });
}
const postQuery = (slug) => queryOptions({
  queryKey: ["published-post", slug],
  queryFn: () => getPublishedPost({
    data: {
      slug
    }
  })
});
const $$splitNotFoundComponentImporter = () => import("./insights._slug-2l3SI0Fl.mjs");
const $$splitErrorComponentImporter = () => import("./insights._slug-BntkRNSb.mjs");
const $$splitComponentImporter$4 = () => import("./insights._slug-5PsmYLVN.mjs");
const Route$6 = createFileRoute()({
  loader: async ({
    context,
    params
  }) => {
    const result = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!result.post) throw notFound();
    return result;
  },
  head: ({
    loaderData
  }) => {
    const post = loaderData?.post;
    const title = post ? `${post.title} | Getgas Energen Insights` : "Insights | Getgas Energen";
    const description = post?.excerpt || "Insights from Getgas Energen Ltd.";
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: description
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: description
      }, {
        property: "og:type",
        content: "article"
      }, {
        name: "twitter:card",
        content: "summary_large_image"
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const $$splitComponentImporter$3 = () => import("./console.index-CFoDmfbe.mjs");
const Route$5 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Enquiries | Energen Console"
    }, {
      name: "robots",
      content: "noindex, nofollow, noarchive"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./console.posts-De6EjCrz.mjs");
const Route$4 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Insights | Energen Console"
    }, {
      name: "robots",
      content: "noindex, nofollow, noarchive"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./console.users-BneXL3Eg.mjs");
const Route$3 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Team | Energen Console"
    }, {
      name: "robots",
      content: "noindex, nofollow, noarchive"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.ms-excel",
  "application/acad",
  "image/vnd.dwg",
  "application/zip"
];
const Route$2 = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let form;
        try {
          form = await request.formData();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid upload" }), { status: 400 });
        }
        const file = form.get("file");
        if (!(file instanceof File)) {
          return Response.json({ error: "No file provided" }, { status: 400 });
        }
        if (file.size === 0 || file.size > MAX_BYTES) {
          return Response.json({ error: "File must be between 1 byte and 15 MB" }, { status: 400 });
        }
        if (file.type && !ALLOWED.includes(file.type)) {
          return Response.json({ error: "Unsupported file type" }, { status: 400 });
        }
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "attachment";
        const objectPath = `${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
        const { supabaseAdmin } = await import("./client.server-D5ro3rAQ.mjs");
        const { error } = await supabaseAdmin.storage.from("submissions").upload(objectPath, await file.arrayBuffer(), {
          contentType: file.type || "application/octet-stream",
          upsert: false
        });
        if (error) {
          console.error("enquiry attachment upload", error);
          return Response.json({ error: "Upload failed" }, { status: 500 });
        }
        return Response.json({ path: objectPath });
      }
    }
  }
});
const $$splitComponentImporter = () => import("./console.posts._id-fI6sQEYj.mjs");
const Route$1 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Edit article | Energen Console"
    }, {
      name: "robots",
      content: "noindex, nofollow, noarchive"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Route = createFileRoute()({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const objectPath = params._splat ?? "";
        if (!objectPath || objectPath.includes("..")) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("./client.server-D5ro3rAQ.mjs");
        const { data: post } = await supabaseAdmin.from("posts").select("id").eq("status", "published").eq("cover_url", `/api/public/media/${objectPath}`).maybeSingle();
        if (!post) {
          return new Response("Not found", { status: 404 });
        }
        const { data, error } = await supabaseAdmin.storage.from("post-media").download(objectPath);
        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }
        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
const IndexRoute = Route$k.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$l
});
const AuthenticatedRouteRoute = Route$j.update({
  id: "/_authenticated",
  getParentRoute: () => Route$l
});
const AboutRoute = Route$i.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$l
});
const ContactRoute = Route$h.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$l
});
const IndustriesRoute = Route$g.update({
  id: "/industries",
  path: "/industries",
  getParentRoute: () => Route$l
});
const InsightsRoute = Route$f.update({
  id: "/insights",
  path: "/insights",
  getParentRoute: () => Route$l
});
const MarketplaceRoute = Route$e.update({
  id: "/marketplace",
  path: "/marketplace",
  getParentRoute: () => Route$l
});
const ProjectsRoute = Route$d.update({
  id: "/projects",
  path: "/projects",
  getParentRoute: () => Route$l
});
const ResetPasswordRoute = Route$c.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$l
});
const SafetySystemsRoute = Route$b.update({
  id: "/safety-systems",
  path: "/safety-systems",
  getParentRoute: () => Route$l
});
const ServicesRoute = Route$a.update({
  id: "/services",
  path: "/services",
  getParentRoute: () => Route$l
});
const SmartMeteringRoute = Route$9.update({
  id: "/smart-metering",
  path: "/smart-metering",
  getParentRoute: () => Route$l
});
const StaffLoginRoute = Route$8.update({
  id: "/staff-login",
  path: "/staff-login",
  getParentRoute: () => Route$l
});
const AuthenticatedConsoleRoute = Route$7.update({
  id: "/console",
  path: "/console",
  getParentRoute: () => AuthenticatedRouteRoute
});
const InsightsSlugRoute = Route$6.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => InsightsRoute
});
const AuthenticatedConsoleIndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedConsoleRoute
});
const AuthenticatedConsolePostsRoute = Route$4.update({
  id: "/posts",
  path: "/posts",
  getParentRoute: () => AuthenticatedConsoleRoute
});
const AuthenticatedConsoleUsersRoute = Route$3.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => AuthenticatedConsoleRoute
});
const ApiPublicEnquiryAttachmentRoute = Route$2.update({
  id: "/api/public/enquiry-attachment",
  path: "/api/public/enquiry-attachment",
  getParentRoute: () => Route$l
});
const AuthenticatedConsolePostsIdRoute = Route$1.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => AuthenticatedConsolePostsRoute
});
const ApiPublicMediaSplatRoute = Route.update({
  id: "/api/public/media/$",
  path: "/api/public/media/$",
  getParentRoute: () => Route$l
});
const AuthenticatedConsolePostsRouteChildren = {
  AuthenticatedConsolePostsIdRoute
};
const AuthenticatedConsolePostsRouteWithChildren = AuthenticatedConsolePostsRoute._addFileChildren(
  AuthenticatedConsolePostsRouteChildren
);
const AuthenticatedConsoleRouteChildren = {
  AuthenticatedConsolePostsRoute: AuthenticatedConsolePostsRouteWithChildren,
  AuthenticatedConsoleUsersRoute,
  AuthenticatedConsoleIndexRoute
};
const AuthenticatedConsoleRouteWithChildren = AuthenticatedConsoleRoute._addFileChildren(AuthenticatedConsoleRouteChildren);
const AuthenticatedRouteRouteChildren = {
  AuthenticatedConsoleRoute: AuthenticatedConsoleRouteWithChildren
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const InsightsRouteChildren = {
  InsightsSlugRoute
};
const InsightsRouteWithChildren = InsightsRoute._addFileChildren(
  InsightsRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AboutRoute,
  ContactRoute,
  IndustriesRoute,
  InsightsRoute: InsightsRouteWithChildren,
  MarketplaceRoute,
  ProjectsRoute,
  ResetPasswordRoute,
  SafetySystemsRoute,
  ServicesRoute,
  SmartMeteringRoute,
  StaffLoginRoute,
  ApiPublicEnquiryAttachmentRoute,
  ApiPublicMediaSplatRoute
};
const routeTree = Route$l._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  Route$6 as R,
  useAccess as a,
  cn as b,
  createSsrRpc as c,
  Route$1 as d,
  getMyAccess as g,
  insightsQuery as i,
  logoAsset as l,
  postQuery as p,
  router as r,
  useServerFn as u
};
