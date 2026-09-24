import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createJobFromQuote, listQuoteRequests, updateQuoteRequest } from "@/lib/admin.functions";
import { useAccess } from "./console";

export const Route = createFileRoute("/_authenticated/console/quotes")({
  head: () => ({
    meta: [
      { title: "Quote requests | Getgas Energen Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ConsoleQuotes,
});

const statuses = ["new", "reviewing", "quoted", "won", "lost"] as const;
const money = (v: number | null) => (v === null ? "—" : `KES ${Number(v).toLocaleString("en-KE")}`);

function ConsoleQuotes() {
  const { data: access } = useAccess();
  const isAdmin = Boolean(access?.isAdmin);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fetchQuotes = useServerFn(listQuoteRequests);
  const update = useServerFn(updateQuoteRequest);
  const toJob = useServerFn(createJobFromQuote);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-quotes"],
    queryFn: () => fetchQuotes({}),
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: (typeof statuses)[number] }) =>
      update({ data: { id: vars.id, status: vars.status } }),
    onSuccess: () => {
      toast.success("Quote request updated.");
      queryClient.invalidateQueries({ queryKey: ["admin-quotes"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not update"),
  });

  const jobMutation = useMutation({
    mutationFn: (quoteId: string) => toJob({ data: { quoteId } }),
    onSuccess: (res) => {
      toast.success(res.existed ? "Opening existing job." : "Job created.");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      navigate({ to: "/console/jobs/$id", params: { id: res.id } });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not create job"),
  });

  const all = data?.quotes ?? [];
  const quotes = useMemo(() => {
    const s = search.trim().toLowerCase();
    return all.filter(
      (q) =>
        (filter === "all" || q.status === filter) &&
        (!s ||
          [q.reference, q.contact_name, q.company ?? "", q.location, q.email].some((v) =>
            String(v ?? "").toLowerCase().includes(s),
          )),
    );
  }, [all, filter, search]);

  return (
    <div>
      <h1 className="font-display text-xl font-semibold text-foreground">Quote requests</h1>
      <p className="text-sm text-muted-foreground">
        Submitted through the client portal. Each client already received the indicative range by
        email and SMS.
      </p>

      <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Reference, name, company, location"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses ({all.length})</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s} ({all.filter((q) => q.status === s).length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : quotes.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No quote requests match.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {quotes.map((q) => (
            <article key={q.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-semibold text-foreground">
                    {q.reference} · {q.building_type} · {q.units} unit(s)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {q.contact_name}
                    {q.company ? ` (${q.company})` : ""} · {q.phone} · {q.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {q.location} · supply: {q.supply_type}
                    {q.timeline ? ` · ${q.timeline}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(q.created_at).toLocaleString("en-KE")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {money(q.estimate_low_kes)} – {money(q.estimate_high_kes)}
                  </span>
                  {isAdmin ? (
                    <Select
                      value={q.status}
                      onValueChange={(v) =>
                        statusMutation.mutate({ id: q.id, status: v as (typeof statuses)[number] })
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-xs text-muted-foreground">Status: {q.status}</span>
                  )}
                </div>
              </div>

              {q.appliances && (
                <p className="mt-3 text-sm text-muted-foreground">Appliances: {q.appliances}</p>
              )}
              {q.notes && (
                <p className="mt-3 rounded-md bg-surface p-3 text-sm text-muted-foreground">
                  “{q.notes}”
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
