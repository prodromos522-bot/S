-- Run this once in your Supabase project's SQL editor
-- (https://supabase.com/dashboard/project/_/sql/new) to create the table
-- SERVERA's orders are saved to.
--
-- This project does not use Supabase's anon key or any client-side access:
-- every read/write happens through the app's own server (see
-- src/lib/orders.functions.ts), authenticated with the service-role key.
-- Row Level Security is enabled with no policies, so even if the anon/public
-- key ever leaked, it could not read or write this table.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  payment text not null,
  total numeric(10, 2) not null,
  items jsonb not null,
  paypal_capture_id text
);

alter table public.orders enable row level security;
