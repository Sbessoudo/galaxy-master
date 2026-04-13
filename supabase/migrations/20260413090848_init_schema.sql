-- ============================================================
-- Galaxy Master — Initial Schema
-- Le Site des Planètes — Back-office for Eleven Labs gamification
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── profiles ─────────────────────────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text,
  avatar_url  text,
  role        text not null default 'observer' check (role in ('admin', 'observer')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── planets ──────────────────────────────────────────────────────────────────
create table planets (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  description text,
  color       text not null default '#acc7ff',
  type        text not null default 'main' check (type in ('main', 'newcomers', 'arbiters')),
  active      boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── grades ───────────────────────────────────────────────────────────────────
create table grades (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  min_points  int not null unique,
  color       text not null default '#acc7ff',
  icon        text not null default '⭐',
  sort_order  int not null,
  created_at  timestamptz not null default now()
);

insert into grades (name, min_points, color, icon, sort_order) values
  ('Rookie',               0,     '#8d909c', '🪐', 1),
  ('Ensign',               50,    '#acc7ff', '⭐', 2),
  ('Lieutenant',           100,   '#acc7ff', '🌟', 3),
  ('Lieutenant Commander', 200,   '#87aef9', '💫', 4),
  ('Commander',            300,   '#87aef9', '🚀', 5),
  ('Captain',              500,   '#c8bfff', '🛸', 6),
  ('Fleet Captain',        750,   '#c8bfff', '🌌', 7),
  ('Commodore',            1000,  '#ffb2b9', '🔭', 8),
  ('Rear Admiral',         1500,  '#ffb2b9', '🪖', 9),
  ('Vice Admiral',         2000,  '#dd3156', '🎖️', 10),
  ('Admiral',              3000,  '#dd3156', '⚡', 11),
  ('Fleet Admiral',        5000,  '#ffd700', '🏅', 12),
  ('Fleet Admiral ★★',     10000, '#ffd700', '🥇', 13),
  ('Fleet Admiral ★★★',    15000, '#ffd700', '👑', 14);

-- ── seasons ──────────────────────────────────────────────────────────────────
create table seasons (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  start_date  date not null,
  end_date    date not null,
  active      boolean not null default false,
  created_at  timestamptz not null default now(),
  constraint seasons_dates_check check (end_date > start_date)
);

create unique index seasons_one_active_idx on seasons (active) where (active = true);

-- ── astronauts ───────────────────────────────────────────────────────────────
create table astronauts (
  id           uuid primary key default uuid_generate_v4(),
  first_name   text not null,
  last_name    text not null,
  role_title   text,
  planet_id    uuid references planets(id) on delete set null,
  arrival_date date,
  active       boolean not null default true,
  photo_url    text,
  total_points int not null default 0,
  grade_id     uuid references grades(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── contribution_types ───────────────────────────────────────────────────────
create table contribution_types (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  description text,
  base_points int not null check (base_points >= 0),
  category    text not null default 'general',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into contribution_types (name, base_points, category) values
  ('1er d''un challenge',               100, 'challenge'),
  ('2ème d''un challenge',               75, 'challenge'),
  ('3ème d''un challenge',               50, 'challenge'),
  ('4ème d''un challenge',               25, 'challenge'),
  ('Première contribution de la saison', 25, 'bonus'),
  ('Article de blog (solo)',             75, 'content'),
  ('Article de blog (duo)',              40, 'content'),
  ('Entretien tech',                     25, 'community'),
  ('Talk externe',                      150, 'speaking'),
  ('Talk interne',                      100, 'speaking'),
  ('Workshop (solo)',                   100, 'teaching'),
  ('Workshop (duo)',                     50, 'teaching'),
  ('Demo / Open mic',                    25, 'community'),
  ('Projet interne — niveau 1',         100, 'project'),
  ('Projet interne — niveau 2',         250, 'project'),
  ('Projet interne — niveau 3',         500, 'project'),
  ('Projet interne — niveau 4',         750, 'project'),
  ('Animation podcast',                 100, 'content'),
  ('Participation podcast',              25, 'content'),
  ('Animation co-dev',                   25, 'community');

-- ── contributions ────────────────────────────────────────────────────────────
create table contributions (
  id               uuid primary key default uuid_generate_v4(),
  astronaut_id     uuid not null references astronauts(id) on delete cascade,
  type_id          uuid not null references contribution_types(id) on delete restrict,
  season_id        uuid references seasons(id) on delete set null,
  date             date not null,
  location         text,
  duration_min     int,
  notes            text,
  points_awarded   int not null,
  is_first_ever    boolean not null default false,
  is_first_season  boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── planet_season_points ─────────────────────────────────────────────────────
create table planet_season_points (
  planet_id    uuid not null references planets(id) on delete cascade,
  season_id    uuid not null references seasons(id) on delete cascade,
  total_points int not null default 0,
  primary key (planet_id, season_id)
);

-- ── bonus_points ─────────────────────────────────────────────────────────────
create table bonus_points (
  id          uuid primary key default uuid_generate_v4(),
  planet_id   uuid not null references planets(id) on delete cascade,
  season_id   uuid references seasons(id) on delete set null,
  points      int not null,
  label       text not null,
  date        date not null default current_date,
  created_by  uuid references profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ── event_types ──────────────────────────────────────────────────────────────
create table event_types (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  description text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into event_types (name) values
  ('Réunion d''équipe'),
  ('Formation'),
  ('Conférence externe'),
  ('Séminaire'),
  ('Afterwork'),
  ('Co-dev'),
  ('Podcast');

-- ── events ───────────────────────────────────────────────────────────────────
create table events (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  date        date not null,
  type_id     uuid references event_types(id) on delete set null,
  season_id   uuid references seasons(id) on delete set null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── event_participants ───────────────────────────────────────────────────────
create table event_participants (
  event_id     uuid not null references events(id) on delete cascade,
  astronaut_id uuid not null references astronauts(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (event_id, astronaut_id)
);

-- ── trophy_types ─────────────────────────────────────────────────────────────
create table trophy_types (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  description text,
  icon        text not null default '🏆',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── trophies ─────────────────────────────────────────────────────────────────
create table trophies (
  id           uuid primary key default uuid_generate_v4(),
  type_id      uuid not null references trophy_types(id) on delete restrict,
  astronaut_id uuid references astronauts(id) on delete cascade,
  planet_id    uuid references planets(id) on delete cascade,
  season_id    uuid references seasons(id) on delete set null,
  notes        text,
  awarded_at   timestamptz not null default now(),
  created_by   uuid references profiles(id) on delete set null,
  constraint trophies_target_check check (
    (astronaut_id is not null and planet_id is null) or
    (astronaut_id is null and planet_id is not null)
  )
);

-- ═══════════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════════

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at    before update on profiles    for each row execute function update_updated_at();
create trigger planets_updated_at     before update on planets     for each row execute function update_updated_at();
create trigger astronauts_updated_at  before update on astronauts  for each row execute function update_updated_at();
create trigger contributions_updated_at before update on contributions for each row execute function update_updated_at();
create trigger events_updated_at      before update on events      for each row execute function update_updated_at();

-- Recalculate astronaut lifetime points + grade
create or replace function recalculate_astronaut_points(p_astronaut uuid)
returns void language plpgsql as $$
declare
  v_total int;
  v_grade uuid;
begin
  select coalesce(sum(points_awarded), 0) into v_total
  from contributions where astronaut_id = p_astronaut;

  select id into v_grade from grades
  where min_points <= v_total order by min_points desc limit 1;

  update astronauts set total_points = v_total, grade_id = v_grade, updated_at = now()
  where id = p_astronaut;
end;
$$;

create or replace function trigger_recalculate_astronaut()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'DELETE' then
    perform recalculate_astronaut_points(OLD.astronaut_id);
  else
    perform recalculate_astronaut_points(NEW.astronaut_id);
  end if;
  return coalesce(NEW, OLD);
end;
$$;

create trigger contributions_recalculate_points
  after insert or update or delete on contributions
  for each row execute function trigger_recalculate_astronaut();

-- Enforce single active season (deactivate others on activation)
create or replace function enforce_single_active_season()
returns trigger language plpgsql as $$
begin
  if NEW.active = true then
    update seasons set active = false where id != NEW.id and active = true;
  end if;
  return NEW;
end;
$$;

create trigger seasons_enforce_single_active
  before insert or update on seasons
  for each row when (NEW.active = true)
  execute function enforce_single_active_season();

-- ═══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════

alter table profiles             enable row level security;
alter table planets              enable row level security;
alter table astronauts           enable row level security;
alter table grades               enable row level security;
alter table seasons              enable row level security;
alter table contribution_types   enable row level security;
alter table contributions        enable row level security;
alter table planet_season_points enable row level security;
alter table bonus_points         enable row level security;
alter table event_types          enable row level security;
alter table events               enable row level security;
alter table event_participants   enable row level security;
alter table trophy_types         enable row level security;
alter table trophies             enable row level security;

create or replace function current_user_role()
returns text language sql security definer stable as $$
  select role from profiles where id = auth.uid()
$$;

-- READ: all authenticated users
create policy "authenticated read" on planets              for select using (auth.role() = 'authenticated');
create policy "authenticated read" on astronauts           for select using (auth.role() = 'authenticated');
create policy "authenticated read" on grades               for select using (auth.role() = 'authenticated');
create policy "authenticated read" on seasons              for select using (auth.role() = 'authenticated');
create policy "authenticated read" on contribution_types   for select using (auth.role() = 'authenticated');
create policy "authenticated read" on contributions        for select using (auth.role() = 'authenticated');
create policy "authenticated read" on planet_season_points for select using (auth.role() = 'authenticated');
create policy "authenticated read" on bonus_points         for select using (auth.role() = 'authenticated');
create policy "authenticated read" on event_types          for select using (auth.role() = 'authenticated');
create policy "authenticated read" on events               for select using (auth.role() = 'authenticated');
create policy "authenticated read" on event_participants   for select using (auth.role() = 'authenticated');
create policy "authenticated read" on trophy_types         for select using (auth.role() = 'authenticated');
create policy "authenticated read" on trophies             for select using (auth.role() = 'authenticated');

-- WRITE: admins only
create policy "admin write" on planets              for all using (current_user_role() = 'admin');
create policy "admin write" on astronauts           for all using (current_user_role() = 'admin');
create policy "admin write" on seasons              for all using (current_user_role() = 'admin');
create policy "admin write" on contribution_types   for all using (current_user_role() = 'admin');
create policy "admin write" on contributions        for all using (current_user_role() = 'admin');
create policy "admin write" on bonus_points         for all using (current_user_role() = 'admin');
create policy "admin write" on event_types          for all using (current_user_role() = 'admin');
create policy "admin write" on events               for all using (current_user_role() = 'admin');
create policy "admin write" on event_participants   for all using (current_user_role() = 'admin');
create policy "admin write" on trophy_types         for all using (current_user_role() = 'admin');
create policy "admin write" on trophies             for all using (current_user_role() = 'admin');
create policy "admin write" on grades               for all using (current_user_role() = 'admin');

-- profiles: own row or admin
create policy "own profile read"   on profiles for select using (id = auth.uid());
create policy "admin profiles all" on profiles for all    using (current_user_role() = 'admin');

-- Auto-create profile on first Google OAuth login
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
