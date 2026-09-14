import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, ShieldOff } from "lucide-react";
import { listStaff, createStaffAccount, setStaffRole, revokeStaffAccess } from "@/lib/admin.functions";
import { useAccess } from "./console";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/console/users")({
  head: () => ({
    meta: [
      { title: "Team | Energen Console" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const queryClient = useQueryClient();
  const { data: access } = useAccess();
  const fetchStaff = useServerFn(listStaff);
  const createAccount = useServerFn(createStaffAccount);
  const changeRole = useServerFn(setStaffRole);
  const revoke = useServerFn(revokeStaffAccess);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");
  const [busy, setBusy] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: () => fetchStaff({}),
    enabled: access?.isAdmin === true,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["staff"] });

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createAccount({ data: { email, fullName, password, role } });
      toast.success("Account created — share the password securely.");
      setEmail("");
      setFullName("");
      setPassword("");
      setRole("staff");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the account.");
    } finally {
      setBusy(false);
    }
  };

  if (access && !access.isAdmin) {
    return <p className="text-sm text-muted-foreground">Only administrators can manage the team.</p>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-foreground">Team</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Administrators can publish articles and manage enquiries. Staff have read-only access.
      </p>

      <form onSubmit={onCreate} className="mt-6 space-y-5 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-base font-semibold text-foreground">Add a team member</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" required minLength={2} value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Temporary password</Label>
            <Input
              id="password"
              type="text"
              required
              minLength={10}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 10 characters"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Access level</Label>
            <Select value={role} onValueChange={(v) => setRole(v as "admin" | "staff")}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff (read-only)</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" disabled={busy}>
          <UserPlus className="mr-2 h-4 w-4" />
          {busy ? "Creating…" : "Create account"}
        </Button>
      </form>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        {isLoading && <p className="p-5 text-sm text-muted-foreground">Loading…</p>}
        {data?.staff.map((member) => (
          <div
            key={member.userId}
            className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4 last:border-b-0"
          >
            <div>
              <p className="font-medium text-foreground">{member.fullName || member.email}</p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={member.role}
                onValueChange={async (v) => {
                  try {
                    await changeRole({ data: { userId: member.userId, role: v as "admin" | "staff" } });
                    toast.success("Access level updated");
                    refresh();
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Update failed.");
                  }
                }}
              >
                <SelectTrigger className="h-8 w-[150px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
              {member.userId !== access?.userId && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    if (!window.confirm(`Remove console access for ${member.email}?`)) return;
                    try {
                      await revoke({ data: { userId: member.userId } });
                      toast.success("Access removed");
                      refresh();
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Could not remove access.");
                    }
                  }}
                  aria-label="Remove access"
                >
                  <ShieldOff className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
