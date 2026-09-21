# Internal Delivery & Submissions Dashboard

A minimalist engineering + financials workspace inside the existing staff console, modelled on the uploaded multi-project planner (projects roll-up, task list with owner/dates/progress, Gantt strip), plus a proper review desk for website submissions.

## 1. Submissions desk

New console page **Submissions** for website contact enquiries (quote requests already have a page):

- Table list: date, name, company, phone, email, project type, status.
- Filters: status (new / contacted / qualified / closed), project type, date range, and a free-text search across name, company, email and phone.
- Click a row to open details: full message, attachment download link, internal note, assignee.
- Status and internal note editable by admins; staff see read-only.
- Counts per status shown as small chips above the table.

The existing **Quote requests** page gains the same filter/search bar and a status summary, so both submission types feel alike. A won quote gets a **Create job** button that opens the new job form pre-filled with client, location, and the quoted value.

## 2. Delivery jobs (internal, separate from the public projects page)

New internal jobs register — separate records from the published portfolio, with an optional link to a published project.

Each job holds: job code, title, client, location, job type, owner, start date, target end date, status (planning / active / on hold / complete / cancelled), and financials: contract value, budget, spent, invoiced, received (all KES).

Job list view shows: code, title, client, owner, dates, progress %, and a compact money strip (budget vs spent, invoiced vs received).

## 3. Tasks and schedule (planner template)

Each job has tasks mirroring the template columns: task name, responsible person, start date, days required, progress %, computed end date and days complete.

- Task rows editable inline (add, edit, delete, drag-free ordering by sort field).
- Progress bar per task; job progress computed as a days-weighted average of its tasks.
- A lightweight horizontal **Gantt strip** per job: one row per task, bars positioned by date across a scrollable week-by-week timeline, cyan bar with a darker fill showing completed portion. No heavy chart library — CSS grid only.

## 4. Dashboard home

The console home becomes the planner dashboard:

- Top KPI row: open enquiries, open quotes, active jobs, overall portfolio progress.
- Financial summary: total contract value, budget, spent, invoiced, received, outstanding (invoiced − received) and variance (budget − spent).
- Projects roll-up table exactly like the template's Projects sheet: job, tasks, start, end, days, % progress, remaining.
- "Top tasks" list: next tasks due across all jobs, with owner and days remaining.
- Overdue/at-risk flag on tasks past their end date below 100%.

Visual language stays the current brand: royal purple, cyan accents, graphite text, thin borders, no decorative colour — dense tables, small type, generous whitespace.

## Technical notes

- New tables: `delivery_jobs` and `delivery_tasks`, with RLS — staff read, admins write — and GRANTs to `authenticated`/`service_role`, plus `updated_at` triggers. `contact_submissions` already has `status`, `assigned_to` and `internal_note`-style fields; a `internal_note` column is added if absent.
- Job progress, days, and financial roll-ups computed in SQL views or server-side aggregation, not hardcoded in the UI.
- Server functions added to `src/lib/admin.functions.ts`: list/filter submissions, update submission, list/create/update/delete jobs and tasks, dashboard summary, and create-job-from-quote.
- New routes under `src/routes/_authenticated/`: `console.submissions.tsx`, `console.jobs.tsx`, `console.jobs.$id.tsx`; `console.index.tsx` rewritten as the dashboard. All keep `noindex, nofollow` and stay out of the sitemap.
- Console sidebar gains Submissions, Jobs links.
- The uploaded spreadsheet is used as a design reference only; it is not imported or shipped with the app.
