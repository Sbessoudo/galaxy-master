-- ============================================================
-- Maintainability fixes — 2026-04-14
-- ============================================================

-- ── 1. webhook_configs: add missing INSERT / DELETE policies ─────────────────
create policy "Admins can insert webhook_configs"
  on webhook_configs for insert
  with check (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

create policy "Admins can delete webhook_configs"
  on webhook_configs for delete
  using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

-- ── 2. planet_season_points: DB trigger to replace app-level updates ─────────
-- Removes the race condition where two simultaneous contributions could both
-- read the same total and write back a wrong value.

create or replace function sync_planet_season_points()
returns trigger language plpgsql as $$
declare
  v_planet uuid;
  v_season uuid;
  v_total  int;
begin
  -- Determine which (planet, season) to recalculate
  if TG_OP = 'DELETE' then
    v_planet := (select planet_id from astronauts where id = OLD.astronaut_id);
    v_season := OLD.season_id;
  else
    v_planet := (select planet_id from astronauts where id = NEW.astronaut_id);
    v_season := NEW.season_id;
  end if;

  -- Nothing to do if no planet or season
  if v_planet is null or v_season is null then
    return coalesce(NEW, OLD);
  end if;

  -- Recompute from source of truth
  select coalesce(sum(c.points_awarded), 0)
    into v_total
    from contributions c
    join astronauts a on a.id = c.astronaut_id
   where a.planet_id = v_planet
     and c.season_id = v_season;

  insert into planet_season_points (planet_id, season_id, total_points)
  values (v_planet, v_season, v_total)
  on conflict (planet_id, season_id) do update set total_points = excluded.total_points;

  return coalesce(NEW, OLD);
end;
$$;

-- Drop any previous version of the trigger
drop trigger if exists contributions_sync_planet_points on contributions;

create trigger contributions_sync_planet_points
  after insert or update or delete on contributions
  for each row execute function sync_planet_season_points();

-- ── 3. planet_season_points: also sync when bonus_points change ──────────────
create or replace function sync_planet_season_points_bonus()
returns trigger language plpgsql as $$
declare
  v_planet uuid;
  v_season uuid;
  v_contrib int;
  v_bonus   int;
begin
  if TG_OP = 'DELETE' then
    v_planet := OLD.planet_id;
    v_season := OLD.season_id;
  else
    v_planet := NEW.planet_id;
    v_season := NEW.season_id;
  end if;

  if v_planet is null or v_season is null then
    return coalesce(NEW, OLD);
  end if;

  select coalesce(sum(c.points_awarded), 0)
    into v_contrib
    from contributions c
    join astronauts a on a.id = c.astronaut_id
   where a.planet_id = v_planet
     and c.season_id = v_season;

  select coalesce(sum(b.points), 0)
    into v_bonus
    from bonus_points b
   where b.planet_id = v_planet
     and b.season_id = v_season;

  insert into planet_season_points (planet_id, season_id, total_points)
  values (v_planet, v_season, v_contrib + v_bonus)
  on conflict (planet_id, season_id) do update set total_points = excluded.total_points;

  return coalesce(NEW, OLD);
end;
$$;

drop trigger if exists bonus_points_sync_planet_points on bonus_points;

create trigger bonus_points_sync_planet_points
  after insert or update or delete on bonus_points
  for each row execute function sync_planet_season_points_bonus();

-- ── 4. Health-check helper (for /api/health) ─────────────────────────────────
-- A trivial function to verify DB connectivity
create or replace function health_check()
returns text language sql stable security definer as $$
  select 'ok'
$$;
