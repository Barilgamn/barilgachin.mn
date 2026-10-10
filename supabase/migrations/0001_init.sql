-- barilgachin.mn — үндсэн схем (каталог, контент, админ)
-- Supabase SQL Editor-т бүтнээр нь буулгаж ажиллуулна.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- админ эрх

create table if not exists profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at  timestamptz not null default now()
);

-- Нэвтэрсэн хэрэглэгч админ эсэхийг шалгах туслах.
-- security definer: profiles дээрх RLS-ийг тойрч, рекурс үүсгэхгүй.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- Шинэ хэрэглэгч бүртгэгдэхэд profile автоматаар үүснэ.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, email, role)
  values (
    new.id,
    new.email,
    -- Эхний админ: төслийн эзэн. Бусад нь viewer, гараар ахиулна.
    case when new.email = 'info@barilga.mn' then 'admin' else 'viewer' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------- лавлахууд

create table if not exists brands (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  short_code  text not null,
  country     text,
  logo_url    text,
  sort_order  int not null default 0,
  is_published boolean not null default true
);

create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  icon_name   text,
  image_url   text,
  parent_id   uuid references categories on delete set null,
  sort_order  int not null default 0,
  is_published boolean not null default true
);

create table if not exists warehouses (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  address     text,
  sort_order  int not null default 0,
  is_active   boolean not null default true
);

-- ---------------------------------------------------------------- бараа

create table if not exists products (
  id              uuid primary key default gen_random_uuid(),
  sku             text not null unique,
  barcode         text,
  slug            text not null unique,
  name            text not null,
  mongolian_name  text,
  category_id     uuid references categories on delete set null,
  subcategory     text,
  brand_id        uuid references brands on delete set null,

  price           numeric(14,2) not null check (price >= 0),
  original_price  numeric(14,2) check (original_price >= 0),
  uom             text not null,
  weight_kg       numeric(10,3) not null default 0,
  volume_m3       numeric(10,4),

  description      text,
  full_description text,
  mns_standard     text,
  origin_country   text,
  vehicle_requirement text not null default 'any',
  vehicle_note     text,

  is_mns_certified boolean not null default false,
  is_featured      boolean not null default false,
  is_bestseller    boolean not null default false,
  is_new_arrival   boolean not null default false,
  is_published     boolean not null default false,

  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists products_category_idx on products (category_id);
create index if not exists products_brand_idx on products (brand_id);
create index if not exists products_published_idx on products (is_published);

create table if not exists product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products on delete cascade,
  url         text not null,
  alt         text,
  sort_order  int not null default 0
);
create index if not exists product_images_product_idx on product_images (product_id);

create table if not exists product_specs (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products on delete cascade,
  name        text not null,
  value       text not null,
  sort_order  int not null default 0
);
create index if not exists product_specs_product_idx on product_specs (product_id);

-- Тоо ширхэгээс хамаарсан бөөний үнэ.
create table if not exists bulk_price_tiers (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products on delete cascade,
  min_qty     int not null check (min_qty > 0),
  price       numeric(14,2) not null check (price >= 0),
  unique (product_id, min_qty)
);
create index if not exists bulk_tiers_product_idx on bulk_price_tiers (product_id);

-- Агуулах тус бүрийн үлдэгдэл. Нийт үлдэгдлийг эндээс нийлбэрээр гаргана.
create table if not exists product_stock (
  product_id    uuid not null references products on delete cascade,
  warehouse_id  uuid not null references warehouses on delete cascade,
  qty           numeric(14,3) not null default 0,
  updated_at    timestamptz not null default now(),
  primary key (product_id, warehouse_id)
);

-- ---------------------------------------------------------------- контент

create table if not exists posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  body          text,
  cover_url     text,
  author_name   text,
  published_at  timestamptz,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists promotions (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text,
  banner_url    text,
  discount_note text,
  starts_at     timestamptz,
  ends_at       timestamptz,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Сайтын тохиргоо: утас, хаяг, банкны данс, НӨАТ-ын хувь гэх мэт.
create table if not exists settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------- updated_at

create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch before update on products
  for each row execute function touch_updated_at();
create trigger posts_touch before update on posts
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------- RLS
-- Нийтэд: зөвхөн нийтэлсэн мөрийг унших. Бичих эрх зөвхөн админд.

alter table profiles          enable row level security;
alter table brands            enable row level security;
alter table categories        enable row level security;
alter table warehouses        enable row level security;
alter table products          enable row level security;
alter table product_images    enable row level security;
alter table product_specs     enable row level security;
alter table bulk_price_tiers  enable row level security;
alter table product_stock     enable row level security;
alter table posts             enable row level security;
alter table promotions        enable row level security;
alter table settings          enable row level security;

create policy profiles_self_read on profiles
  for select using (id = auth.uid() or is_admin());
create policy profiles_admin_write on profiles
  for all using (is_admin()) with check (is_admin());

-- Нийтэлсэн эсэхээр шүүдэг хүснэгтүүд
create policy brands_public_read on brands
  for select using (is_published or is_admin());
create policy categories_public_read on categories
  for select using (is_published or is_admin());
create policy products_public_read on products
  for select using (is_published or is_admin());
create policy posts_public_read on posts
  for select using (is_published or is_admin());
create policy promotions_public_read on promotions
  for select using (is_published or is_admin());
create policy warehouses_public_read on warehouses
  for select using (is_active or is_admin());

-- Эцэг нь нийтлэгдсэн бол харагдах дэд хүснэгтүүд
create policy product_images_public_read on product_images
  for select using (exists (
    select 1 from products p where p.id = product_id and (p.is_published or is_admin())
  ));
create policy product_specs_public_read on product_specs
  for select using (exists (
    select 1 from products p where p.id = product_id and (p.is_published or is_admin())
  ));
create policy bulk_tiers_public_read on bulk_price_tiers
  for select using (exists (
    select 1 from products p where p.id = product_id and (p.is_published or is_admin())
  ));
create policy product_stock_public_read on product_stock
  for select using (exists (
    select 1 from products p where p.id = product_id and (p.is_published or is_admin())
  ));

create policy settings_public_read on settings for select using (true);

-- Бичих эрх: бүх хүснэгтэд зөвхөн админ
create policy brands_admin_write on brands
  for all using (is_admin()) with check (is_admin());
create policy categories_admin_write on categories
  for all using (is_admin()) with check (is_admin());
create policy warehouses_admin_write on warehouses
  for all using (is_admin()) with check (is_admin());
create policy products_admin_write on products
  for all using (is_admin()) with check (is_admin());
create policy product_images_admin_write on product_images
  for all using (is_admin()) with check (is_admin());
create policy product_specs_admin_write on product_specs
  for all using (is_admin()) with check (is_admin());
create policy bulk_tiers_admin_write on bulk_price_tiers
  for all using (is_admin()) with check (is_admin());
create policy product_stock_admin_write on product_stock
  for all using (is_admin()) with check (is_admin());
create policy posts_admin_write on posts
  for all using (is_admin()) with check (is_admin());
create policy promotions_admin_write on promotions
  for all using (is_admin()) with check (is_admin());
create policy settings_admin_write on settings
  for all using (is_admin()) with check (is_admin());
