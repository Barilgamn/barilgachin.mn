-- Бөөний үнийн саналын хүсэлт (RFQ).
-- Supabase SQL Editor-т ажиллуулна.

create sequence if not exists rfq_no_seq;

create table if not exists rfq_requests (
  id               uuid primary key default gen_random_uuid(),
  rfq_no           text not null unique,

  company_name     text not null,
  company_register text,
  contact_person   text,
  phone            text not null,
  email            text,

  project_location text,
  required_date    date,
  delivery_needed  boolean not null default true,
  notes            text,

  status           text not null default 'new'
                     check (status in ('new', 'in_review', 'quoted', 'won', 'lost')),
  -- Хүсэлт ирэх үеийн лавлах дүн. Эцсийн санал нь гэрээгээр тогтоно.
  estimated_total  numeric(14,2) not null default 0,
  admin_note       text,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists rfq_items (
  id          uuid primary key default gen_random_uuid(),
  rfq_id      uuid not null references rfq_requests on delete cascade,
  product_id  uuid references products on delete set null,
  sku         text not null,
  name        text not null,
  uom         text not null,
  qty         numeric(14,3) not null check (qty > 0),
  unit_price  numeric(14,2) not null check (unit_price >= 0),
  line_total  numeric(14,2) not null check (line_total >= 0),
  note        text
);

create index if not exists rfq_created_idx on rfq_requests (created_at desc);
create index if not exists rfq_status_idx  on rfq_requests (status);
create index if not exists rfq_items_rfq_idx on rfq_items (rfq_id);

drop trigger if exists rfq_requests_touch on rfq_requests;
create trigger rfq_requests_touch before update on rfq_requests
  for each row execute function touch_updated_at();

-- ───────────────────────── RLS ─────────────────────────
-- Захиалгатай ижил зарчим: шууд бичих эрх хэнд ч байхгүй, унших нь
-- зөвхөн админд. Хүсэлт зөвхөн create_rfq()-оор үүснэ.

alter table rfq_requests enable row level security;
alter table rfq_items    enable row level security;

drop policy if exists rfq_requests_admin_all on rfq_requests;
create policy rfq_requests_admin_all on rfq_requests
  for all using (is_admin()) with check (is_admin());

drop policy if exists rfq_items_admin_all on rfq_items;
create policy rfq_items_admin_all on rfq_items
  for all using (is_admin()) with check (is_admin());

-- ───────────────────────── Хүсэлт үүсгэх ─────────────────────────

create or replace function create_rfq(
  p_customer jsonb,  -- company_name, company_register, contact_person, phone, email
  p_project  jsonb,  -- location, required_date, delivery_needed, notes
  p_items    jsonb   -- [{ "product_id": "...", "qty": 200, "note": "..." }]
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rfq_id   uuid;
  v_rfq_no   text;
  v_total    numeric(14,2) := 0;
  v_item     jsonb;
  v_product  products%rowtype;
  v_qty      numeric(14,3);
  v_price    numeric(14,2);
begin
  if coalesce(trim(p_customer ->> 'company_name'), '') = ''
     or coalesce(trim(p_customer ->> 'phone'), '') = '' then
    raise exception 'Байгууллагын нэр, холбоо барих утас шаардлагатай.';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Материалын жагсаалт хоосон байна.';
  end if;

  v_rfq_no := 'RFQ-' || to_char(now(), 'YYMM') || '-'
              || lpad(nextval('rfq_no_seq')::text, 4, '0');

  insert into rfq_requests (
    rfq_no, company_name, company_register, contact_person, phone, email,
    project_location, required_date, delivery_needed, notes
  ) values (
    v_rfq_no,
    trim(p_customer ->> 'company_name'),
    nullif(trim(coalesce(p_customer ->> 'company_register', '')), ''),
    nullif(trim(coalesce(p_customer ->> 'contact_person', '')), ''),
    trim(p_customer ->> 'phone'),
    nullif(trim(coalesce(p_customer ->> 'email', '')), ''),
    nullif(trim(coalesce(p_project ->> 'location', '')), ''),
    nullif(p_project ->> 'required_date', '')::date,
    coalesce((p_project ->> 'delivery_needed')::boolean, true),
    nullif(trim(coalesce(p_project ->> 'notes', '')), '')
  )
  returning id into v_rfq_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item ->> 'qty')::numeric;
    if v_qty is null or v_qty <= 0 then
      raise exception 'Барааны тоо хэмжээ буруу.';
    end if;

    select * into v_product from products
    where id = (v_item ->> 'product_id')::uuid and is_published;
    if not found then
      raise exception 'Бараа олдсонгүй: %', v_item ->> 'product_id';
    end if;

    -- Үнийг баазаас уншина — хөтчөөс ирсэн дүнд итгэхгүй.
    select coalesce(
      (select t.price from bulk_price_tiers t
        where t.product_id = v_product.id and t.min_qty <= v_qty
        order by t.min_qty desc limit 1),
      v_product.price
    ) into v_price;

    insert into rfq_items (rfq_id, product_id, sku, name, uom, qty, unit_price, line_total, note)
    values (
      v_rfq_id, v_product.id, v_product.sku, v_product.name, v_product.uom,
      v_qty, v_price, round(v_price * v_qty, 2),
      nullif(trim(coalesce(v_item ->> 'note', '')), '')
    );

    v_total := v_total + round(v_price * v_qty, 2);
  end loop;

  update rfq_requests set estimated_total = v_total where id = v_rfq_id;

  return jsonb_build_object('rfq_no', v_rfq_no, 'estimated_total', v_total);
end;
$$;

revoke all on function create_rfq(jsonb, jsonb, jsonb) from public;
grant execute on function create_rfq(jsonb, jsonb, jsonb) to anon, authenticated;
