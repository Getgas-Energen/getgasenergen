CREATE TYPE public.project_category AS ENUM ('reticulation','storage','safety','metering','maintenance','other');
CREATE TYPE public.quote_status AS ENUM ('new','reviewing','quoted','won','lost');

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category public.project_category NOT NULL DEFAULT 'other',
  tags text[] NOT NULL DEFAULT '{}',
  summary text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  client_name text,
  location text,
  sector text,
  capacity text,
  scope text,
  completion_date date,
  cover_url text,
  gallery_urls text[] NOT NULL DEFAULT '{}',
  pdf_path text,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 100,
  status public.post_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published projects" ON public.projects
  FOR SELECT TO anon, authenticated USING (status = 'published'::public.post_status);
CREATE POLICY "Staff can read all projects" ON public.projects
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL DEFAULT ('GQ-' || to_char(now(),'YYMM') || '-' || upper(substr(md5(gen_random_uuid()::text),1,5))),
  contact_name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text NOT NULL,
  building_type text NOT NULL,
  units integer NOT NULL DEFAULT 1,
  appliances text,
  supply_type text NOT NULL DEFAULT 'bulk',
  location text NOT NULL,
  timeline text,
  notes text,
  estimate_low_kes numeric,
  estimate_high_kes numeric,
  status public.quote_status NOT NULL DEFAULT 'new',
  internal_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.quote_requests TO anon;
GRANT SELECT, INSERT, UPDATE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quote request" ON public.quote_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff can read quote requests" ON public.quote_requests
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can update quote requests" ON public.quote_requests
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER quote_requests_updated_at BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();