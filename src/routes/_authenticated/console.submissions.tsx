import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Paperclip, Download, Mail, Phone, Search } from "lucide-react";
import {
  listEnquiries,
  getAttachmentLink,
  updateEnquiry,
  type EnquiryRow,
} from "@/lib/admin.functions";
import { useAccess } from "./console";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/console/submissions")({
  head: () => ({
    meta: [
      { title: "Submissions | Energen Console" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: SubmissionsPage,
});

const STATUSES = ["new", "in_progress", "quoted", "won", "closed"] as const;
type Status = (typeof STATUSES)[number];
const label = (s: string) => s.replace("_", " ");

function SubmissionsPage() {
  const queryClient = useQueryClient();
  const { data: access } = useAccess();
  const isAdmin = Boolean(access?.isAdmin);

  const fetchEnquiries = useServerFn(listEnquiries);
  const fetchLink = useServerFn(getAttachmentLink);
  const save = useServerFn(updateEnquiry);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: () => fetchEnquiries({}),
  });

  const rows: EnquiryRow[] = data?.enquiries ?? [];

  const types = useMemo(
    () => Array.from(new Set(rows.map((r) => r.project_type))).sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (type !== "all" && r.project_type !== type) return false;
      const day = r.created_at.slice(0, 10);
      if (from && day < from) return false;
      if (to && day > to) return false;
      if (
        q &&
        ![r.name, r.company ?? "", r.email, r.phone].some((v) => v.toLowerCase().includes(q))
      )
        return false;
      return true;
    });
  }, [rows, status, type, from, to, search]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of rows) map[r.status] = (map[r.status] ?? 0) + 1;
    return map;
  }, [rows]);

  const download = async (path: string) => {
    try {
      const { url } = await fetchLink({ data: { path } });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not open the file.");
    }
  };

  const patch = async (id: string, patchData: { status?: Status; internalNote?: string }) => {
    try {
      await save({ data: { id, ...patchData } });
      toast.success("Submission updated");
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-xl font-semibold text-foreground">Submissions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Website enquiries, newest first. Showing {filtered.length} of {rows.length}.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(status === s ? "all" : s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
              status === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {label(s)} · {counts[s] ?? 0}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, company, email, phone"
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="All project types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All project types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && filtered.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No submissions match these filters.</p>
      )}

      <div className="mt-4 space-y-3">
        {filtered.map((e) => (
          <div key={e.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  {e.name}
                  {e.company ? <span className="text-muted-foreground"> · {e.company}</span> : null}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-accent">
                  {e.project_type}
                </p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <a
                    href={`mailto:${e.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5" /> {e.email}
                  </a>
                  <a
                    href={`tel:${e.phone}`}
                    className="inline-flex items-center gap-1.5 hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5" /> {e.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">
                  {new Date(e.created_at).toLocaleString("en-GB")}
                </p>
                {isAdmin ? (
                  <Select
                    value={e.status}
                    onValueChange={(v) => patch(e.id, { status: v as Status })}
                  >
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">
                          {label(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                    {label(e.status)}
                  </span>
                )}
              </div>
            </div>

            <p
              className={
                expanded === e.id
                  ? "mt-4 whitespace-pre-line text-sm text-foreground"
                  : "mt-4 line-clamp-2 whitespace-pre-line text-sm text-foreground"
              }
            >
              {e.message}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {expanded === e.id ? "Show less" : "Read full message"}
              </button>
              {e.attachment_path && (
                <Button size="sm" variant="outline" onClick={() => download(e.attachment_path!)}>
                  <Paperclip className="mr-2 h-3.5 w-3.5" />
                  Attachment
                  <Download className="ml-2 h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {isAdmin ? (
              <div className="mt-4 border-t border-border pt-3">
                <Textarea
                  value={noteDraft[e.id] ?? e.internal_note ?? ""}
                  onChange={(ev) => setNoteDraft({ ...noteDraft, [e.id]: ev.target.value })}
                  placeholder="Internal note (not sent to the customer)"
                  rows={2}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => patch(e.id, { internalNote: noteDraft[e.id] ?? "" })}
                >
                  Save note
                </Button>
              </div>
            ) : (
              e.internal_note && (
                <p className="mt-3 rounded-md bg-surface p-3 text-sm text-muted-foreground">
                  Note: {e.internal_note}
                </p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
