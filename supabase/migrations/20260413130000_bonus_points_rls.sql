-- Add missing admin write policy for planet_season_points
create policy "admin write" on planet_season_points
  for all using (current_user_role() = 'admin');
