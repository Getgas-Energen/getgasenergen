CREATE TABLE public.ebk_rates (
  category text PRIMARY KEY,
  description text NOT NULL,
  hourly_kes numeric NOT NULL,
  daily_kes numeric NOT NULL,
  monthly_kes numeric NOT NULL,
  source text NOT NULL DEFAULT 'EBK Scale of Fees LN 20/2022, 17th Schedule',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ebk_rates TO authenticated;
GRANT ALL ON public.ebk_rates TO service_role;
ALTER TABLE public.ebk_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read ebk rates" ON public.ebk_rates FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins manage ebk rates" ON public.ebk_rates FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER ebk_rates_updated_at BEFORE UPDATE ON public.ebk_rates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.ebk_rates (category, description, hourly_kes, daily_kes, monthly_kes) VALUES
('E1','Specialist consulting engineer',12500,75000,1250000),
('E2','Principal consulting engineer',10500,63000,1050000),
('E3','Senior professional / consulting engineer',8500,51000,850000),
('E4','Professional engineer',7000,42000,700000),
('E5','Graduate engineer',4500,27000,450000);

CREATE TABLE public.ebk_stages (
  code text PRIMARY KEY,
  label text NOT NULL,
  pct numeric NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ebk_stages TO authenticated;
GRANT ALL ON public.ebk_stages TO service_role;
ALTER TABLE public.ebk_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read ebk stages" ON public.ebk_stages FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins manage ebk stages" ON public.ebk_stages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER ebk_stages_updated_at BEFORE UPDATE ON public.ebk_stages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.ebk_stages (code,label,pct,sort_order) VALUES
('feasibility','Feasibility & preliminary design',30,1),
('detailed_design','Detailed design',45,2),
('supervision','Construction / installation supervision',25,3);

ALTER TABLE public.quote_settings
  ADD COLUMN IF NOT EXISTS ebk_mech_min_pct numeric NOT NULL DEFAULT 7,
  ADD COLUMN IF NOT EXISTS ebk_mech_max_pct numeric NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS quote_only_threshold_kes numeric NOT NULL DEFAULT 850000;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS unspsc_code text,
  ADD COLUMN IF NOT EXISTS hs_code text,
  ADD COLUMN IF NOT EXISTS kra_tax_category text,
  ADD COLUMN IF NOT EXISTS quote_only boolean NOT NULL DEFAULT false;