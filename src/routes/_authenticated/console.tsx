import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  LogOut,
  Inbox,
  FileText,
  Users,
  ShoppingCart,
  Package,
  Building2,
  Calculator,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccess } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/getgas-logo.png.asset.json";

export const Route = createFileRoute("/_authenticated/console")({
  head: () => ({
    meta: [
      { title: "Console | Getgas Energen" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
      { name: "googlebot", content: "noindex, nofollow" },
    ],
  }),
  component: ConsoleLayout,
});

export function useAccess() {
  const fetchAccess = useServerFn(getMyAccess);
  return useQuery({ queryKey: ["my-access"], queryFn: () => fetchAccess({}) });
}

function ConsoleLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: access, isLoading, isError } = useAccess();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/staff-login", replace: true });
  };

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground">Loading…</div>;
  }

  if (isError || !access?.isStaff) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-xl font-semibold">No console access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account is not registered as staff. Ask an administrator to grant access.
        </p>
        <Button onClick={signOut} variant="outline" className="mt-6">
          Sign out
        </Button>
      </div>
    );
  }

  const tabs = [
    { to: "/console", label: "Enquiries", icon: Inbox, exact: true },
    { to: "/console/orders", label: "Orders", icon: ShoppingCart, exact: false },
    { to: "/console/shop", label: "Marketplace", icon: Package, exact: false },
    { to: "/console/quotes", label: "Quotes", icon: Calculator, exact: false },
    { to: "/console/projects", label: "Projects", icon: Building2, exact: false },
    { to: "/console/posts", label: "Insights", icon: FileText, exact: false },
    ...(access.isAdmin ? [{ to: "/console/users", label: "Team", icon: Users, exact: false }] : []),
  ] as const;

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--royal-deep)] p-1.5">
              <img src={logoAsset.url} alt="Getgas Energen" className="h-full w-auto" />
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-foreground">Energen Console</p>
              <p className="text-xs text-muted-foreground">
                {access.fullName || access.email} · {access.isAdmin ? "Administrator" : "Staff"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                activeOptions={{ exact: tab.exact }}
                className="flex items-center gap-2 border-b-2 border-transparent px-3 py-3 text-sm font-medium text-muted-foreground hover:text-primary"
                activeProps={{
                  className:
                    "flex items-center gap-2 border-b-2 border-primary px-3 py-3 text-sm font-semibold text-primary",
                }}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}
