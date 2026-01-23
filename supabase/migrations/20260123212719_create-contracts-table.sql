create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  study_number text not null,
  department text not null,
  contract_value numeric(12,2) not null,
  balance numeric(12,2) not null,
  status text not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);