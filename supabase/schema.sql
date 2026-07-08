create table if not exists public.abandoned_cart_survey (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  cart_id text,
  order_id text,
  customer_email text,
  tienda text default 'Tienda Ciudad',
  seller text,
  motivo_code int not null,
  motivo_label text not null,
  motivo_texto text,
  user_agent text,
  referrer text
);

alter table public.abandoned_cart_survey enable row level security;

-- La app escribe mediante API serverless usando SERVICE_ROLE_KEY.
-- No hace falta crear policy pública de insert.
