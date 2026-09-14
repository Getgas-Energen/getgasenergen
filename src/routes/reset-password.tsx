import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a New Password | Getgas Energen" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated — you're signed in.");
    navigate({ to: "/console", replace: true });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-surface px-4 py-16">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-8">
        <div>
          <h1 className="font-display text-lg font-semibold text-foreground">Set a new password</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Open this page from the reset link in your email.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Saving…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
