-- Add email + user_id to astronauts for invite-based auth
alter table astronauts
  add column if not exists email    text unique,
  add column if not exists user_id  uuid references auth.users(id) unique;

-- Extend profiles role to include 'astronaut'
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('admin', 'observer', 'astronaut'));

-- Astronauts can read their own profile row
create policy "Astronauts read own profile"
  on profiles for select
  using (id = auth.uid());

-- Astronauts can update their own profile row
create policy "Astronauts update own profile"
  on profiles for update
  using (id = auth.uid());

-- Astronauts can read/update their own astronaut row
create policy "Astronauts read own astronaut"
  on astronauts for select
  using (user_id = auth.uid());

create policy "Astronauts update own astronaut"
  on astronauts for update
  using (user_id = auth.uid());
