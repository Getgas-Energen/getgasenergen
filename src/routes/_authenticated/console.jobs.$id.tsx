import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import {
  getJob,
  saveJob,
  deleteJob,
  saveTask,
  deleteTask,
  type DeliveryJobRow,
  type DeliveryTaskRow,
} from "@/lib/admin.functions";
import {
  DAY_MS,
  JOB_STATUSES,
  KES,
  addDays,
  isTaskOverdue,
  jobStatusLabel,
  parseDate,
  rollupJob,
  shortDate,
  taskDaysComplete,
  taskEnd,
  toISODate,
} from "@/lib/planner";
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

export const Route = createFileRoute("/_authenticated/console/jobs/$id")({
  head: () => ({
    meta: [
      { title: "Job plan | Energen Console" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: JobDetailPage,
});

const num = (v: string) => (v.trim() === "" ? 0 : Number(v));

function JobDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: access } = useAccess();
  const isAdmin = Boolean(access?.isAdmin);

  const fetchJob = useServerFn(getJob);
  const persistJob = useServerFn(saveJob);
  const removeJob = useServerFn(deleteJob);
  const persistTask = useServerFn(saveTask);
  const removeTask = useServerFn(deleteTask);

  const { data, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJob({ data: { id } }),
  });

  const job = data?.job;
  const tasks: DeliveryTaskRow[] = data?.tasks ?? [];
  const roll = useMemo(() => rollupJob(tasks, job), [tasks, job]);

  const [form, setForm] = useState<DeliveryJobRow | null>(null);
  useEffect(() => {
    if (job) setForm(job);
  }, [job]);

  const [newTask, setNewTask] = useState({
    name: "",
    responsible: "",
    startDate: toISODate(new Date()),
    daysRequired: "5",
    progress: "0",
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["job", id] });
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const saveDetails = async () => {
    if (!form) return;
    try {
      await persistJob({
        data: {
          id: form.id,
          title: form.title,
          clientName: form.client_name,
          location: form.location,
          jobType: form.job_type,
          ownerName: form.owner_name,
          startDate: form.start_date,
          targetEndDate: form.target_end_date,
          status: form.status,
          contractValueKes: Number(form.contract_value_kes),
          budgetKes: Number(form.budget_kes),
          spentKes: Number(form.spent_kes),
          invoicedKes: Number(form.invoiced_kes),
          receivedKes: Number(form.received_kes),
          projectId: form.project_id,
          quoteRequestId: form.quote_request_id,
          notes: form.notes,
        },
      });
      toast.success("Job saved");
      invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the job.");
    }
  };

  const addTask = async () => {
    if (newTask.name.trim().length < 2) {
      toast.error("Give the task a name.");
      return;
    }
    try {
      await persistTask({
        data: {
          jobId: id,
          name: newTask.name.trim(),
          responsible: newTask.responsible.trim() || null,
          startDate: newTask.startDate,
          daysRequired: Math.max(1, Math.round(num(newTask.daysRequired))),
          progress: Math.min(100, Math.max(0, num(newTask.progress))),
          sortOrder: (tasks.at(-1)?.sort_order ?? 100) + 1,
        },
      });
      setNewTask({ ...newTask, name: "", responsible: "", progress: "0" });
      invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add the task.");
    }
  };

  const patchTask = async (task: DeliveryTaskRow, patch: Partial<DeliveryTaskRow>) => {
    const merged = { ...task, ...patch };
    try {
      await persistTask({
        data: {
          id: merged.id,
          jobId: merged.job_id,
          name: merged.name,
          responsible: merged.responsible,
          startDate: merged.start_date,
          daysRequired: Math.max(1, Math.round(Number(merged.days_required))),
          progress: Math.min(100, Math.max(0, Number(merged.progress))),
          notes: merged.notes,
          sortOrder: merged.sort_order,
        },
      });
      invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the task.");
    }
  };

  if (isLoading || !form || !job) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  const outstanding = Number(form.invoiced_kes) - Number(form.received_kes);
  const variance = Number(form.budget_kes) - Number(form.spent_kes);

  const moneyFields: [keyof DeliveryJobRow, string][] = [
    ["contract_value_kes", "Contract value"],
    ["budget_kes", "Budget"],
    ["spent_kes", "Spent"],
    ["invoiced_kes", "Invoiced"],
    ["received_kes", "Received"],
  ];

  return (
    <div>
      <Link
        to="/console/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All jobs
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{job.job_code}</p>
          <h1 className="font-display text-xl font-semibold text-foreground">{job.title}</h1>
          <p className="text-sm text-muted-foreground">
            {shortDate(roll.start)} → {shortDate(roll.end)} · {roll.days} days · {roll.progress}%
            complete
            {roll.overdueTasks > 0 ? ` · ${roll.overdueTasks} overdue` : ""}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button size="sm" onClick={saveDetails}>
              Save changes
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                if (!window.confirm("Delete this job and all its tasks?")) return;
                await removeJob({ data: { id } });
                toast.success("Job deleted");
                queryClient.invalidateQueries({ queryKey: ["jobs"] });
                navigate({ to: "/console/jobs" });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------ details */}
      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-sm font-semibold text-foreground">Job details</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Title">
            <Input
              disabled={!isAdmin}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Client">
            <Input
              disabled={!isAdmin}
              value={form.client_name ?? ""}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
            />
          </Field>
          <Field label="Location">
            <Input
              disabled={!isAdmin}
              value={form.location ?? ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <Field label="Job type">
            <Input
              disabled={!isAdmin}
              value={form.job_type ?? ""}
              onChange={(e) => setForm({ ...form, job_type: e.target.value })}
            />
          </Field>
          <Field label="Lead engineer">
            <Input
              disabled={!isAdmin}
              value={form.owner_name ?? ""}
              onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
            />
          </Field>
          <Field label="Status">
            <Select
              disabled={!isAdmin}
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v as DeliveryJobRow["status"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {jobStatusLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Start date">
            <Input
              type="date"
              disabled={!isAdmin}
              value={form.start_date ?? ""}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />
          </Field>
          <Field label="Target completion">
            <Input
              type="date"
              disabled={!isAdmin}
              value={form.target_end_date ?? ""}
              onChange={(e) => setForm({ ...form, target_end_date: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Internal notes" className="mt-3">
          <Textarea
            disabled={!isAdmin}
            rows={3}
            value={form.notes ?? ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Field>
      </section>

      {/* ------------------------------------------------ financials */}
      <section className="mt-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-sm font-semibold text-foreground">Financials (KES)</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {moneyFields.map(([key, label]) => (
            <Field key={key} label={label}>
              <Input
                type="number"
                min={0}
                disabled={!isAdmin}
                value={String(form[key] ?? 0)}
                onChange={(e) => setForm({ ...form, [key]: num(e.target.value) })}
              />
            </Field>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Outstanding (invoiced − received){" "}
          <span className="font-semibold text-foreground">{KES(outstanding)}</span> · Budget variance{" "}
          <span
            className={
              variance < 0 ? "font-semibold text-primary" : "font-semibold text-foreground"
            }
          >
            {KES(variance)}
          </span>
        </p>
      </section>

      {/* ------------------------------------------------ tasks */}
      <section className="mt-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-sm font-semibold text-foreground">Tasks</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Task</th>
                <th className="py-2 pr-3 font-medium">Responsible</th>
                <th className="py-2 pr-3 font-medium">Start</th>
                <th className="py-2 pr-3 font-medium">Days</th>
                <th className="py-2 pr-3 font-medium">End</th>
                <th className="py-2 pr-3 font-medium">Progress</th>
                <th className="py-2 pr-3 font-medium">Done</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-border/60">
                  <td className="py-2 pr-3">
                    <Input
                      disabled={!isAdmin}
                      defaultValue={task.name}
                      onBlur={(e) =>
                        e.target.value !== task.name && patchTask(task, { name: e.target.value })
                      }
                      className="h-8 min-w-[180px] text-sm"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <Input
                      disabled={!isAdmin}
                      defaultValue={task.responsible ?? ""}
                      onBlur={(e) =>
                        e.target.value !== (task.responsible ?? "") &&
                        patchTask(task, { responsible: e.target.value })
                      }
                      className="h-8 min-w-[120px] text-sm"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <Input
                      type="date"
                      disabled={!isAdmin}
                      defaultValue={task.start_date}
                      onBlur={(e) =>
                        e.target.value &&
                        e.target.value !== task.start_date &&
                        patchTask(task, { start_date: e.target.value })
                      }
                      className="h-8 w-[140px] text-sm"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <Input
                      type="number"
                      min={1}
                      disabled={!isAdmin}
                      defaultValue={task.days_required}
                      onBlur={(e) =>
                        Number(e.target.value) !== task.days_required &&
                        patchTask(task, { days_required: Number(e.target.value) })
                      }
                      className="h-8 w-16 text-sm"
                    />
                  </td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground">
                    {shortDate(taskEnd(task))}
                    {isTaskOverdue(task) && (
                      <span className="ml-1 font-semibold text-primary">late</span>
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      disabled={!isAdmin}
                      defaultValue={Number(task.progress)}
                      onBlur={(e) =>
                        Number(e.target.value) !== Number(task.progress) &&
                        patchTask(task, { progress: Number(e.target.value) })
                      }
                      className="h-8 w-20 text-sm"
                    />
                  </td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground">
                    {taskDaysComplete(task)}d
                  </td>
                  <td className="py-2">
                    {isAdmin && (
                      <button
                        onClick={async () => {
                          await removeTask({ data: { id: task.id } });
                          invalidate();
                        }}
                        className="text-muted-foreground hover:text-primary"
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 text-sm text-muted-foreground">
                    No tasks yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isAdmin && (
          <div className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-6">
            <Input
              className="sm:col-span-2"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              placeholder="New task"
            />
            <Input
              value={newTask.responsible}
              onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}
              placeholder="Responsible"
            />
            <Input
              type="date"
              value={newTask.startDate}
              onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
            />
            <Input
              type="number"
              min={1}
              value={newTask.daysRequired}
              onChange={(e) => setNewTask({ ...newTask, daysRequired: e.target.value })}
              placeholder="Days"
            />
            <Button onClick={addTask}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        )}
      </section>

      {tasks.length > 0 && <Gantt tasks={tasks} />}
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

/** CSS-grid Gantt strip: one row per task across a day-by-day timeline. */
function Gantt({ tasks }: { tasks: DeliveryTaskRow[] }) {
  const starts = tasks.map((t) => parseDate(t.start_date)).filter((d): d is Date => Boolean(d));
  const ends = tasks.map(taskEnd).filter((d): d is Date => Boolean(d));
  if (starts.length === 0 || ends.length === 0) return null;

  const first = new Date(Math.min(...starts.map((d) => d.getTime())));
  const last = new Date(Math.max(...ends.map((d) => d.getTime())));
  const totalDays = Math.round((last.getTime() - first.getTime()) / DAY_MS) + 1;
  const dayWidth = 16;

  const weekMarks: { offset: number; label: string }[] = [];
  for (let i = 0; i < totalDays; i += 7) {
    weekMarks.push({
      offset: i,
      label: addDays(first, i).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    });
  }

  const today = new Date();
  const todayOffset = Math.round(
    (new Date(toISODate(today) + "T00:00:00").getTime() - first.getTime()) / DAY_MS,
  );

  return (
    <section className="mt-4 rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-sm font-semibold text-foreground">Schedule</h2>
      <div className="mt-3 overflow-x-auto">
        <div style={{ width: totalDays * dayWidth + 200 }}>
          <div className="flex">
            <div className="w-[200px] shrink-0" />
            <div className="relative h-5" style={{ width: totalDays * dayWidth }}>
              {weekMarks.map((m) => (
                <span
                  key={m.offset}
                  className="absolute top-0 whitespace-nowrap text-[10px] text-muted-foreground"
                  style={{ left: m.offset * dayWidth }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          {tasks.map((task) => {
            const start = parseDate(task.start_date);
            const end = taskEnd(task);
            if (!start || !end) return null;
            const offset = Math.round((start.getTime() - first.getTime()) / DAY_MS);
            const span = Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1;
            const pct = Math.min(100, Math.max(0, Number(task.progress)));
            return (
              <div key={task.id} className="flex items-center border-t border-border/60 py-1.5">
                <div className="w-[200px] shrink-0 truncate pr-3 text-xs text-foreground">
                  {task.name}
                </div>
                <div className="relative h-4" style={{ width: totalDays * dayWidth }}>
                  {todayOffset >= 0 && todayOffset < totalDays && (
                    <span
                      className="absolute top-0 h-4 w-px bg-primary/40"
                      style={{ left: todayOffset * dayWidth }}
                    />
                  )}
                  <div
                    className="absolute top-0.5 h-3 rounded-sm bg-accent/30"
                    style={{ left: offset * dayWidth, width: Math.max(dayWidth, span * dayWidth) }}
                  >
                    <div
                      className="h-3 rounded-sm bg-accent"
                      style={{ width: `${pct}%` }}
                      title={`${task.name} — ${pct}%`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Light bar = planned duration · solid fill = completed · vertical line = today
      </p>
    </section>
  );
}
