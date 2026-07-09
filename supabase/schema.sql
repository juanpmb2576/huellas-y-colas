-- ============================================================
-- Pet Shop — Schema
-- Ejecutar en: Supabase > SQL Editor > New query
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Tables ─────────────────────────────────────────────────

create table public.categories (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  slug       text        not null unique,
  created_at timestamptz not null default now()
);

create table public.products (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  description text,
  price       numeric     not null check (price >= 0),
  stock       integer     not null default 0 check (stock >= 0),
  image_url   text,
  category_id uuid        references public.categories (id) on delete set null,
  active      boolean     not null default true,
  created_at  timestamptz not null default now()
);

create table public.orders (
  id             uuid        primary key default gen_random_uuid(),
  customer_name  text,
  customer_email text,
  customer_phone   text,
  shipping_address text,
  items            jsonb       not null default '[]',
  total          numeric     not null check (total >= 0),
  status         text        not null default 'pending'
                             check (status in ('pending', 'paid', 'cancelled')),
  fulfillment_status text    not null default 'pending'
                             check (fulfillment_status in ('pending', 'shipped', 'delivered')),
  created_at     timestamptz not null default now()
);

-- ─── Indexes ────────────────────────────────────────────────

create index on public.products (category_id);
create index on public.products (active);
create index on public.orders   (status);
create index on public.orders   (created_at desc);

-- ─── Row Level Security ──────────────────────────────────────
-- La tienda pública puede leer productos/categorías activos.
-- Solo roles autenticados (admin) pueden escribir.

alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.orders     enable row level security;

-- categories: lectura pública, escritura autenticada
create policy "Public can read categories"
  on public.categories for select
  using (true);

create policy "Authenticated can manage categories"
  on public.categories for all
  using (auth.role() = 'authenticated');

-- products: lectura pública solo de activos, escritura autenticada
create policy "Public can read active products"
  on public.products for select
  using (active = true);

create policy "Authenticated can manage products"
  on public.products for all
  using (auth.role() = 'authenticated');

-- orders: cualquiera puede insertar (checkout), solo admin lee/modifica
create policy "Anyone can create an order"
  on public.orders
  for insert
  to anon
  with check (true);

create policy "Anyone can read an order by id"
  on public.orders
  for select
  to anon
  using (true);

create policy "Authenticated can select orders"
  on public.orders for select
  using (auth.role() = 'authenticated');

create policy "Authenticated can update orders"
  on public.orders for update
  using (auth.role() = 'authenticated');

create policy "Authenticated can delete orders"
  on public.orders for delete
  using (auth.role() = 'authenticated');

-- ─── Storage — product-images bucket ────────────────────────
-- Ejecuta esto DESPUÉS de crear el bucket en el dashboard
-- (Storage > New bucket > "product-images" > Public: ON)

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

create policy "Authenticated can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- ─── Seed data (opcional) ────────────────────────────────────

insert into public.categories (name, slug) values
  ('Perros',   'perros'),
  ('Gatos',    'gatos'),
  ('Aves',     'aves'),
  ('Peces',    'peces'),
  ('Roedores', 'roedores');
