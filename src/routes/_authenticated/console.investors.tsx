import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { listInvestorLeads, updateInvestorLead, type InvestorLeadRow } from "@/lib/admin.functions";
import { useAccess } from "./console";

export const Route = createFileRoute("/_authenticated/console/investors")({
  head: () => ({
    meta: [
      { title: "Investor requests | Energen Console" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: InvestorsConsole,
});

const statuses = ["new", "reviewing", "nda_signed", "access_granted", "declined"] as const;
type Status = (typeof statuses)[number];
const label = (s: string) => s.replace(/_/g, " ");

function InvestorsConsole() {
  const { data: access } = useAccess();
  const isAdmin = Boolean(access?.isAdmin);
  const qc = useQueryClient();
  const fetchLeads = useServerFn(listInvestorLeads);
  const update = useServerFn(updateInvestorLead);
  const [filter, setFilter] = useState("all");

  const { data, isLoading } = useQuery({ queryKey: ["investor-leads"], queryFn: () => fetchLeads({}) });
  const m = useMutation({
    mutationFn: (v: { id: string; status?: Status; internalNote?: string | null }) => update({ data: v }),
    onSuccess: () => {
      toast.success("Investor request updated.");
      qc.invalidateQueries({ queryKey: ["investor-leads"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not update"),
  });

  const leads: InvestorLeadRow[] = (data?.leads ?? []).filter((l) => filter === "all" || l.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">Investor requests</h1>
          <p className="text-sm text-muted-foreground">NDA-gated data room requests from the Investor Relations page.</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s}>{label(s)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : leads.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No investor requests.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {leads.map((l) => <LeadCard key={l.id} lead={l} isAdmin={isAdmin} onUpdate={(v) => m.mutate({ id: l.id, ...v })} />)}
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead: l, isAdmin, onUpdate }: { lead: InvestorLeadRow; isAdmin: boolean; onUpdate: (v: { status?: Status; internalNote?: string | null }) => void }) {
  const [note, setNote] = useState(l.internal_note ?? "");
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display font-semibold text-foreground">{l.reference} · {l.full_name}</p>
          <p className="text-sm text-muted-foreground">
            {[l.role_title, l.organisation, l.investor_type].filter(Boolean).join(" · ")}
          </p>
          <p className="text-sm text-muted-foreground">{l.email}{l.phone ? ` · ${l.phone}` : ""}</p>
          <p className="text-sm text-muted-foreground">
            Ticket: {l.ticket_band || "—"}{l.interest_area ? ` · ${l.interest_area}` : ""}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            NDA {l.nda_version} accepted {new Date(l.nda_accepted_at).toLocaleString("en-KE")}
          </p>
        </div>
        {isAdmin ? (
          <Select value={l.status} onValueChange={(v) => onUpdate({ status: v as Status })}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {statuses.map((s) => <SelectItem key={s} value={s}>{label(s)}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-xs text-muted-foreground">Status: {label(l.status)}</span>
        )}
      </div>
      {l.message && <p className="mt-3 rounded-md bg-surface p-3 text-sm text-muted-foreground">“{l.message}”</p>}
      {isAdmin && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note" className="min-h-16" />
          <Button size="sm" variant="outline" onClick={() => onUpdate({ internalNote: note.trim() || null })}>Save note</Button>
        </div>
      )}
    </article>
  );
}
