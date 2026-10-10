-- Барааны зураг, баннер байршуулах сан.
-- Supabase SQL Editor-т ажиллуулна.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Унших: хэн ч болно (bucket нийтийн).
drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select using (bucket_id = 'media');

-- Байршуулах, солих, устгах: зөвхөн админ.
drop policy if exists media_admin_write on storage.objects;
create policy media_admin_write on storage.objects
  for all
  using (bucket_id = 'media' and is_admin())
  with check (bucket_id = 'media' and is_admin());
