-- Урамшууллын баннер дарахад хаашаа очихыг заах хаяг.
-- Supabase SQL Editor-т ажиллуулна.

alter table promotions
  add column if not exists link_url text;

comment on column promotions.link_url is
  'Баннер дарахад очих хаяг. Дотоод зам (/medee/...) эсвэл бүтэн URL.';
