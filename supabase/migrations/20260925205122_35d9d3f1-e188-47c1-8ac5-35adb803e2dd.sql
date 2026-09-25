ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS brand text,
  ADD COLUMN IF NOT EXISTS unit text NOT NULL DEFAULT 'pc',
  ADD COLUMN IF NOT EXISTS procurement_cost_kes numeric,
  ADD COLUMN IF NOT EXISTS landed_cost_kes numeric,
  ADD COLUMN IF NOT EXISTS min_price_kes numeric,
  ADD COLUMN IF NOT EXISTS default_margin_pct numeric,
  ADD COLUMN IF NOT EXISTS vat_rated boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS supplier_name text,
  ADD COLUMN IF NOT EXISTS lead_time_days integer,
  ADD COLUMN IF NOT EXISTS price_valid_until date,
  ADD COLUMN IF NOT EXISTS quote_eligible boolean NOT NULL DEFAULT true;

CREATE TABLE public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_name text, phone text, email text, notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read suppliers" ON public.suppliers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "admin write suppliers" ON public.suppliers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.quote_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  labour_hour_kes numeric, labour_day_kes numeric, engineer_hour_kes numeric,
  transport_km_kes numeric, vat_pct numeric NOT NULL DEFAULT 16,
  min_margin_pct numeric NOT NULL DEFAULT 20, target_margin_pct numeric NOT NULL DEFAULT 30,
  overhead_pct numeric NOT NULL DEFAULT 0,
  contingency_low_pct numeric NOT NULL DEFAULT 5, contingency_medium_pct numeric NOT NULL DEFAULT 10, contingency_high_pct numeric NOT NULL DEFAULT 15,
  validity_days integer NOT NULL DEFAULT 30,
  default_payment_terms text NOT NULL DEFAULT '60% deposit on order, 30% on materials delivery, 10% on commissioning.',
  default_exclusions text NOT NULL DEFAULT 'Civil/builders works, LPG product fill, permits fees unless stated.',
  default_assumptions text NOT NULL DEFAULT 'Clear site access; working hours Mon-Sat; pipe sizing subject to engineering review.',
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.quote_settings (id) VALUES (1);
GRANT SELECT, UPDATE ON public.quote_settings TO authenticated;
GRANT ALL ON public.quote_settings TO service_role;
ALTER TABLE public.quote_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read settings" ON public.quote_settings FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "admin update settings" ON public.quote_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE SEQUENCE public.eng_quote_seq;
GRANT USAGE ON SEQUENCE public.eng_quote_seq TO authenticated, service_role;

CREATE TABLE public.eng_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_no text NOT NULL UNIQUE DEFAULT ('GGE-Q-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.eng_quote_seq')::text, 4, '0')),
  revision integer NOT NULL DEFAULT 0,
  quote_class text NOT NULL CHECK (quote_class IN ('residential','commercial_kitchen','estate')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','issued','accepted','rejected','expired')),
  client_name text NOT NULL, client_email text, client_phone text,
  project_name text, location text,
  quote_request_id uuid REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  inputs jsonb NOT NULL DEFAULT '{}'::jsonb,
  costs jsonb NOT NULL DEFAULT '{}'::jsonb,
  risk text NOT NULL DEFAULT 'low' CHECK (risk IN ('low','medium','high')),
  cost_total_kes numeric NOT NULL DEFAULT 0,
  sell_subtotal_kes numeric NOT NULL DEFAULT 0,
  vat_kes numeric NOT NULL DEFAULT 0,
  total_kes numeric NOT NULL DEFAULT 0,
  margin_pct numeric NOT NULL DEFAULT 0,
  monthly_service_kes numeric NOT NULL DEFAULT 0,
  warnings jsonb NOT NULL DEFAULT '[]'::jsonb,
  assumptions text, exclusions text, payment_terms text,
  validity_days integer NOT NULL DEFAULT 30,
  estimator_id uuid, reviewer_id uuid, approved_at timestamptz, issued_at timestamptz,
  public_token text NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(18),'hex'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.eng_quotes TO authenticated;
GRANT ALL ON public.eng_quotes TO service_role;
ALTER TABLE public.eng_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read eng quotes" ON public.eng_quotes FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "admin write eng quotes" ON public.eng_quotes FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER eng_quotes_updated_at BEFORE UPDATE ON public.eng_quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.eng_quote_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.eng_quotes(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  section text NOT NULL DEFAULT 'Materials',
  description text NOT NULL,
  unit text NOT NULL DEFAULT 'pc',
  qty numeric NOT NULL DEFAULT 1,
  unit_cost_kes numeric,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.eng_quote_items TO authenticated;
GRANT ALL ON public.eng_quote_items TO service_role;
ALTER TABLE public.eng_quote_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read eng items" ON public.eng_quote_items FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "admin write eng items" ON public.eng_quote_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.eng_quote_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.eng_quotes(id) ON DELETE CASCADE,
  revision integer NOT NULL,
  snapshot jsonb NOT NULL,
  note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.eng_quote_revisions TO authenticated;
GRANT ALL ON public.eng_quote_revisions TO service_role;
ALTER TABLE public.eng_quote_revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read revisions" ON public.eng_quote_revisions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "admin add revisions" ON public.eng_quote_revisions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.eng_quote_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.eng_quotes(id) ON DELETE CASCADE,
  revision integer NOT NULL,
  channel text NOT NULL,
  recipient text NOT NULL,
  delivered boolean NOT NULL DEFAULT false,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.eng_quote_notifications TO authenticated;
GRANT ALL ON public.eng_quote_notifications TO service_role;
ALTER TABLE public.eng_quote_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read quote notifications" ON public.eng_quote_notifications FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));