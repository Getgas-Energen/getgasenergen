import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LogIn, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoAsset from "@/assets/getgas-logo.png.asset.json";

export const Route = createFileRoute("/staff-login")({
  head: () => ({
    meta: [
      { title: "Staff Sign In | Getgas Energen" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { name: "googlebot", content: "noindex, nofollow" },
    ],
  }),
  component: StaffLoginPage,
});

function StaffLoginPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in");
    navigate({ to: "/console", replace: true });
  };

  const onForgot = async () => {
    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent — check your inbox.");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-surface px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--royal-deep)] p-2">
            <img src={logoAsset.url} alt="Getgas Energen" className="h-full w-auto" />
          </span>
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground">Staff sign in</h1>
            <p className="text-xs text-muted-foreground">Getgas Energen internal console</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@getgas.co.ke"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Signing in…" : <>Sign in <LogIn className="ml-2 h-4 w-4" /></>}
          </Button>
        </form>

        <button
          type="button"
          onClick={onForgot}
          className="mt-4 text-xs font-medium text-muted-foreground underline hover:text-primary"
        >
          Forgot password?
        </button>

        <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          Accounts are created by an administrator. There is no public sign-up.
        </p>
      </div>
    </div>
  );
}
