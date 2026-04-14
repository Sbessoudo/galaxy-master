-- Webhook configuration table (single-row pattern)
create table if not exists webhook_configs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  url         text,
  enabled     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Seed default Slack entry
insert into webhook_configs (name, url, enabled)
values ('slack', null, true)
on conflict (name) do nothing;

-- RLS: admins only
alter table webhook_configs enable row level security;

create policy "Admins can read webhook_configs"
  on webhook_configs for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update webhook_configs"
  on webhook_configs for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
