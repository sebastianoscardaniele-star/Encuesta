-- CUSTOMER INSIGHTS PORTAL - SUPABASE SETUP
-- Ejecutar en Supabase > SQL Editor > New query.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  email text,
  rol text not null default 'analista' check (rol in ('super_admin','admin','analista')),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  color text default '#10049E',
  activo boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.sellers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references public.stores(id) on delete set null,
  nombre text not null,
  activo boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  estado text not null default 'activa',
  titulo text not null default 'Queremos conocer tu experiencia',
  descripcion text,
  color text default '#10049E',
  created_at timestamptz default now()
);

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete set null,
  cart_id text,
  order_id text,
  email text,
  tienda text,
  seller text,
  motivo text not null,
  motivo_texto text,
  user_agent text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.sellers enable row level security;
alter table public.campaigns enable row level security;
alter table public.survey_responses enable row level security;

create or replace function public.current_role()
returns text language sql security definer set search_path = public as $$
  select rol from public.profiles where id = auth.uid() and activo = true limit 1;
$$;

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated using (auth.uid() = id or public.current_role() = 'super_admin');

drop policy if exists profiles_super_admin_write on public.profiles;
create policy profiles_super_admin_write on public.profiles for all to authenticated using (public.current_role() = 'super_admin') with check (public.current_role() = 'super_admin');

drop policy if exists stores_read on public.stores;
create policy stores_read on public.stores for select to authenticated using (true);
drop policy if exists stores_admin_write on public.stores;
create policy stores_admin_write on public.stores for all to authenticated using (public.current_role() in ('super_admin','admin')) with check (public.current_role() in ('super_admin','admin'));

drop policy if exists sellers_read on public.sellers;
create policy sellers_read on public.sellers for select to authenticated using (true);
drop policy if exists sellers_admin_write on public.sellers;
create policy sellers_admin_write on public.sellers for all to authenticated using (public.current_role() in ('super_admin','admin')) with check (public.current_role() in ('super_admin','admin'));

drop policy if exists campaigns_read on public.campaigns;
create policy campaigns_read on public.campaigns for select to authenticated, anon using (true);
drop policy if exists campaigns_admin_write on public.campaigns;
create policy campaigns_admin_write on public.campaigns for all to authenticated using (public.current_role() in ('super_admin','admin')) with check (public.current_role() in ('super_admin','admin'));

drop policy if exists responses_insert_anon on public.survey_responses;
create policy responses_insert_anon on public.survey_responses for insert to anon, authenticated with check (true);
drop policy if exists responses_read_auth on public.survey_responses;
create policy responses_read_auth on public.survey_responses for select to authenticated using (public.current_role() in ('super_admin','admin','analista'));

insert into public.stores(nombre,color) values
('Tienda Ciudad','#10049E'),('Tienda BNA','#0484a8'),('Tienda Macro','#0039e3'),('Tienda Comafi','#21a954'),('Tienda MasBanco','#37e1fb')
on conflict do nothing;

insert into public.campaigns(nombre,estado,titulo,descripcion,color) values
('Carrito abandonado','activa','Queremos conocer tu experiencia','Encuesta simple para entender motivos de abandono de checkout','#10049E')
on conflict do nothing;
