import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { listJobs, saveJob, type DeliveryJobRow } from "@/lib/admin.functions";
import {
  JOB_STATUSES,
  KES,
  groupTasksByJob,
  jobStatusLabel,
  rollupJob,
  shortDate,
} from "@/lib/planner";
import { useAccess } from "./console";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/console/jobs")({
  head: () => ({
    meta: [
      { title: "Delivery jobs | Energen Console" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: access } = useAccess();
  const isAdmin = Boolean(access?.isAdmin);

  const fetchJobs = useServerFn(listJobs);
  const create = useServerFn(saveJob);

  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [location, setLocation] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["jobs"], queryFn: () => fetchJobs({}) });

  const jobs: DeliveryJobRow[] = data?.jobs ?? [];
  const tasksByJob = useMemo(() => groupTasksByJob(data?.tasks ?? []), [data?.tasks]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (status !== "all" && j.status !== status) return false;
      if (
        q &&
        ![j.job_code, j.title, j.client_name ?? "", j.location ?? "", j.owner_name ?? ""].some((v) =>
          v.toLowerCase().includes(q),
        )
      )
        return false;
      return true;
    });
  }, [jobs, status, search]);

  const submit = async () => {
    if (title.trim().length < 3) {
      toast.error("Give the job a title.");
      return;
    }
    try {
      const res = await create({
        data: {
          title: title.trim(),
          clientName: client.trim() || null,
          location: location.trim() || null,
          status: "planning",
        },
      });
      toast.success("Job created");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setCreating(false);
      setTitle("");
      setClient("");
      setLocation("");
      navigate({ to: "/console/jobs/$id", params: { id: res.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the job.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">Delivery jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Internal engineering delivery register with schedule and financial tracking.
          </p>
        </div>
        {isAdmin && (
          <Button size="sm" onClick={() => setCreating((v) => !v)}>
            <Plus className="mr-2 h-4 w-4" /> New job
          </Button>
        )}
      </div>

      {creating && (
        <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job title" />
          <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
          <div className="flex gap-2">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
            />
            <Button onClick={submit}>Create</Button>
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Code, title, client, owner"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {JOB_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {jobStatusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && filtered.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No jobs yet.</p>
      )}

      <div className="mt-4 space-y-3">
        {filtered.map((job) => {
          const tasks = tasksByJob.get(job.id) ?? [];
          const roll = rollupJob(tasks, job);
          const outstanding = Number(job.invoiced_kes) - Number(job.received_kes);
          const variance = Number(job.budget_kes) - Number(job.spent_kes);
          return (
            <Link
              key={job.id}
              to="/console/jobs/$id"
              params={{ id: job.id }}
              className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{job.job_code}</p>
                  <p className="font-display text-base font-semibold text-foreground">
                    {job.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[job.client_name, job.location, job.owner_name].filter(Boolean).join(" · ") ||
                      "No client set"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {jobStatusLabel(job.status)}
                  </span>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {shortDate(roll.start)} → {shortDate(roll.end)} · {roll.taskCount} task
                    {roll.taskCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-accent"
                    style={{ width: `${roll.progress}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-semibold text-foreground">
                  {roll.progress}%
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-5">
                {[
                  ["Contract", KES(job.contract_value_kes)],
                  ["Budget", KES(job.budget_kes)],
                  ["Spent", KES(job.spent_kes)],
                  ["Invoiced", KES(job.invoiced_kes)],
                  ["Received", KES(job.received_kes)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 text-xs text-muted-foreground">
                Outstanding {KES(outstanding)} · Budget variance{" "}
                <span className={variance < 0 ? "font-semibold text-primary" : ""}>
                  {KES(variance)}
                </span>
                {roll.overdueTasks > 0 ? ` · ${roll.overdueTasks} task(s) overdue` : ""}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
