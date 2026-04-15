-- Storage bucket for astronaut photos (public read)
insert into storage.buckets (id, name, public)
values ('astronaut-photos', 'astronaut-photos', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload
create policy "authenticated upload astronaut photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'astronaut-photos');

-- Allow authenticated users to update their uploads
create policy "authenticated update astronaut photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'astronaut-photos');

-- Allow authenticated users to delete their uploads
create policy "authenticated delete astronaut photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'astronaut-photos');

-- Public read
create policy "public read astronaut photos"
  on storage.objects for select
  to public
  using (bucket_id = 'astronaut-photos');
