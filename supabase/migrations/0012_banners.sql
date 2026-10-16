-- Сурталчилгааны баннер.
--
-- Эхэндээ урамшууллын хүснэгтэд тулгуурлаж байсан нь буруу байв:
-- баннер нь хямдрал биш, өөрийн гэсэн агуулгатай зар.
-- Supabase SQL Editor-т ажиллуулна.

create table if not exists banners (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  image_url    text not null,
  link_url     text,
  starts_at    timestamptz,
  ends_at      timestamptz,
  sort_order   int not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists banners_published_idx on banners (is_published, sort_order);

drop trigger if exists banners_touch on banners;
create trigger banners_touch before update on banners
  for each row execute function touch_updated_at();

alter table banners enable row level security;

-- Нийтэлсэн баннерыг зочин хүн ч уншина; бичих нь зөвхөн админ.
drop policy if exists banners_public_read on banners;
create policy banners_public_read on banners
  for select using (is_published or is_admin());

drop policy if exists banners_admin_write on banners;
create policy banners_admin_write on banners
  for all using (is_admin()) with check (is_admin());

-- promotions.link_url нь баннерт зориулж нэмэгдсэн байсан. Баннер тусдаа
-- хүснэгттэй болсон тул хэрэггүй.
alter table promotions drop column if exists link_url;
