-- Add photo_url to planets
alter table planets add column if not exists photo_url text;

-- Storage bucket for planet images (public read)
insert into storage.buckets (id, name, public)
values ('planet-images', 'planet-images', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload
create policy "authenticated upload planet images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'planet-images');

-- Allow authenticated users to update their uploads
create policy "authenticated update planet images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'planet-images');

-- Allow authenticated users to delete their uploads
create policy "authenticated delete planet images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'planet-images');

-- Public read
create policy "public read planet images"
  on storage.objects for select
  to public
  using (bucket_id = 'planet-images');
