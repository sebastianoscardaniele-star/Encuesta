create table if not exists public.abandoned_cart_survey (
  id uuid primary key default gen_random_uuid(),
  cart_id text,
  order_id text,
  customer_email text,
  tienda text default 'Tienda Ciudad',
  seller text,
  motivo_code integer not null,
  motivo_label text not null,
  motivo_texto text,
  source_url text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.abandoned_cart_survey enable row level security;

drop policy if exists "allow anonymous survey inserts" on public.abandoned_cart_survey;
create policy "allow anonymous survey inserts"
on public.abandoned_cart_survey
for insert
to anon
with check (true);

-- Opcional: solo usuarios autenticados pueden leer desde Supabase.
drop policy if exists "allow authenticated survey reads" on public.abandoned_cart_survey;
create policy "allow authenticated survey reads"
on public.abandoned_cart_survey
for select
to authenticated
using (true);
