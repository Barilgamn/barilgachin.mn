-- Захиалгыг баталгаажуулах хоёр зам: шууд төлбөр, эсвэл нэхэмжлэх.
-- Supabase SQL Editor-т ажиллуулна.

alter table orders
  add column if not exists settlement        text
    check (settlement in ('direct', 'invoice')),
  add column if not exists invoice_no        text unique,
  add column if not exists invoice_issued_at timestamptz,
  add column if not exists due_date          date,
  add column if not exists paid_at           timestamptz,
  add column if not exists confirmed_at      timestamptz;

create sequence if not exists invoice_no_seq;

create index if not exists orders_status_idx on orders (status);

-- ───────────────────────── Баталгаажуулах ─────────────────────────
-- Нэхэмжлэхийн дугаарыг дараалалаас авдаг тул хөтчөөс тооцвол
-- хоёр админ зэрэг ажиллахад давхардаж болзошгүй — функцээр үүсгэнэ.

create or replace function confirm_order(
  p_order_id       uuid,
  p_settlement     text,              -- 'direct' | 'invoice'
  p_payment_method text default null,  -- шууд төлбөрийн хэрэгсэл
  p_due_days       int  default 14     -- нэхэмжлэхийн хугацаа
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order   orders%rowtype;
  v_invoice text;
begin
  if not is_admin() then
    raise exception 'Танд энэ үйлдлийн эрх алга.';
  end if;

  select * into v_order from orders where id = p_order_id;
  if not found then
    raise exception 'Захиалга олдсонгүй.';
  end if;

  if v_order.status <> 'new' then
    raise exception 'Зөвхөн шинэ захиалгыг баталгаажуулна. Одоогийн төлөв: %', v_order.status;
  end if;

  if p_settlement not in ('direct', 'invoice') then
    raise exception 'Баталгаажуулах арга буруу.';
  end if;

  if p_settlement = 'invoice' then
    v_invoice := 'INV-' || to_char(now(), 'YYMM') || '-'
                 || lpad(nextval('invoice_no_seq')::text, 4, '0');

    update orders
       set status            = 'confirmed',
           settlement        = 'invoice',
           invoice_no        = v_invoice,
           invoice_issued_at = now(),
           due_date          = current_date + greatest(coalesce(p_due_days, 14), 0),
           confirmed_at      = now()
     where id = p_order_id;
  else
    update orders
       set status         = 'confirmed',
           settlement     = 'direct',
           payment_method = coalesce(p_payment_method, payment_method),
           payment_status = 'paid',
           paid_at        = now(),
           confirmed_at   = now()
     where id = p_order_id;
  end if;

  select * into v_order from orders where id = p_order_id;
  return to_jsonb(v_order);
end;
$$;

-- ───────────────────────── Нэхэмжлэх төлөгдсөн ─────────────────────────

create or replace function mark_order_paid(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
begin
  if not is_admin() then
    raise exception 'Танд энэ үйлдлийн эрх алга.';
  end if;

  select * into v_order from orders where id = p_order_id;
  if not found then
    raise exception 'Захиалга олдсонгүй.';
  end if;

  if v_order.payment_status = 'paid' then
    raise exception 'Энэ захиалга аль хэдийн төлөгдсөн байна.';
  end if;

  update orders
     set payment_status = 'paid',
         paid_at        = now()
   where id = p_order_id;

  select * into v_order from orders where id = p_order_id;
  return to_jsonb(v_order);
end;
$$;

revoke all on function confirm_order(uuid, text, text, int) from public;
revoke all on function mark_order_paid(uuid) from public;
grant execute on function confirm_order(uuid, text, text, int) to authenticated;
grant execute on function mark_order_paid(uuid) to authenticated;
