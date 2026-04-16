-- ── Mantra on planets ────────────────────────────────────────────────────────
alter table planets add column if not exists mantra text;

-- ── Hobbies & skills on astronauts ───────────────────────────────────────────
alter table astronauts add column if not exists hobbies text[] default '{}';
alter table astronauts add column if not exists skills  text[] default '{}';
