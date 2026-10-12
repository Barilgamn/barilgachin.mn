-- Захиалга ба харилцагчийн бүртгэл.
-- Supabase SQL Editor-т ажиллуулна.

-- ───────────────────────── Хүснэгтүүд ─────────────────────────

create table if not exists customers (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  phone            text not null unique,
  email            text,
  customer_type    text not null default 'individual'
                     check (customer_type in ('individual', 'corporate')),
  company_name     text,
  company_register text,
  note             text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create sequence if not exists order_no_seq;

create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  order_no         text not null unique,
  customer_id      uuid references customers on delete set null,

  status           text not null default 'new'
                     check (status in ('new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')),

  delivery_type    text not null check (delivery_type in ('delivery', 'pickup')),
  warehouse_id     uuid references warehouses on delete set null,
  district         text,
  khoroo           text,
  street_address   text,
  delivery_notes   text,

  vat_type         text not null default 'individual'
                     check (vat_type in ('individual', 'company')),
  company_register text,
  company_name     text,
  vat_email        text,

  payment_method   text not null,
  payment_status   text not null default 'unpaid'
                     check (payment_status in ('unpaid', 'paid', 'refunded')),

  subtotal         numeric(14,2) not null default 0,
  delivery_fee     numeric(14,2) not null default 0,
  total            numeric(14,2) not null default 0,
  total_weight_kg  numeric(14,3) not null default 0,

  admin_note       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Бараа хожим өөрчлөгдсөн ч захиалгын түүх хэвээр үлдэх ёстой тул
-- нэр, SKU, үнийг мөрөн дээр нь хуулж хадгална.
create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders on delete cascade,
  product_id  uuid references products on delete set null,
  sku         text not null,
  name        text not null,
  uom         text not null,
  qty         numeric(14,3) not null check (qty > 0),
  unit_price  numeric(14,2) not null check (unit_price >= 0),
  line_total  numeric(14,2) not null check (line_total >= 0),
  weight_kg   numeric(14,3) not null default 0
);

create index if not exists orders_customer_idx on orders (customer_id);
create index if not exists orders_created_idx  on orders (created_at desc);
create index if not exists order_items_order_idx on order_items (order_id);

-- Дахин ажиллуулахад алдахгүй байхаар.
drop trigger if exists customers_touch on customers;
create trigger customers_touch before update on customers
  for each row execute function touch_updated_at();
drop trigger if exists orders_touch on orders;
create trigger orders_touch before update on orders
  for each row execute function touch_updated_at();

-- ───────────────────────── RLS ─────────────────────────
-- Эдгээр хүснэгтэд шууд бичих эрхийг хэнд ч өгөхгүй. Захиалга зөвхөн
-- доорх create_order() функцээр үүснэ — тэр нь үнийг баазаас өөрөө
-- уншдаг тул хөтчөөс ирсэн үнэд итгэх шаардлагагүй.

alter table customers   enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

drop policy if exists customers_admin_all on customers;
create policy customers_admin_all on customers
  for all using (is_admin()) with check (is_admin());

drop policy if exists orders_admin_all on orders;
create policy orders_admin_all on orders
  for all using (is_admin()) with check (is_admin());

drop policy if exists order_items_admin_all on order_items;
create policy order_items_admin_all on order_items
  for all using (is_admin()) with check (is_admin());

-- ───────────────────────── Хүргэлтийн төлбөр ─────────────────────────
-- utils/formatters.ts доторх getRecommendedVehicle-тай ижил шатлал.
-- Хөтчөөс ирсэн дүнг хүлээж авбал хэн ч 0 болгож чадна.

create or replace function delivery_fee_for(weight_kg numeric)
returns numeric language sql immutable as $$
  select case
    when weight_kg <=   50 then 10000
    when weight_kg <= 1200 then 35000
    when weight_kg <= 3500 then 65000
    when weight_kg <= 6000 then 120000
    else 220000
  end::numeric;
$$;

-- ───────────────────────── Захиалга үүсгэх ─────────────────────────

create or replace function create_order(
  p_customer       jsonb,   -- name, phone, email, customer_type, company_name, company_register
  p_delivery       jsonb,   -- delivery_type, warehouse_code, district, khoroo, street_address, notes
  p_vat            jsonb,   -- vat_type, company_register, company_name, vat_email
  p_payment_method text,
  p_items          jsonb    -- [{ "product_id": "...", "qty": 5 }]
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order_id    uuid;
  v_order_no    text;
  v_subtotal    numeric(14,2) := 0;
  v_weight      numeric(14,3) := 0;
  v_fee         numeric(14,2) := 0;
  v_delivery    text;
  v_warehouse   uuid;
  v_item        jsonb;
  v_product     products%rowtype;
  v_qty         numeric(14,3);
  v_price       numeric(14,2);
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Захиалгад бараа алга.';
  end if;

  v_delivery := coalesce(p_delivery ->> 'delivery_type', 'delivery');
  if v_delivery not in ('delivery', 'pickup') then
    raise exception 'Хүргэлтийн төрөл буруу.';
  end if;

  if coalesce(trim(p_customer ->> 'name'), '') = ''
     or coalesce(trim(p_customer ->> 'phone'), '') = '' then
    raise exception 'Захиалагчийн нэр, утас шаардлагатай.';
  end if;

  -- Утсаар нь таньж, байвал мэдээллийг нь шинэчилнэ.
  insert into customers (name, phone, email, customer_type, company_name, company_register)
  values (
    trim(p_customer ->> 'name'),
    trim(p_customer ->> 'phone'),
    nullif(trim(coalesce(p_customer ->> 'email', '')), ''),
    coalesce(p_customer ->> 'customer_type', 'individual'),
    nullif(trim(coalesce(p_customer ->> 'company_name', '')), ''),
    nullif(trim(coalesce(p_customer ->> 'company_register', '')), '')
  )
  on conflict (phone) do update
    set name             = excluded.name,
        email            = coalesce(excluded.email, customers.email),
        customer_type    = excluded.customer_type,
        company_name     = coalesce(excluded.company_name, customers.company_name),
        company_register = coalesce(excluded.company_register, customers.company_register)
  returning id into v_customer_id;

  if v_delivery = 'pickup' then
    select id into v_warehouse from warehouses
    where code = coalesce(p_delivery ->> 'warehouse_code', '') and is_active;
  end if;

  v_order_no := 'BGH-' || to_char(now(), 'YYMM') || '-'
                || lpad(nextval('order_no_seq')::text, 4, '0');

  insert into orders (
    order_no, customer_id, delivery_type, warehouse_id,
    district, khoroo, street_address, delivery_notes,
    vat_type, company_register, company_name, vat_email,
    payment_method
  ) values (
    v_order_no, v_customer_id, v_delivery, v_warehouse,
    nullif(trim(coalesce(p_delivery ->> 'district', '')), ''),
    nullif(trim(coalesce(p_delivery ->> 'khoroo', '')), ''),
    nullif(trim(coalesce(p_delivery ->> 'street_address', '')), ''),
    nullif(trim(coalesce(p_delivery ->> 'notes', '')), ''),
    coalesce(p_vat ->> 'vat_type', 'individual'),
    nullif(trim(coalesce(p_vat ->> 'company_register', '')), ''),
    nullif(trim(coalesce(p_vat ->> 'company_name', '')), ''),
    nullif(trim(coalesce(p_vat ->> 'vat_email', '')), ''),
    coalesce(p_payment_method, 'qpay')
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item ->> 'qty')::numeric;
    if v_qty is null or v_qty <= 0 then
      raise exception 'Барааны тоо хэмжээ буруу.';
    end if;

    select * into v_product from products
    where id = (v_item ->> 'product_id')::uuid and is_published;
    if not found then
      raise exception 'Бараа олдсонгүй эсвэл нийтлэгдээгүй байна: %', v_item ->> 'product_id';
    end if;

    -- Бөөний шатлал байвал хамгийн тохирохыг нь, үгүй бол үндсэн үнийг.
    select coalesce(
      (select t.price from bulk_price_tiers t
        where t.product_id = v_product.id and t.min_qty <= v_qty
        order by t.min_qty desc limit 1),
      v_product.price
    ) into v_price;

    insert into order_items (
      order_id, product_id, sku, name, uom, qty, unit_price, line_total, weight_kg
    ) values (
      v_order_id, v_product.id, v_product.sku, v_product.name, v_product.uom,
      v_qty, v_price, round(v_price * v_qty, 2), round(v_product.weight_kg * v_qty, 3)
    );

    v_subtotal := v_subtotal + round(v_price * v_qty, 2);
    v_weight   := v_weight + round(v_product.weight_kg * v_qty, 3);
  end loop;

  if v_delivery = 'delivery' then
    v_fee := delivery_fee_for(v_weight);
  end if;

  update orders
     set subtotal        = v_subtotal,
         delivery_fee    = v_fee,
         total           = v_subtotal + v_fee,
         total_weight_kg = v_weight
   where id = v_order_id;

  return jsonb_build_object(
    'order_no',     v_order_no,
    'subtotal',     v_subtotal,
    'delivery_fee', v_fee,
    'total',        v_subtotal + v_fee,
    'weight_kg',    v_weight
  );
end;
$$;

revoke all on function create_order(jsonb, jsonb, jsonb, text, jsonb) from public;
grant execute on function create_order(jsonb, jsonb, jsonb, text, jsonb) to anon, authenticated;
