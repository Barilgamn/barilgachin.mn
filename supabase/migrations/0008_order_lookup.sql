-- Харилцагч нэхэмжлэхээ сайт дээрээс харах.
-- Supabase SQL Editor-т ажиллуулна.

-- orders хүснэгтийг нийтэд нээхгүй. Захиалгын дугаар, утас хоёрыг
-- зэрэг мэдэж байж л нэг захиалга буцаана — дугаараар дараалан
-- тоолж бусдын захиалгыг харах боломжгүй.

create or replace function lookup_order(p_order_no text, p_phone text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order    orders%rowtype;
  v_customer customers%rowtype;
  v_items    jsonb;
begin
  if coalesce(trim(p_order_no), '') = '' or coalesce(trim(p_phone), '') = '' then
    raise exception 'Захиалгын дугаар, утасны дугаараа оруулна уу.';
  end if;

  select o.* into v_order
    from orders o
    join customers c on c.id = o.customer_id
   where upper(trim(o.order_no)) = upper(trim(p_order_no))
     -- Утсыг таслал, зай, зураасаас үл хамааран тааруулна.
     and regexp_replace(c.phone, '\D', '', 'g') = regexp_replace(p_phone, '\D', '', 'g');

  if not found then
    raise exception 'Захиалга олдсонгүй. Дугаар, утсаа шалгана уу.';
  end if;

  select * into v_customer from customers where id = v_order.customer_id;

  select coalesce(jsonb_agg(
           jsonb_build_object(
             'sku', i.sku, 'name', i.name, 'uom', i.uom,
             'qty', i.qty, 'unit_price', i.unit_price, 'line_total', i.line_total
           ) order by i.name
         ), '[]'::jsonb)
    into v_items
    from order_items i
   where i.order_id = v_order.id;

  return jsonb_build_object(
    'order_no',          v_order.order_no,
    'status',            v_order.status,
    'invoice_no',        v_order.invoice_no,
    'invoice_issued_at', v_order.invoice_issued_at,
    'due_date',          v_order.due_date,
    'paid_at',           v_order.paid_at,
    'payment_status',    v_order.payment_status,
    'created_at',        v_order.created_at,
    'subtotal',          v_order.subtotal,
    'delivery_fee',      v_order.delivery_fee,
    'total',             v_order.total,
    'delivery_type',     v_order.delivery_type,
    'district',          v_order.district,
    'khoroo',            v_order.khoroo,
    'street_address',    v_order.street_address,
    'company_register',  v_order.company_register,
    'company_name',      v_order.company_name,
    'customer_name',     v_customer.name,
    'customer_phone',    v_customer.phone,
    'customer_email',    v_customer.email,
    'items',             v_items
  );
end;
$$;

revoke all on function lookup_order(text, text) from public;
grant execute on function lookup_order(text, text) to anon, authenticated;
