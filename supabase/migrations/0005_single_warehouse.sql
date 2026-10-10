-- Одоогоор ганц агуулахтай: Барилгачин худалдааны төв.
-- Бусад гурав нь жишээ өгөгдөл байсан тул үлдэгдлийг нь төв рүү нэгтгээд хаана.

begin;

-- 1) Үндсэн агуулахын нэр, хаягийг бодитоор нь засна.
update warehouses
set name    = 'Барилгачин худалдааны төв',
    address = 'Сонсголонгийн зам, Баянгол дүүрэг, Улаанбаатар 16103'
where code = 'wh-main';

-- 2) Бусад агуулахын үлдэгдлийг төв рүү нэмнэ.
insert into product_stock (product_id, warehouse_id, qty)
select s.product_id,
       (select id from warehouses where code = 'wh-main'),
       sum(s.qty)
from product_stock s
join warehouses w on w.id = s.warehouse_id
where w.code <> 'wh-main'
group by s.product_id
on conflict (product_id, warehouse_id)
do update set qty = product_stock.qty + excluded.qty;

-- 3) Нэгтгэсэн мөрүүдийг устгана.
delete from product_stock
where warehouse_id in (select id from warehouses where code <> 'wh-main');

-- 4) Салбаруудыг идэвхгүй болгоно (устгахгүй — түүх хадгалагдана).
update warehouses set is_active = false where code <> 'wh-main';

commit;
