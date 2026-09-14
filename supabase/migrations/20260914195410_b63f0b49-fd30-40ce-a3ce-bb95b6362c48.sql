-- ============ enums ============
create type public.product_category as enum ('pipes','regulators','fireplaces','cylinders','safety','other');
create type public.order_status as enum ('new','confirmed','dispatched','delivered','cancelled');
create type public.payment_status as enum ('pending','paid','failed');

-- ============ products ============
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category public.product_category not null default 'other',
  spec text,
  description text,
  price_kes numeric(12,2),
  image_url text,
  in_stock boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

alter table public.products enable row level security;

create policy "Public can view active products"
  on public.products for select to anon using (is_active = true);
create policy "Staff can view all products"
  on public.products for select to authenticated using (public.is_staff(auth.uid()));
create policy "Admins can insert products"
  on public.products for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "Admins can update products"
  on public.products for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins can delete products"
  on public.products for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create trigger products_updated_at before update on public.products
  for each row execute function public.update_updated_at_column();

-- ============ orders ============
create sequence public.order_number_seq start 1001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique default 'GE-' || to_char(now(),'YY') || '-' || lpad(nextval('public.order_number_seq')::text, 5, '0'),
  customer_name text not null,
  phone text not null,
  email text,
  delivery_address text not null,
  county text,
  items_total_kes numeric(12,2) not null default 0,
  delivery_fee_kes numeric(12,2) not null default 0,
  total_kes numeric(12,2) not null default 0,
  status public.order_status not null default 'new',
  payment_status public.payment_status not null default 'pending',
  payment_reference text,
  payment_provider text default 'kopokopo',
  provider_request_id text,
  customer_note text,
  internal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;

alter table public.orders enable row level security;

create policy "Staff can view orders"
  on public.orders for select to authenticated using (public.is_staff(auth.uid()));
create policy "Admins can update orders"
  on public.orders for update to authenticated using (public.has_role(auth.uid(),'admin'));

create trigger orders_updated_at before update on public.orders
  for each row execute function public.update_updated_at_column();

create index orders_created_at_idx on public.orders (created_at desc);

-- ============ order items ============
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price_kes numeric(12,2) not null default 0,
  quantity integer not null default 1,
  line_total_kes numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;

alter table public.order_items enable row level security;

create policy "Staff can view order items"
  on public.order_items for select to authenticated using (public.is_staff(auth.uid()));

create index order_items_order_id_idx on public.order_items (order_id);

-- ============ sms log ============
create table public.sms_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  phone text not null,
  template text not null,
  body text not null,
  provider text,
  delivered boolean not null default false,
  error text,
  created_at timestamptz not null default now()
);

grant select on public.sms_log to authenticated;
grant all on public.sms_log to service_role;

alter table public.sms_log enable row level security;

create policy "Staff can view sms log"
  on public.sms_log for select to authenticated using (public.is_staff(auth.uid()));

create index sms_log_order_id_idx on public.sms_log (order_id);

-- ============ seed catalogue ============
insert into public.products (name, slug, category, spec, sort_order) values
  ('Copper Pipe — 15mm × 3m','copper-pipe-15mm-3m','pipes','EN 1057 R250, half-hard',10),
  ('Brass Compression Tee — 15mm','brass-compression-tee-15mm','pipes','DZR brass, BS EN 1254',20),
  ('Black Iron Pipe — 1/2" × 6m','black-iron-pipe-half-inch-6m','pipes','ASTM A53, threaded ends',30),
  ('Flexible Stainless Hose','flexible-stainless-hose','pipes','AISI 304, 1m, ½" BSP',40),
  ('Auto-Changeover Regulator','auto-changeover-regulator','regulators','2 × 4 kg/h, 37 mbar outlet',50),
  ('OPSO / UPSO Safety Valve','opso-upso-safety-valve','regulators','Excess pressure shut-off',60),
  ('First-Stage Regulator — 12 kg/h','first-stage-regulator-12kgh','regulators','0.75 bar outlet, bulk service',70),
  ('Ball Valve — ½" BSP','ball-valve-half-inch-bsp','regulators','Brass, lever handle, gas-rated',80),
  ('Built-in Linear Fireplace','built-in-linear-fireplace','fireplaces','1.2 m glass front, LPG, remote',90),
  ('Free-standing Patio Heater','free-standing-patio-heater','fireplaces','Stainless, 13 kW, piezo ignition',100),
  ('Cast Iron Stove Fireplace','cast-iron-stove-fireplace','fireplaces','8 kW, viewing glass, LPG kit',110),
  ('13 kg LPG Cylinder','13kg-lpg-cylinder','cylinders','EN 1442, refillable',120),
  ('47.5 kg LOT Cylinder','47-5kg-lot-cylinder','cylinders','Liquid off-take, manifold-ready',130),
  ('6-Cylinder GOT Manifold','6-cylinder-got-manifold','cylinders','Auto-changeover, copper pigtails',140),
  ('Gas Leak Detector','gas-leak-detector','safety','LPG-specific, audible + visual',150),
  ('Emergency Shut-off Solenoid','emergency-shut-off-solenoid','safety','12V DC, ½" BSP, NC',160);