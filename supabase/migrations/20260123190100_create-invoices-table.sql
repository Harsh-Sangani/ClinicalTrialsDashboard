create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  department text not null,
  study_number text not null,
  invoice_number text not null unique,
  invoice_description text,
  cost numeric(12,2) not null,
  contract_number text not null,
  payment_date date,
  uploaded_by_email text not null,
  created_at timestamptz default now()
);
