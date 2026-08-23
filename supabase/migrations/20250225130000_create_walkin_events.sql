create table if not exists public.walkin_events (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  title text not null default 'Walk-In Drive',
  date date not null,
  start_time text not null,
  end_time text not null,
  location text not null,
  roles jsonb not null default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.walkin_events enable row level security;

-- Policies

-- 1. Public can read active events (no auth required)
create policy "Allow public read access to active events"
  on public.walkin_events for select
  using (is_active = true);

-- 2. Authenticated users can read events for their tenant
create policy "Allow authenticated users to view all events for their tenant"
  on public.walkin_events for select
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and tenant_id = walkin_events.tenant_id
    )
  );

-- 3. Recruiters/Admins can insert/update/delete events
create policy "Allow recruiters/admins to manage events"
  on public.walkin_events for all
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and role in ('admin', 'super-admin', 'recruiter')
      and tenant_id = walkin_events.tenant_id
    )
  );
