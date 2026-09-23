import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { getDashboard } from "@/lib/admin.functions";
import {
  KES,
  groupTasksByJob,
  isTaskOverdue,
  jobStatusLabel,
  rollupJob,
  shortDate,
  taskEnd,
} from "@/lib/planner";

export const Route = createFileRoute("/_authenticated/console/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Energen Console" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: DashboardPage;
});

function DashboardPage() {
  const fetchDashboard = useServerFn(getDashboard);
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard({}),
  });

  const jobs = data?.jobs ?? [];
  const tasks = data?.tasks ?? [];
  const tasksByJob = useMemo(() => groupTasksByJob(tasks), [tasks]);

  const attention = useMemo(
    () =>
      tasks
        .filter((t) => isTaskOverdue(t) || Number(t.progress) < 100)
        .sort((a, b) => (taskEnd(a)?.getTime() ?? 0) - (taskEnd(b)?.getTime() ?? 0))
        .slice(0, 8),
    [tasks],
  );

  const jobTitle = (id: string) => jobs.find((j) => j.id === id)?.title ?? "—";

  const counts = data?.counts;
  const money = data?.money;

  return (
    <div>
      <h1 className="font-display text-xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Delivery, commercial and investor pipeline at a glance.
      </p>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}

      {counts && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Open enquiries", value: counts.enquiriesOpen, sub: `${counts.enquiriesTotal} total`, to: "/console/submissions" as const },
            { label: "Open quote requests", value: counts.quotesOpen, sub: `${counts.quotesTotal} total`, to: "/console/quotes" as const },
            { label: "Active delivery jobs", value: counts.jobsActive, sub: `${jobs.length} in register`, to: "/console/jobs" as const },
            { label: "Open orders", value: counts.ordersOpen, sub: `${counts.ordersUnpaid} awaiting payment`, to: "/console/orders" as const },
            { label: "Investor requests", value: counts.investorsOpen, sub: `${counts.investorsTotal} total`, to: "/console/investors" as const },
            { label: "Overdue tasks", value: tasks.filter((t) => isTaskOverdue(t)).length, sub: `${tasks.length} tasks tracked`, to: "/console/jobs" as const },
          ].map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{card.label}</p>
              <p className="mt-2 font-display text-3xl font-bold text-foreground">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
            </Link>
          ))}
        </div>
      )}

      {money && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-base font-semibold text-foreground">
            Portfolio financials
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["Contract value", KES(money.contract)],
              ["Budget", KES(money.budget)],
              ["Spent", KES(money.spent)],
              ["Invoiced", KES(money.invoiced)],
              ["Received", KES(money.received)],
              ["Outstanding", KES(money.invoiced - money.received)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="mt-0.5 font-semibold text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-foreground">
              Delivery portfolio
            </h2>
            <Link to="/console/jobs" className="text-xs font-semibold text-primary hover:underline">
              All jobs <ArrowRight className="inline h-3 w-3" />
            </Link>
          </div>
          {jobs.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No jobs in the register yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {jobs.slice(0, 6).map((job) => {
                const roll = rollupJob(tasksByJob.get(job.id) ?? [], job);
                return (
                  <li key={job.id}>
                    <Link
                      to="/console/jobs/$id"
                      params={{ id: job.id }}
                      className="block rounded-lg border border-border/60 p-3 hover:border-primary/40"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{job.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {jobStatusLabel(job.status)} · {shortDate(roll.end)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-1.5 flex-1 rounded-full bg-muted">
                          <div
                            className="h-1.5 rounded-full bg-accent"
                            style={{ width: `${roll.progress}%` }}
                          />
                        </div>
                        <span className="w-9 text-right text-xs font-semibold">
                          {roll.progress}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Budget {KES(job.budget_kes)} · Spent {KES(job.spent_kes)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-base font-semibold text-foreground">Tasks to watch</h2>
          {attention.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nothing outstanding.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {attention.map((task) => {
                const overdue = isTaskOverdue(task);
                return (
                  <li
                    key={task.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {overdue && (
                          <AlertTriangle className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
                        )}
                        {task.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {jobTitle(task.job_id)}
                        {task.responsible ? ` · ${task.responsible}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      due {shortDate(taskEnd(task))} · {Number(task.progress)}%
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
