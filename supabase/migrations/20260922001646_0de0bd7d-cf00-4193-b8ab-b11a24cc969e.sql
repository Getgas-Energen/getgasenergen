CREATE TYPE public.investor_lead_status AS ENUM ('new','reviewing','nda_signed','access_granted','declined');

CREATE TABLE public.investor_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference text NOT NULL DEFAULT (('GIR-' || to_char(now(),'YYMM')) || '-' || upper(substr(md5(gen_random_uuid()::text),1,5))),
  full_name text NOT NULL,
  organisation text,
  role_title text,
  email text NOT NULL,
  phone text,
  investor_type text NOT NULL DEFAULT 'other',
  ticket_band text,
  interest_area text,
  message text,
  nda_version text NOT NULL DEFAULT 'v1',
  nda_accepted_at timestamp with time zone NOT NULL DEFAULT now(),
  status public.investor_lead_status NOT NULL DEFAULT 'new',
  internal_note text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.investor_leads TO anon, authenticated;
GRANT SELECT, UPDATE ON public.investor_leads TO authenticated;
GRANT ALL ON public.investor_leads TO service_role;

ALTER TABLE public.investor_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can request investor access" ON public.investor_leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Staff can read investor leads" ON public.investor_leads
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Admins can update investor leads" ON public.investor_leads
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER investor_leads_updated_at BEFORE UPDATE ON public.investor_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();