-- Add scope to contribution_types
-- 'individual' = only for astronaut contributions
-- 'planet'     = only for planet-level (not selectable in individual contribution form)
-- 'both'       = available in all contexts

alter table contribution_types
  add column scope text not null default 'individual'
  check (scope in ('individual', 'planet', 'both'));

-- Add scope to trophy_types
-- 'individual' = only assignable to an astronaut
-- 'planet'     = only assignable to a planet
-- 'both'       = assignable to either

alter table trophy_types
  add column scope text not null default 'both'
  check (scope in ('individual', 'planet', 'both'));
