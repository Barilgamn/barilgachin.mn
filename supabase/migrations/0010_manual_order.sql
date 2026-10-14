-- Утсаар, танхимаар ирсэн захиалгыг админаас гараар бүртгэх.
-- Supabase SQL Editor-т ажиллуулна.

-- Дэлгүүрийн create_order() нь хүргэлтийн хөлсийг жингээс нь өөрөө
-- тооцдог бөгөөд үүнийг өөрчлөх боломжгүй — тэр нь зориуд. Утсаар авсан
-- захиалгад тохиролцсон өөр хөлс гарч болзошгүй тул админд зориулсан
-- тусдаа функц хийв. Нийтийн замыг хөндөөгүй.

create or replace function create_manual_order(
  p_customer_id    uuid,                  -- байгаа харилцагч; шинэ бол null
  p_customer       jsonb,                 -- name, phone, email, customer_type, company_name, company_register
  p_delivery       jsonb,
  p_vat            jsonb,
  p_payment_method text,
  p_items          jsonb,
  p_delivery_fee   numeric default null,  -- тохиролцсон хөлс; null бол жингээр
  p_note           text    default null
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
  if not is_admin() then
    raise exception 'Танд энэ үйлдлийн эрх алга.';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Захиалгад бараа алга.';
  end if;

  v_delivery := coalesce(p_delivery ->> 'delivery_type', 'pickup');
  if v_delivery not in ('delivery', 'pickup') then
    raise exception 'Хүргэлтийн төрөл буруу.';
  end if;

  -- Харилцагчийг сонгосон бол түүнийг, үгүй бол утсаар нь таньж үүсгэнэ.
  if p_customer_id is not null then
    select id into v_customer_id from customers where id = p_customer_id;
    if not found then
      raise exception 'Харилцагч олдсонгүй.';
    end if;
  else
    if coalesce(trim(p_customer ->> 'name'), '') = ''
       or coalesce(trim(p_customer ->> 'phone'), '') = '' then
      raise exception 'Захиалагчийн нэр, утас шаардлагатай.';
    end if;

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
      set name = excluded.name
    returning id into v_customer_id;
  end if;

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
    payment_method, admin_note
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
    coalesce(p_payment_method, 'cash'),
    nullif(trim(coalesce(p_note, '')), '')
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item ->> 'qty')::numeric;
    if v_qty is null or v_qty <= 0 then
      raise exception 'Барааны тоо хэмжээ буруу.';
    end if;

    select * into v_product from products where id = (v_item ->> 'product_id')::uuid;
    if not found then
      raise exception 'Бараа олдсонгүй: %', v_item ->> 'product_id';
    end if;

    -- Админ үнийг гараар тохируулж болно; хоосон бол баазын үнэ, шатлалаар.
    if (v_item ->> 'unit_price') is not null
       and (v_item ->> 'unit_price') <> ''
       and (v_item ->> 'unit_price')::numeric >= 0 then
      v_price := (v_item ->> 'unit_price')::numeric;
    else
      select coalesce(
        (select t.price from bulk_price_tiers t
          where t.product_id = v_product.id and t.min_qty <= v_qty
          order by t.min_qty desc limit 1),
        v_product.price
      ) into v_price;
    end if;

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
    v_fee := coalesce(p_delivery_fee, delivery_fee_for(v_weight));
    if v_fee < 0 then
      raise exception 'Хүргэлтийн хөлс сөрөг байж болохгүй.';
    end if;
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

revoke all on function create_manual_order(uuid, jsonb, jsonb, jsonb, text, jsonb, numeric, text) from public;
grant execute on function create_manual_order(uuid, jsonb, jsonb, jsonb, text, jsonb, numeric, text) to authenticated;
