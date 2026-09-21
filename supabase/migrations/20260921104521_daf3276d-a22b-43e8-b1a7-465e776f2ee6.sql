ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS internal_note text;

DO $$ BEGIN
  CREATE TYPE public.job_status AS ENUM ('planning','active','on_hold','complete','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE SEQUENCE IF NOT EXISTS public.delivery_job_seq;

CREATE TABLE public.delivery_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_code text NOT NULL DEFAULT ('GJ-' || to_char(now(), 'YY') || '-' || lpad(nextval('public.delivery_job_seq')::text, 4, '0')),
  title text NOT NULL,
  client_name text,
  location text,
  job_type text,
  owner_name text,
  start_date date,
  target_end_date date,
  status public.job_status NOT NULL DEFAULT 'planning',
  contract_value_kes numeric NOT NULL DEFAULT 0,
  budget_kes numeric NOT NULL DEFAULT 0,
  spent_kes numeric NOT NULL DEFAULT 0,
  invoiced_kes numeric NOT NULL DEFAULT 0,
  received_kes numeric NOT NULL DEFAULT 0,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  quote_request_id uuid REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX delivery_jobs_job_code_key ON public.delivery_jobs (job_code);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_jobs TO authenticated;
GRANT ALL ON public.delivery_jobs TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.delivery_job_seq TO authenticated, service_role;

ALTER TABLE public.delivery_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view delivery jobs" ON public.delivery_jobs
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can insert delivery jobs" ON public.delivery_jobs
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update delivery jobs" ON public.delivery_jobs
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete delivery jobs" ON public.delivery_jobs
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER delivery_jobs_updated_at BEFORE UPDATE ON public.delivery_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.delivery_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.delivery_jobs(id) ON DELETE CASCADE,
  name text NOT NULL,
  responsible text,
  start_date date NOT NULL DEFAULT current_date,
  days_required integer NOT NULL DEFAULT 1,
  progress numeric NOT NULL DEFAULT 0,
  notes text,
  sort_order integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX delivery_tasks_job_id_idx ON public.delivery_tasks (job_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_tasks TO authenticated;
GRANT ALL ON public.delivery_tasks TO service_role;

ALTER TABLE public.delivery_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view delivery tasks" ON public.delivery_tasks
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can insert delivery tasks" ON public.delivery_tasks
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update delivery tasks" ON public.delivery_tasks
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete delivery tasks" ON public.delivery_tasks
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER delivery_tasks_updated_at BEFORE UPDATE ON public.delivery_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
