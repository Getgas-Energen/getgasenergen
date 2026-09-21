/**
 * Schedule + financial roll-up helpers for the internal delivery planner.
 * Mirrors the columns of the multi-project Excel planner: start date,
 * days required, progress, derived end date and days complete.
 */

import type { DeliveryJobRow, DeliveryTaskRow } from "./admin.functions";

export const DAY_MS = 86_400_000;

export function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Inclusive end date: a 5-day task starting Monday ends Friday. */
export function taskEnd(task: DeliveryTaskRow): Date | null {
  const start = parseDate(task.start_date);
  if (!start) return null;
  return addDays(start, Math.max(1, task.days_required) - 1);
}

export function taskDaysComplete(task: DeliveryTaskRow): number {
  return Math.round((task.days_required * Number(task.progress)) / 100);
}

export function isTaskOverdue(task: DeliveryTaskRow, today = new Date()): boolean {
  const end = taskEnd(task);
  if (!end) return false;
  return Number(task.progress) < 100 && end.getTime() < today.getTime() - DAY_MS;
}

export interface JobRollup {
  taskCount: number;
  start: Date | null;
  end: Date | null;
  days: number;
  progress: number;
  overdueTasks: number;
}

/** Days-weighted progress across a job's tasks, like the planner's %Progress. */
export function rollupJob(tasks: DeliveryTaskRow[], job?: DeliveryJobRow): JobRollup {
  const starts = tasks.map((t) => parseDate(t.start_date)).filter((d): d is Date => Boolean(d));
  const ends = tasks.map(taskEnd).filter((d): d is Date => Boolean(d));

  const jobStart = job ? parseDate(job.start_date) : null;
  const jobEnd = job ? parseDate(job.target_end_date) : null;

  const start = starts.length
    ? new Date(Math.min(...starts.map((d) => d.getTime())))
    : jobStart;
  const end = ends.length ? new Date(Math.max(...ends.map((d) => d.getTime()))) : jobEnd;

  const totalDays = tasks.reduce((sum, t) => sum + Math.max(1, t.days_required), 0);
  const doneDays = tasks.reduce((sum, t) => sum + taskDaysComplete(t), 0);

  return {
    taskCount: tasks.length,
    start,
    end,
    days: start && end ? Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1 : 0,
    progress: totalDays > 0 ? Math.round((doneDays / totalDays) * 100) : 0,
    overdueTasks: tasks.filter((t) => isTaskOverdue(t)).length,
  };
}

export function groupTasksByJob(tasks: DeliveryTaskRow[]): Map<string, DeliveryTaskRow[]> {
  const map = new Map<string, DeliveryTaskRow[]>();
  for (const task of tasks) {
    const list = map.get(task.job_id);
    if (list) list.push(task);
    else map.set(task.job_id, [task]);
  }
  return map;
}

export const KES = (value: number | null | undefined) =>
  value === null || value === undefined
    ? "—"
    : `KES ${Math.round(Number(value)).toLocaleString("en-KE")}`;

export const shortDate = (date: Date | null) =>
  date
    ? date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })
    : "—";

export const JOB_STATUSES = [
  "planning",
  "active",
  "on_hold",
  "complete",
  "cancelled",
] as const;

export const jobStatusLabel = (status: string) =>
  status === "on_hold" ? "On hold" : status.charAt(0).toUpperCase() + status.slice(1);
