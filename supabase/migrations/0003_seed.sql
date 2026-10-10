-- barilgachin.mn — одоогийн каталогийг баазад оруулах.
-- scripts/generate-seed.ts-ээр үүсгэсэн. Дахин ажиллуулахад давхардахгүй.

begin;

-- брэнд
insert into brands (slug, name, short_code, country, sort_order) values ('mak', 'МАК (Монголын Алт Компани)', 'MAK', 'Евроцемент', 0) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('moncement', 'Монцемент Билдинг Материалс', 'MONCEMENT', 'MNS Цемент', 1) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('knauf', 'КНАУФ (Knauf)', 'KNAUF', 'Герман гипс', 2) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('hilti', 'Hilti Group', 'HILTI', 'Мэргэжлийн багаж', 3) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('darkhan', 'Дарханы Төмөрлөг', 'ДАРХАН', 'Ган арматур', 4) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('schneider', 'Schneider Electric', 'Schneider', 'Цахилгаан', 5) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('tikkurila', 'Tikkurila', 'TIKKURILA', 'Финланд будаг', 6) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('technonicol', 'Технониколь (TechnoNICOL)', 'TN', 'Дээвэр, дулаалга', 7) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('bosch', 'Bosch Power Tools', 'BOSCH', 'Цахилгаан багаж', 8) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('wilo', 'Wilo SE', 'wilo', 'Герман насос', 9) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('kalde', 'Kalde Pipe', 'kalde', 'Турк хоолой', 10) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('basalt', 'Монгол Базальт ХК', 'BASALT', 'Чулуун хөвөн', 11) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('dewalt', 'DeWalt', 'DEWALT', 'Багаж хэрэгсэл', 12) on conflict (slug) do nothing;
insert into brands (slug, name, short_code, country, sort_order) values ('valtec', 'Valtec', 'VALTEC', 'Итали хаалт', 13) on conflict (slug) do nothing;

-- агуулах
insert into warehouses (code, name, address, sort_order) values ('wh-main', 'Төв агуулах (22-ын товчоо)', 'Сонгинохайрхан дүүрэг, 22-ын товчоо, Барилгачин Логистик Парк', 0) on conflict (code) do nothing;
insert into warehouses (code, name, address, sort_order) values ('wh-gurvaljin', 'Гурвалжингийн салбар', 'Баянгол дүүрэг, Гурвалжингийн гүүр, Барилгын их зах №14', 1) on conflict (code) do nothing;
insert into warehouses (code, name, address, sort_order) values ('wh-44', '44-р зах салбар', 'Баянзүрх дүүрэг, Чулуун овоо, 44-р захын агуулах 3', 2) on conflict (code) do nothing;
insert into warehouses (code, name, address, sort_order) values ('wh-yarmag', 'Яармаг салбар', 'Хан-Уул дүүрэг, 4-р хороо, Яармагийн шинэ суурьшлын бүс', 3) on conflict (code) do nothing;

-- ангилал
insert into categories (slug, name, description, icon_name, image_url, sort_order, is_published) values ('cement-concrete', 'Цемент, зуурмаг, бетон', 'Өндөр маркийн цемент, савласан бэлэн зуурмаг, бетон хийцийн нэмэлтүүд', 'Truck', 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80', 0, true) on conflict (slug) do nothing;
insert into categories (slug, name, description, icon_name, image_url, sort_order, is_published) values ('rebar-steel', 'Арматур, төмөр хийц', 'MNS ба олон улсын стандарт хангасан арматур төмөр, катанка, хоолой', 'Grid3X3', 'https://images.pexels.com/photos/5623179/pexels-photo-5623179.jpeg?auto=compress&cs=tinysrgb&w=600&h=450&fit=crop', 1, true) on conflict (slug) do nothing;
insert into categories (slug, name, description, icon_name, image_url, sort_order, is_published) values ('bricks-blocks', 'Блок, тоосго, өрлөг', 'Евро стандарт бүхий автоклавын хийт бетон блок, улаан тоосго, хөөсөн блок', 'Blocks', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80', 2, true) on conflict (slug) do nothing;
insert into categories (slug, name, description, icon_name, image_url, sort_order, is_published) values ('insulation-roof', 'Дулаалга, дээвэр, фасад', 'Эрдэс хөвөн, базальт дулаалга, XPS/EPS хөөсөнцөр, металл дээврийн хавтан', 'Home', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80', 3, true) on conflict (slug) do nothing;
insert into categories (slug, name, description, icon_name, image_url, sort_order, is_published) values ('drywall-interior', 'Гипсэн хавтан, засал, будаг', 'Чийг ба галд тэсвэртэй гипс, каркас төмөр, эко эмульс будаг, шаваас', 'Paintbrush', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80', 4, true) on conflict (slug) do nothing;
insert into categories (slug, name, description, icon_name, image_url, sort_order, is_published) values ('electrical-lighting', 'Цахилгаан, кабель, самбар', 'Монгол кабель, автомат таслуур, LED гэрэлтүүлэг, хүчний тоноглол', 'Zap', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', 5, true) on conflict (slug) do nothing;
insert into categories (slug, name, description, icon_name, image_url, sort_order, is_published) values ('plumbing-hvac', 'Сантехник, халаалт, агааржуулалт', 'PPR/PEX хоолой, холбох хэрэгсэл, радиатор, насос, халаалтын зуух', 'Droplets', 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80', 6, true) on conflict (slug) do nothing;
insert into categories (slug, name, description, icon_name, image_url, sort_order, is_published) values ('tools-hardware', 'Багаж хэрэгсэл, бэхэлгээ', 'Мэргэжлийн цахилгаан ба гар багаж, өрмийн алх, анкер, тэлэгч шруп', 'Wrench', 'https://images.pexels.com/photos/8487757/pexels-photo-8487757.jpeg?auto=compress&cs=tinysrgb&w=600&h=450&fit=crop', 7, true) on conflict (slug) do nothing;

-- бараа
-- CEM-MAK-PC425 — МАК Евроцемент PC 42.5 (50кг шуудай)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'CEM-MAK-PC425', '8650001004251', 'mak-evrotsement-pc-42-5-50kg-shuudai', 'МАК Евроцемент PC 42.5 (50кг шуудай)', 'МАК Портланд Цемент M500 / PC 42.5N',
  (select id from categories where slug = 'cement-concrete'), 'Портланд цемент (M-400, M-500)', (select id from brands where name = 'МАК (Монголын Алт Компани)' limit 1),
  18500, 19800, 'шуудай 50кг', 50, 0.035,
  'Европын хуурай аргын дэвшилтэт технологиор үйлдвэрлэсэн өндөр бат бэхтэй портланд цемент. Бүх төрлийн даацын цутгамал хийц, багана, хучилтад нэн тохиромжтой.', 'МАК Евроцемент үйлдвэрийн PC 42.5N маркийн портланд цемент нь Монгол улсын MNS 974:2008 болон Европын EN 197-1 стандартын чанарын шаардлагыг бүрэн хангасан. Барьцалдах хугацаа жигд, эхний бат бэх авалт хурдан бөгөөд өвлийн нөхцөлд нэмэлттэй ажиллахад онцгой тохиромжтой.', 'MNS 974:2008', 'Монгол',
  'truck_5t', '1 палет (40 шуудай = 2тн) - Портер эсвэл Бонго; 2 палетээс дээш Зил-130, Крантай ачааны тэрэг шаардлагатай.',
  true, true, true,
  false, true, 0
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'CEM-MAK-PC425'), 'https://images.pexels.com/photos/29817952/pexels-photo-29817952.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'МАК Евроцемент PC 42.5 (50кг шуудай)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'CEM-MAK-PC425') and url = 'https://images.pexels.com/photos/29817952/pexels-photo-29817952.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'CEM-MAK-PC425'), 'https://images.pexels.com/photos/6473974/pexels-photo-6473974.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'МАК Евроцемент PC 42.5 (50кг шуудай)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'CEM-MAK-PC425') and url = 'https://images.pexels.com/photos/6473974/pexels-photo-6473974.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'CEM-MAK-PC425'), 'Марк / Ангилал', 'PC 42.5N (M-500)', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'CEM-MAK-PC425') and name = 'Марк / Ангилал');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'CEM-MAK-PC425'), 'Стандарт', 'MNS 974:2008, EN 197-1', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'CEM-MAK-PC425') and name = 'Стандарт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'CEM-MAK-PC425'), 'Савалгаа', '50 кг чийг үл нэвтрэх 3 давхар цаасан шуудай', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'CEM-MAK-PC425') and name = 'Савалгаа');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'CEM-MAK-PC425'), '28 хоногийн бат бэх', '≥ 42.5 МПа', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'CEM-MAK-PC425') and name = '28 хоногийн бат бэх');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'CEM-MAK-PC425'), 'Барьцалдаж эхлэх хугацаа', '140-180 минут', 4 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'CEM-MAK-PC425') and name = 'Барьцалдаж эхлэх хугацаа');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'CEM-MAK-PC425'), 'Нягт (хувийн жин)', '3.15 г/см³', 5 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'CEM-MAK-PC425') and name = 'Нягт (хувийн жин)');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'CEM-MAK-PC425'), 1, 18500) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'CEM-MAK-PC425'), 40, 17800) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'CEM-MAK-PC425'), 200, 16900) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'CEM-MAK-PC425'), 600, 16200) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'CEM-MAK-PC425'), (select id from warehouses where code = 'wh-main'), 4500) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'CEM-MAK-PC425'), (select id from warehouses where code = 'wh-gurvaljin'), 850) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'CEM-MAK-PC425'), (select id from warehouses where code = 'wh-44'), 1200) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'CEM-MAK-PC425'), (select id from warehouses where code = 'wh-yarmag'), 640) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- BLK-MAK-AAC600 — МАК Евроблок AAC D600 (600x300x200мм)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'BLK-MAK-AAC600', '8650002006002', 'mak-evroblok-aac-d600-600x300x200mm', 'МАК Евроблок AAC D600 (600x300x200мм)', 'Автоклавын Хийт Бетон Блок (AAC D600 B3.5)',
  (select id from categories where slug = 'bricks-blocks'), 'Хийт бетон блок (AAC)', (select id from brands where name = 'МАК Евроблок' limit 1),
  9800, 10500, 'ширхэг', 21.6, 0.036,
  'Германы Wehrhahn технологийн хийт бетон автоклавын блок. Өндөр дулаан хадгалалт, галд 4 цаг тэсвэртэй, өрлөгийн хугацааг 3 дахин хэмнэнэ.', 'МАК Евроблок D600 нь барилгын гадна даацын бус болон дотор ханын өрлөгт өргөн хэрэглэгддэг. Төгс нарийн хэмжээст геометр (+/- 1мм) нь ердөө 2-3мм зузаан цавуугаар өрөх боломжийг олгож, хүйтний гүүр үүсэхээс бүрэн сэргийлдэг.', 'MNS EN 771-4:2018', 'Монгол',
  'heavy_crane', 'Палеттай блок буулгахад манипулятор крантай тээврийн хэрэгсэл шаардлагатай. (1 палет = 48 ш, 1.05 тн)',
  true, true, true,
  false, true, 1
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'BLK-MAK-AAC600'), 'https://images.pexels.com/photos/36386917/pexels-photo-36386917.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'МАК Евроблок AAC D600 (600x300x200мм)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'BLK-MAK-AAC600') and url = 'https://images.pexels.com/photos/36386917/pexels-photo-36386917.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'BLK-MAK-AAC600'), 'https://images.pexels.com/photos/8180037/pexels-photo-8180037.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'МАК Евроблок AAC D600 (600x300x200мм)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'BLK-MAK-AAC600') and url = 'https://images.pexels.com/photos/8180037/pexels-photo-8180037.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'BLK-MAK-AAC600'), 'Хэмжээ (Урт x Өндөр x Зузаан)', '600 x 300 x 200 мм', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'BLK-MAK-AAC600') and name = 'Хэмжээ (Урт x Өндөр x Зузаан)');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'BLK-MAK-AAC600'), 'Хуурай төлөвийн нягт', 'D600 (550-650 кг/м³)', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'BLK-MAK-AAC600') and name = 'Хуурай төлөвийн нягт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'BLK-MAK-AAC600'), 'Шахалтын бат бэх', 'B3.5 (4.0 МПа)', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'BLK-MAK-AAC600') and name = 'Шахалтын бат бэх');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'BLK-MAK-AAC600'), 'Дулаан дамжуулалтын илтгэлцүүр', '0.12 Вт/(м·°C)', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'BLK-MAK-AAC600') and name = 'Дулаан дамжуулалтын илтгэлцүүр');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'BLK-MAK-AAC600'), 'Гал тэсвэржилт', 'REI 240 (4 цаг)', 4 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'BLK-MAK-AAC600') and name = 'Гал тэсвэржилт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'BLK-MAK-AAC600'), '1м³ дэх тоо ширхэг', '27.7 ширхэг', 5 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'BLK-MAK-AAC600') and name = '1м³ дэх тоо ширхэг');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'BLK-MAK-AAC600'), 1, 9800) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'BLK-MAK-AAC600'), 48, 9300) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'BLK-MAK-AAC600'), 288, 8900) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'BLK-MAK-AAC600'), 800, 8450) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'BLK-MAK-AAC600'), (select id from warehouses where code = 'wh-main'), 8400) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'BLK-MAK-AAC600'), (select id from warehouses where code = 'wh-gurvaljin'), 1200) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'BLK-MAK-AAC600'), (select id from warehouses where code = 'wh-44'), 950) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- STL-REB-D16-A500 — Арматур төмөр Ф16мм A500C (12м урттай)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'STL-REB-D16-A500', '8650003016008', 'armatur-tomor-f16mm-a500c-12m-urttai', 'Арматур төмөр Ф16мм A500C (12м урттай)', 'Барилгын ган арматур Ф16 мм, MNS/ГОСТ стандарт',
  (select id from categories where slug = 'rebar-steel'), 'Арматур төмөр (Ф10 - Ф32)', (select id from brands where name = 'Дарханы Төмөрлөг' limit 1),
  44200, 47000, 'ширхэг', 18.96, 0.0024,
  'Халуун цувимал хавиргат ган арматур A500C. Барилгын суурь, багана, дам нуруу, даацын төмөр бетон бүтээцэд зориулагдсан.', 'A500C ангиллын ган арматур нь гагнах чадвар өндөр, уян хатан бөгөөд газар хөдлөлтийн 8-9 баллын бүсэд баригдах өндөр барилга байгууламжид найдвартай ажиллана. Бүтээгдэхүүн бүр үйлдвэрийн сорилт шинжилгээний чанарын гэрчилгээтэй.', 'MNS ISO 6935-2:2019', 'Монгол',
  'heavy_crane', '12м урттай тул 12 метрийн урт ачааны машин (Трейлер эсвэл 10-20тн тэрэг) тээвэрлэнэ. Таслах үйлчилгээ авах боломжтой.',
  true, true, true,
  false, true, 2
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'STL-REB-D16-A500'), 'https://images.pexels.com/photos/5623179/pexels-photo-5623179.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Арматур төмөр Ф16мм A500C (12м урттай)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'STL-REB-D16-A500') and url = 'https://images.pexels.com/photos/5623179/pexels-photo-5623179.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'STL-REB-D16-A500'), 'https://images.pexels.com/photos/11891953/pexels-photo-11891953.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Арматур төмөр Ф16мм A500C (12м урттай)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'STL-REB-D16-A500') and url = 'https://images.pexels.com/photos/11891953/pexels-photo-11891953.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'STL-REB-D16-A500'), 'Диаметр (Ф)', '16 мм', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'STL-REB-D16-A500') and name = 'Диаметр (Ф)');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'STL-REB-D16-A500'), 'Урт', '12 метр', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'STL-REB-D16-A500') and name = 'Урт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'STL-REB-D16-A500'), 'Гангийн марк', 'A500C / 35ГС', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'STL-REB-D16-A500') and name = 'Гангийн марк');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'STL-REB-D16-A500'), 'Шугаман жин', '1.58 кг/метр (12м = 18.96 кг)', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'STL-REB-D16-A500') and name = 'Шугаман жин');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'STL-REB-D16-A500'), 'Урсалтын хязгаар', '≥ 500 Н/мм²', 4 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'STL-REB-D16-A500') and name = 'Урсалтын хязгаар');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'STL-REB-D16-A500'), 'Суналтын бат бэх', '≥ 600 Н/мм²', 5 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'STL-REB-D16-A500') and name = 'Суналтын бат бэх');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'STL-REB-D16-A500'), 1, 44200) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'STL-REB-D16-A500'), 53, 42000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'STL-REB-D16-A500'), 265, 40500) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'STL-REB-D16-A500'), 1050, 38800) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'STL-REB-D16-A500'), (select id from warehouses where code = 'wh-main'), 3200) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'STL-REB-D16-A500'), (select id from warehouses where code = 'wh-gurvaljin'), 650) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- INS-KNAUF-RW100 — KNAUF Insulation Базальт эрдэс хөвөн (100мм, 5.76м²)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'INS-KNAUF-RW100', '4006379088123', 'knauf-insulation-bazalt-erdes-hovon-100mm-5-76m', 'KNAUF Insulation Базальт эрдэс хөвөн (100мм, 5.76м²)', 'КНАУФ Дуу болон Дулаан тусгаарлагч Базальт хөвөн',
  (select id from categories where slug = 'insulation-roof'), 'Базальт эрдэс хөвөн', (select id from brands where name = 'KNAUF (Герман)' limit 1),
  68500, 74000, 'боодол', 14.5, 0.576,
  'Экологийн цэвэр ECOSE технологиор хийгдсэн, формальдегидгүй, шатдаггүй (NG) базальт эрдэс дулаалгын хөвөн. Дээвэр, мансард, фасад, хуваалт хананд зориулагдсан.', 'KNAUF Insulation нь байгалийн эрдэс чулууг хайлуулан гаргаж авсан хөвөн бөгөөд тоосжилт багатай, арьс загатнуулахгүй, суулт өгөхгүй. Дулаан алдагдлыг 80% хүртэл бууруулж, дуу чимээг маш сайн тусгаарлана.', 'MNS EN 13162:2011', 'Герман / ОХУ',
  'porter', 'Эзлэхүүн ихтэй тул 20-30 боодолд Портер, 50-аас дээш боодолд том оврын битүү тэрэг тохиромжтой.',
  true, true, true,
  false, true, 3
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'INS-KNAUF-RW100'), 'https://images.pexels.com/photos/6124239/pexels-photo-6124239.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'KNAUF Insulation Базальт эрдэс хөвөн (100мм, 5.76м²)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'INS-KNAUF-RW100') and url = 'https://images.pexels.com/photos/6124239/pexels-photo-6124239.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'INS-KNAUF-RW100'), 'https://images.pexels.com/photos/38749876/pexels-photo-38749876.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'KNAUF Insulation Базальт эрдэс хөвөн (100мм, 5.76м²)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'INS-KNAUF-RW100') and url = 'https://images.pexels.com/photos/38749876/pexels-photo-38749876.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'INS-KNAUF-RW100'), 'Зузаан', '100 мм', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'INS-KNAUF-RW100') and name = 'Зузаан');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'INS-KNAUF-RW100'), 'Боодол дахь талбай', '5.76 м² (8 хавтан: 1200 x 600 мм)', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'INS-KNAUF-RW100') and name = 'Боодол дахь талбай');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'INS-KNAUF-RW100'), 'Нягт', '35-40 кг/м³', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'INS-KNAUF-RW100') and name = 'Нягт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'INS-KNAUF-RW100'), 'Дулаан дамжуулалт (λ)', '0.035 Вт/(м·K)', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'INS-KNAUF-RW100') and name = 'Дулаан дамжуулалт (λ)');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'INS-KNAUF-RW100'), 'Гал тэсвэршилт', 'НГ (Шатдаггүй ангилал)', 4 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'INS-KNAUF-RW100') and name = 'Гал тэсвэршилт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'INS-KNAUF-RW100'), 'Уур нэвтрүүлэлт', 'μ = 1.0 (Амьсгалдаг)', 5 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'INS-KNAUF-RW100') and name = 'Уур нэвтрүүлэлт');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'INS-KNAUF-RW100'), 1, 68500) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'INS-KNAUF-RW100'), 24, 64000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'INS-KNAUF-RW100'), 100, 60500) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'INS-KNAUF-RW100'), 300, 57000) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'INS-KNAUF-RW100'), (select id from warehouses where code = 'wh-main'), 1800) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'INS-KNAUF-RW100'), (select id from warehouses where code = 'wh-gurvaljin'), 420) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'INS-KNAUF-RW100'), (select id from warehouses where code = 'wh-yarmag'), 310) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- DRY-KNAUF-GKB12 — KNAUF Чийг тэсвэртэй ногоон гипс (12.5мм, 1200x2500мм)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'DRY-KNAUF-GKB12', '4006379012345', 'knauf-chiig-tesvertei-nogoon-gips-12-5mm-1200x2500mm', 'KNAUF Чийг тэсвэртэй ногоон гипс (12.5мм, 1200x2500мм)', 'КНАУФ Ус чийгэнд тэсвэртэй гипсэн хавтан (GKB-I)',
  (select id from categories where slug = 'drywall-interior'), 'Гипсэн хавтан (Стандарт, Чийг тэсвэртэй)', (select id from brands where name = 'KNAUF' limit 1),
  24500, 26000, 'ширхэг', 28.5, 0.0375,
  'Угаалгын өрөө, гал тогоо, нийтийн үйлчилгээний чийгшил өндөртэй өрөө тасалгааны хана, таазны дотор өнгөлгөөний зориулалттай тусгай нэмэлттэй ногоон гипс.', 'Гипсийн найрлагад ус үл шингээх тусгай силикон нэмэлт болон мөөгөнцрийн эсрэг бодис агуулсан. Цаасны гадаргуу нь ус чийг нэвтрэхээс бүрэн хамгаална.', 'MNS EN 520:2011', 'Герман / Казахстан',
  'truck_5t', 'Хэврэг бүтээгдэхүүн тул палеттай ачих үед крантай машин эсвэл хавтгай тэвштэй Портер тохиромжтой.',
  true, true, true,
  false, true, 4
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'DRY-KNAUF-GKB12'), 'https://images.pexels.com/photos/27728636/pexels-photo-27728636.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'KNAUF Чийг тэсвэртэй ногоон гипс (12.5мм, 1200x2500мм)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'DRY-KNAUF-GKB12') and url = 'https://images.pexels.com/photos/27728636/pexels-photo-27728636.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'DRY-KNAUF-GKB12'), 'https://images.pexels.com/photos/4981812/pexels-photo-4981812.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'KNAUF Чийг тэсвэртэй ногоон гипс (12.5мм, 1200x2500мм)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'DRY-KNAUF-GKB12') and url = 'https://images.pexels.com/photos/4981812/pexels-photo-4981812.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'DRY-KNAUF-GKB12'), 'Хэмжээ (Өргөн x Урт)', '1200 x 2500 мм (3.0 м²)', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'DRY-KNAUF-GKB12') and name = 'Хэмжээ (Өргөн x Урт)');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'DRY-KNAUF-GKB12'), 'Зузаан', '12.5 мм', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'DRY-KNAUF-GKB12') and name = 'Зузаан');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'DRY-KNAUF-GKB12'), 'Хавтангийн төрөл', 'H2 (Ус чийг шингээлт < 10%)', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'DRY-KNAUF-GKB12') and name = 'Хавтангийн төрөл');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'DRY-KNAUF-GKB12'), 'Жин', '~9.5 кг/м² (нийт 28.5 кг)', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'DRY-KNAUF-GKB12') and name = 'Жин');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'DRY-KNAUF-GKB12'), 'Хөндлөн гулзайлтын бат бэх', '≥ 550 Н', 4 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'DRY-KNAUF-GKB12') and name = 'Хөндлөн гулзайлтын бат бэх');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'DRY-KNAUF-GKB12'), 1, 24500) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'DRY-KNAUF-GKB12'), 30, 23200) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'DRY-KNAUF-GKB12'), 68, 22000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'DRY-KNAUF-GKB12'), 200, 20800) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'DRY-KNAUF-GKB12'), (select id from warehouses where code = 'wh-main'), 2400) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'DRY-KNAUF-GKB12'), (select id from warehouses where code = 'wh-gurvaljin'), 950) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'DRY-KNAUF-GKB12'), (select id from warehouses where code = 'wh-44'), 820) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- PNT-TIK-LUMI20 — Tikkurila Luja 7 Эко угаагддаг бактерийн эсрэг будаг (18л)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'PNT-TIK-LUMI20', '6408070012903', 'tikkurila-luja-7-eko-ugaagddag-bakteriin-esreg-budag-18l', 'Tikkurila Luja 7 Эко угаагддаг бактерийн эсрэг будаг (18л)', 'Тиккурила Дотор ханын өндөр зэрэглэлийн матт будаг',
  (select id from categories where slug = 'drywall-interior'), 'Эко дотор ба гадна будаг', (select id from brands where name = 'Tikkurila (Финлянд)' limit 1),
  385000, 420000, 'хувин 20л', 24, 0.025,
  'Эмнэлэг, сургууль, орон сууцны хананд зориулсан 20,000 удаа угаагдах тэсвэртэй, хөгц мөөгөнцрийн эсрэг нэмэлттэй дээд зэргийн акрил будаг.', 'Tikkurila Luja 7 нь M1 экологийн хамгийн дээд зэрэглэлийн гэрчилгээтэй, үнэргүй, VOC агууламж маш бага тул хүүхдийн өрөө болон эрүүл ахуйн өндөр шаардлагатай орчинд хамгийн тохиромжтой.', 'ISO 11998, M1 Эко', 'Финлянд / Швед',
  'any', 'Энгийн суудлын тэрэг, Портер, шуурхай такси хүргэлтээр хүргэх боломжтой.',
  true, false, true,
  false, true, 5
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'PNT-TIK-LUMI20'), 'https://images.pexels.com/photos/34046207/pexels-photo-34046207.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Tikkurila Luja 7 Эко угаагддаг бактерийн эсрэг будаг (18л)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'PNT-TIK-LUMI20') and url = 'https://images.pexels.com/photos/34046207/pexels-photo-34046207.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'PNT-TIK-LUMI20'), 'https://images.pexels.com/photos/5583126/pexels-photo-5583126.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Tikkurila Luja 7 Эко угаагддаг бактерийн эсрэг будаг (18л)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'PNT-TIK-LUMI20') and url = 'https://images.pexels.com/photos/5583126/pexels-photo-5583126.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PNT-TIK-LUMI20'), 'Савалгаа', '18 литр / 24 кг', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PNT-TIK-LUMI20') and name = 'Савалгаа');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PNT-TIK-LUMI20'), 'Зарцуулалт', '1л = 8-10 м² (1 хувингаар 150-180 м² 1 үе)', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PNT-TIK-LUMI20') and name = 'Зарцуулалт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PNT-TIK-LUMI20'), 'Гялбааны түвшин', 'Матт (Matte 7)', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PNT-TIK-LUMI20') and name = 'Гялбааны түвшин');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PNT-TIK-LUMI20'), 'Угаагдах чадвар', '1-р ангилал (EN 13300 > 20,000 үрэлт)', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PNT-TIK-LUMI20') and name = 'Угаагдах чадвар');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PNT-TIK-LUMI20'), 'Хатах хугацаа', '2 цагийн дараа дараагийн үеэ будах', 4 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PNT-TIK-LUMI20') and name = 'Хатах хугацаа');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PNT-TIK-LUMI20'), 1, 385000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PNT-TIK-LUMI20'), 5, 365000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PNT-TIK-LUMI20'), 20, 345000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PNT-TIK-LUMI20'), 50, 320000) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'PNT-TIK-LUMI20'), (select id from warehouses where code = 'wh-main'), 340) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'PNT-TIK-LUMI20'), (select id from warehouses where code = 'wh-gurvaljin'), 120) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'PNT-TIK-LUMI20'), (select id from warehouses where code = 'wh-yarmag'), 85) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- ELC-CBL-3X25-CU — Кабель Трейд Зэс утас ВВГнг-LS 3x2.5мм² (100м)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'ELC-CBL-3X25-CU', '8650007032501', 'kabel-treid-zes-utas-vvgng-ls-3x2-5mm-100m', 'Кабель Трейд Зэс утас ВВГнг-LS 3x2.5мм² (100м)', 'Галд тэсвэртэй утаа бага ялгаруулдаг зэс цахилгааны кабель',
  (select id from categories where slug = 'electrical-lighting'), 'Зэс ба хөнгөн цагаан кабель', (select id from brands where name = 'Кабель Трейд Монгол' limit 1),
  245000, 265000, 'боодол', 13.2, 0.018,
  'Орон сууц, барилгын розетка болон 220V хүчний шугамд зориулагдсан 100% цэвэр зэс голтой, гал дэмждэггүй, утаа бага ялгаруулдаг (Low Smoke) кабель.', 'Монгол улсын стандартын шаардлага хангасан 99.9% электролит цэвэр зэс дамжуулагчтай. PVC тусгаарлагч нь галын аюулгүй байдлын MNS IEC стандартад бүрэн нийцсэн.', 'MNS IEC 60227, ГОСТ 31996', 'Монгол',
  'any', 'Энгийн суудлын тэрэг эсвэл шуудан хүргэлтээр авах боломжтой.',
  true, true, true,
  false, true, 6
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'ELC-CBL-3X25-CU'), 'https://images.pexels.com/photos/11133641/pexels-photo-11133641.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Кабель Трейд Зэс утас ВВГнг-LS 3x2.5мм² (100м)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'ELC-CBL-3X25-CU') and url = 'https://images.pexels.com/photos/11133641/pexels-photo-11133641.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'ELC-CBL-3X25-CU'), 'https://images.pexels.com/photos/8488029/pexels-photo-8488029.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Кабель Трейд Зэс утас ВВГнг-LS 3x2.5мм² (100м)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'ELC-CBL-3X25-CU') and url = 'https://images.pexels.com/photos/8488029/pexels-photo-8488029.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ELC-CBL-3X25-CU'), 'Судлын тоо ба хөндлөн огтлол', '3 x 2.5 мм²', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ELC-CBL-3X25-CU') and name = 'Судлын тоо ба хөндлөн огтлол');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ELC-CBL-3X25-CU'), 'Боодол дахь урт', '100 метр', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ELC-CBL-3X25-CU') and name = 'Боодол дахь урт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ELC-CBL-3X25-CU'), 'Дамжуулагч материал', '1-р ангиллын цэвэр зэс (Cu 99.9%)', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ELC-CBL-3X25-CU') and name = 'Дамжуулагч материал');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ELC-CBL-3X25-CU'), 'Ажлын хүчдэл', '660 В / 1000 В', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ELC-CBL-3X25-CU') and name = 'Ажлын хүчдэл');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ELC-CBL-3X25-CU'), 'Гал тархалт', 'нг-LS (Гал дэмждэггүй, бага утаатай)', 4 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ELC-CBL-3X25-CU') and name = 'Гал тархалт');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ELC-CBL-3X25-CU'), 1, 245000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ELC-CBL-3X25-CU'), 5, 232000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ELC-CBL-3X25-CU'), 20, 218000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ELC-CBL-3X25-CU'), 50, 205000) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ELC-CBL-3X25-CU'), (select id from warehouses where code = 'wh-main'), 650) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ELC-CBL-3X25-CU'), (select id from warehouses where code = 'wh-gurvaljin'), 280) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ELC-CBL-3X25-CU'), (select id from warehouses where code = 'wh-44'), 190) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- TLS-HILTI-TE30 — Hilti TE 30-AVR Мэргэжлийн SDS-Plus Өрмийн алх (850W, 3.6J)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'TLS-HILTI-TE30', '7613023891024', 'hilti-te-30-avr-mergejliin-sds-plus-ormiin-alh-850w-3-6j', 'Hilti TE 30-AVR Мэргэжлийн SDS-Plus Өрмийн алх (850W, 3.6J)', 'Хилти Мэргэжлийн Цохилтот Өрөм ба Цүүцдэгч',
  (select id from categories where slug = 'tools-hardware'), 'Цахилгаан гар багаж', (select id from brands where name = 'Hilti (Лихтенштейн)' limit 1),
  1890000, 2050000, 'ширхэг', 4.2, 0.015,
  'AVR идэвхтэй доргилт бууруулагч системтэй, бетонд 4-28мм өрөмдөх болон цүүцдэх хүнд даацын мэргэжлийн өрмийн алх. 2 жилийн баталгаат засвартай.', 'Хилти брэндийн TE 30-AVR нь өдөр тутмын хүнд нөхцөлд тасралтгүй ажиллахад зориулагдсан. Хурдан солигддог патрон, мотор хамгаалах хэт халалтын мэдрэгчтэй.', 'CE, ISO 9001', 'Австри / Лихтенштейн',
  'any', 'Шууд шуурхай такси хүргэлт эсвэл салбараас очиж авах боломжтой.',
  true, true, false,
  false, true, 7
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'TLS-HILTI-TE30'), 'https://images.pexels.com/photos/8487757/pexels-photo-8487757.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Hilti TE 30-AVR Мэргэжлийн SDS-Plus Өрмийн алх (850W, 3.6J)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'TLS-HILTI-TE30') and url = 'https://images.pexels.com/photos/8487757/pexels-photo-8487757.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'TLS-HILTI-TE30'), 'https://images.pexels.com/photos/3877525/pexels-photo-3877525.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Hilti TE 30-AVR Мэргэжлийн SDS-Plus Өрмийн алх (850W, 3.6J)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'TLS-HILTI-TE30') and url = 'https://images.pexels.com/photos/3877525/pexels-photo-3877525.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'TLS-HILTI-TE30'), 'Чадал', '850 Ватт', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'TLS-HILTI-TE30') and name = 'Чадал');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'TLS-HILTI-TE30'), 'Нэг цохилтын хүч', '3.6 Жоуль', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'TLS-HILTI-TE30') and name = 'Нэг цохилтын хүч');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'TLS-HILTI-TE30'), 'Өрөмдөх диаметр (Бетон)', 'Ф 4 - 28 мм (Оновчтой: 10-20 мм)', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'TLS-HILTI-TE30') and name = 'Өрөмдөх диаметр (Бетон)');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'TLS-HILTI-TE30'), 'Доргилт бууруулагч', 'AVR систем (Доргилт 10.7 м/с²)', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'TLS-HILTI-TE30') and name = 'Доргилт бууруулагч');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'TLS-HILTI-TE30'), 'Хүндийн жин', '4.2 кг', 4 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'TLS-HILTI-TE30') and name = 'Хүндийн жин');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'TLS-HILTI-TE30'), 1, 1890000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'TLS-HILTI-TE30'), 3, 1790000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'TLS-HILTI-TE30'), 10, 1680000) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'TLS-HILTI-TE30'), (select id from warehouses where code = 'wh-main'), 45) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'TLS-HILTI-TE30'), (select id from warehouses where code = 'wh-gurvaljin'), 18) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- PLB-PPR-PN20-D25 — Kalde PPR Халуун ба хүйтэн усны хоолой PN20 Ф25мм (4м)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'PLB-PPR-PN20-D25', '8650009025004', 'kalde-ppr-haluun-ba-huiten-usny-hooloi-pn20-f25mm-4m', 'Kalde PPR Халуун ба хүйтэн усны хоолой PN20 Ф25мм (4м)', 'Калде Турк чанарын шилэн хөвөнтэй PPR хуванцар хоолой',
  (select id from categories where slug = 'plumbing-hvac'), 'PPR хуванцар ба төмөр хоолой', (select id from brands where name = 'Kalde (Турк)' limit 1),
  8600, 9400, 'ширхэг', 1.45, 0.003,
  '95°C хүртэл халуун ус болон халаалтын системд 50 жилийн насжилттай шилэн хөвөн (Fiberglass) хүчитгэсэн тэлэлт багатай PPR хоолой.', 'Kalde Fiber хоолой нь шугаман тэлэлтийг 75% бууруулсан бөгөөд зэврэхгүй, өнгөр тогтохгүй, эрүүл ахуйн ундны усны бүх шаардлагыг хангасан.', 'MNS ISO 15874, DIN 8077', 'Турк',
  'any', '4 метрийн урттай тул дээврийн ачаатай суудлын тэрэг эсвэл Портерт багтана.',
  true, false, true,
  false, true, 8
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'PLB-PPR-PN20-D25'), 'https://images.pexels.com/photos/29301874/pexels-photo-29301874.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Kalde PPR Халуун ба хүйтэн усны хоолой PN20 Ф25мм (4м)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'PLB-PPR-PN20-D25') and url = 'https://images.pexels.com/photos/29301874/pexels-photo-29301874.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'PLB-PPR-PN20-D25'), 'https://images.pexels.com/photos/8488035/pexels-photo-8488035.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Kalde PPR Халуун ба хүйтэн усны хоолой PN20 Ф25мм (4м)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'PLB-PPR-PN20-D25') and url = 'https://images.pexels.com/photos/8488035/pexels-photo-8488035.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-PPR-PN20-D25'), 'Диаметр (Гадна/Дотор)', 'Ф 25 мм / Зузаан 3.5 мм', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-PPR-PN20-D25') and name = 'Диаметр (Гадна/Дотор)');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-PPR-PN20-D25'), 'Урт', '4 метр', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-PPR-PN20-D25') and name = 'Урт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-PPR-PN20-D25'), 'Даралтын ангилал', 'PN20 (20 бар)', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-PPR-PN20-D25') and name = 'Даралтын ангилал');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-PPR-PN20-D25'), 'Ажлын температур', '-20°C -аас +95°C', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-PPR-PN20-D25') and name = 'Ажлын температур');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-PPR-PN20-D25'), 'Бүтэц', '3 давхар (PPR-GF-PPR)', 4 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-PPR-PN20-D25') and name = 'Бүтэц');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PLB-PPR-PN20-D25'), 1, 8600) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PLB-PPR-PN20-D25'), 25, 8100) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PLB-PPR-PN20-D25'), 100, 7600) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PLB-PPR-PN20-D25'), 500, 7100) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'PLB-PPR-PN20-D25'), (select id from warehouses where code = 'wh-main'), 3200) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'PLB-PPR-PN20-D25'), (select id from warehouses where code = 'wh-gurvaljin'), 1400) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- ROF-DECRA-ROMAN — Decra Чулуун түрхэцтэй металл дээврийн хавтан (Roman Terracotta)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'ROF-DECRA-ROMAN', '9421008019921', 'decra-chuluun-turhetstei-metall-deevriin-havtan-roman-terracotta', 'Decra Чулуун түрхэцтэй металл дээврийн хавтан (Roman Terracotta)', 'Декра Шинэ Зеланд Чулуун гадаргуутай дээврийн хавтан',
  (select id from categories where slug = 'insulation-roof'), 'Металл ба төмөр дээвэр', (select id from brands where name = 'Decra Roofing (Шинэ Зеланд)' limit 1),
  32500, 35000, 'ширхэг', 3.1, 0.005,
  'Цайр-хөнгөн цагааны (Zincalume) хайлшин ган суурьтай, байгалийн базальт чулуун үрэлтэй дээврийн хавтан. Салхи, мөндөр, дуу чимээнд 50 жилийн баталгаатай.', 'Борооны чимээг шингээдэг, нарны хэт ягаан туяанд гандахгүй, цас гулсаж буухаас сэргийлсэн барзгар гадаргуутай дэлхийн №1 чанарын дээврийн хавтан.', 'ISO 9001, BBA Certified', 'Шинэ Зеланд / Бельги',
  'porter', 'Хувийн сууцны дундаж дээвэр (200-300ш) Портер эсвэл Бонго тэрэгний даацад бүрэн багтана.',
  true, true, false,
  false, true, 9
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'ROF-DECRA-ROMAN'), 'https://images.pexels.com/photos/9704349/pexels-photo-9704349.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Decra Чулуун түрхэцтэй металл дээврийн хавтан (Roman Terracotta)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'ROF-DECRA-ROMAN') and url = 'https://images.pexels.com/photos/9704349/pexels-photo-9704349.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'ROF-DECRA-ROMAN'), 'https://images.pexels.com/photos/34597567/pexels-photo-34597567.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Decra Чулуун түрхэцтэй металл дээврийн хавтан (Roman Terracotta)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'ROF-DECRA-ROMAN') and url = 'https://images.pexels.com/photos/34597567/pexels-photo-34597567.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ROF-DECRA-ROMAN'), 'Бүтэн хэмжээ', '1330 x 410 мм (Ашигтай талбай: 0.46 м²)', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ROF-DECRA-ROMAN') and name = 'Бүтэн хэмжээ');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ROF-DECRA-ROMAN'), '1 м² дэх тоо ширхэг', '2.17 ширхэг', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ROF-DECRA-ROMAN') and name = '1 м² дэх тоо ширхэг');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ROF-DECRA-ROMAN'), 'Гангийн зузаан', '0.43 мм Zincalume', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ROF-DECRA-ROMAN') and name = 'Гангийн зузаан');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ROF-DECRA-ROMAN'), '1 м²-ийн жин', '6.7 кг (Хөнгөн хийцтэй)', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ROF-DECRA-ROMAN') and name = '1 м²-ийн жин');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ROF-DECRA-ROMAN'), 'Салхины тэсвэржилт', '190 км/ц хүртэл салхинд тэсвэртэй', 4 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ROF-DECRA-ROMAN') and name = 'Салхины тэсвэржилт');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ROF-DECRA-ROMAN'), 1, 32500) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ROF-DECRA-ROMAN'), 100, 30500) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ROF-DECRA-ROMAN'), 300, 28900) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ROF-DECRA-ROMAN'), 800, 27000) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ROF-DECRA-ROMAN'), (select id from warehouses where code = 'wh-main'), 2800) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ROF-DECRA-ROMAN'), (select id from warehouses where code = 'wh-gurvaljin'), 720) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- CEM-MON-M500-BULK — Монцемент M-500 Сульфатад тэсвэртэй үйлдвэрийн задгай цемент (1 тн)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'CEM-MON-M500-BULK', '8650011005009', 'montsement-m-500-sulfatad-tesvertei-uildveriin-zadgai-tsement-1-tn', 'Монцемент M-500 Сульфатад тэсвэртэй үйлдвэрийн задгай цемент (1 тн)', 'Монцемент Спорлан CEM I 42.5R Задгай / Автоцистернээр',
  (select id from categories where slug = 'cement-concrete'), 'Портланд цемент (M-400, M-500)', (select id from brands where name = 'Монцемент Билдинг Материалс' limit 1),
  335000, 355000, 'тн', 1000, 0.8,
  'Бетон зуурмагийн үйлдвэр, дэд бүтэц, гүүр хоолой, даацын бэлдэц үйлдвэрлэгчдэд зориулсан задгай тээвэрлэлттэй цемент.', 'Монцемент үйлдвэрийн CEM I 42.5R нь өндөр идэвхтэй клинкерээр үйлдвэрлэгдсэн тул бетоны эрт үеийн бат бэх авалтыг түргэсгэж, хэв авах хугацааг 2 дахин хурдасгана.', 'MNS 974:2008, EN 197-1', 'Монгол',
  'mixer_truck', 'Тусгай зориулалтын цемент зөөгч үлээгч автоцистернээр хүргэгдэнэ.',
  true, false, false,
  false, true, 10
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'CEM-MON-M500-BULK'), 'https://images.pexels.com/photos/29519165/pexels-photo-29519165.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Монцемент M-500 Сульфатад тэсвэртэй үйлдвэрийн задгай цемент (1 тн)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'CEM-MON-M500-BULK') and url = 'https://images.pexels.com/photos/29519165/pexels-photo-29519165.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'CEM-MON-M500-BULK'), 'https://images.pexels.com/photos/6474342/pexels-photo-6474342.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Монцемент M-500 Сульфатад тэсвэртэй үйлдвэрийн задгай цемент (1 тн)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'CEM-MON-M500-BULK') and url = 'https://images.pexels.com/photos/6474342/pexels-photo-6474342.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'CEM-MON-M500-BULK'), 'Ангилал', 'CEM I 42.5 R (M-500 Хурдан бэхждэг)', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'CEM-MON-M500-BULK') and name = 'Ангилал');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'CEM-MON-M500-BULK'), 'Хүргэлтийн хэлбэр', 'Цемент зөөгч автоцистернээр (15-35 тн)', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'CEM-MON-M500-BULK') and name = 'Хүргэлтийн хэлбэр');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'CEM-MON-M500-BULK'), '2 өдрийн бат бэх', '≥ 20 МПа', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'CEM-MON-M500-BULK') and name = '2 өдрийн бат бэх');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'CEM-MON-M500-BULK'), '28 өдрийн бат бэх', '≥ 52.5 МПа', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'CEM-MON-M500-BULK') and name = '28 өдрийн бат бэх');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'CEM-MON-M500-BULK'), 1, 335000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'CEM-MON-M500-BULK'), 10, 320000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'CEM-MON-M500-BULK'), 50, 305000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'CEM-MON-M500-BULK'), 200, 289000) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'CEM-MON-M500-BULK'), (select id from warehouses where code = 'wh-main'), 850) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- ADH-KNAUF-FLIESEN — KNAUF Fliesen Плитаны хүчитгэсэн цавуу (25кг шуудай)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'ADH-KNAUF-FLIESEN', '4006379029988', 'knauf-fliesen-plitany-huchitgesen-tsavuu-25kg-shuudai', 'KNAUF Fliesen Плитаны хүчитгэсэн цавуу (25кг шуудай)', 'КНАУФ Дотор ба гадна хэрэглээний плитаны өндөр барьцалтай цавуу',
  (select id from categories where slug = 'cement-concrete'), 'Плитаны цавуу', (select id from brands where name = 'KNAUF' limit 1),
  16500, 18000, 'шуудай 25кг', 25, 0.02,
  'Шаазан, керамик, байгалийн чулуу болон шалны халаалттай гадаргуу дээр плита наах полимер нэмэлттэй ус ба хяруунд тэсвэртэй цавуу.', 'C1T стандартын KNAUF Fliesen нь босоо хананд наахад гулсахгүй, бат бөх чанар нь удаан хугацаанд хадгалагддаг.', 'MNS EN 12004 (C1T)', 'Герман / Казахстан',
  'porter', '1 палет (48 шуудай = 1.2тн) - Бонго эсвэл Портер тээвэрлэнэ.',
  true, false, true,
  false, true, 11
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'ADH-KNAUF-FLIESEN'), 'https://images.pexels.com/photos/11806477/pexels-photo-11806477.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'KNAUF Fliesen Плитаны хүчитгэсэн цавуу (25кг шуудай)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'ADH-KNAUF-FLIESEN') and url = 'https://images.pexels.com/photos/11806477/pexels-photo-11806477.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'ADH-KNAUF-FLIESEN'), 'https://images.pexels.com/photos/11806489/pexels-photo-11806489.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'KNAUF Fliesen Плитаны хүчитгэсэн цавуу (25кг шуудай)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'ADH-KNAUF-FLIESEN') and url = 'https://images.pexels.com/photos/11806489/pexels-photo-11806489.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ADH-KNAUF-FLIESEN'), 'Савалгаа', '25 кг цаасан шуудай', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ADH-KNAUF-FLIESEN') and name = 'Савалгаа');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ADH-KNAUF-FLIESEN'), 'Зарцуулалт', '2.5 - 4.0 кг/м² (шүдтэй шпателийн хэмжээнээс хамаарна)', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ADH-KNAUF-FLIESEN') and name = 'Зарцуулалт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ADH-KNAUF-FLIESEN'), 'Устай холих харьцаа', '25 кг-д 5.5 - 6.0 л цэвэр ус', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ADH-KNAUF-FLIESEN') and name = 'Устай холих харьцаа');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ADH-KNAUF-FLIESEN'), 'Бэхжих хугацаа', '24 цагийн дараа гишгэж, заадас матах', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ADH-KNAUF-FLIESEN') and name = 'Бэхжих хугацаа');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ADH-KNAUF-FLIESEN'), 1, 16500) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ADH-KNAUF-FLIESEN'), 48, 15200) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ADH-KNAUF-FLIESEN'), 150, 14400) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ADH-KNAUF-FLIESEN'), 400, 13500) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ADH-KNAUF-FLIESEN'), (select id from warehouses where code = 'wh-main'), 3200) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ADH-KNAUF-FLIESEN'), (select id from warehouses where code = 'wh-gurvaljin'), 1100) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ADH-KNAUF-FLIESEN'), (select id from warehouses where code = 'wh-44'), 780) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- ELC-SCH-IC60N-16A — Schneider Acti9 iC60N Автомат таслуур 1P 16A 6kA (C-муруй)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'ELC-SCH-IC60N-16A', '3606480439765', 'schneider-acti9-ic60n-avtomat-tasluur-1p-16a-6ka-c-murui', 'Schneider Acti9 iC60N Автомат таслуур 1P 16A 6kA (C-муруй)', 'Шнайдер Электрик Франц Автомат таслуур 16А',
  (select id from categories where slug = 'electrical-lighting'), 'Автомат таслуур (ABB, Schneider)', (select id from brands where name = 'Schneider Electric' limit 1),
  19500, 22000, 'ширхэг', 0.125, 0.0005,
  'Францын Schneider Electric брэндийн цахилгааны хэт ачаалал ба богино залгаанаас хамгаалах өндөр найдвартай автомат таслуур.', 'VisiSafe болон VisiTrip технологитой, гэмтэл гарсан үед механик заагч нь улаан өнгөөр тодорч хурдан оношлох боломжтой.', 'MNS IEC 60898-1, CE', 'Франц / Болгар',
  'any', 'Суудлын тэрэг эсвэл шуудан хүргэлтээр очих боломжтой.',
  true, true, true,
  false, true, 12
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'ELC-SCH-IC60N-16A'), 'https://images.pexels.com/photos/38171184/pexels-photo-38171184.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Schneider Acti9 iC60N Автомат таслуур 1P 16A 6kA (C-муруй)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'ELC-SCH-IC60N-16A') and url = 'https://images.pexels.com/photos/38171184/pexels-photo-38171184.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'ELC-SCH-IC60N-16A'), 'https://images.pexels.com/photos/28950842/pexels-photo-28950842.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Schneider Acti9 iC60N Автомат таслуур 1P 16A 6kA (C-муруй)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'ELC-SCH-IC60N-16A') and url = 'https://images.pexels.com/photos/28950842/pexels-photo-28950842.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ELC-SCH-IC60N-16A'), 'Нэрлэсэн гүйдэл', '16 Ампер', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ELC-SCH-IC60N-16A') and name = 'Нэрлэсэн гүйдэл');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ELC-SCH-IC60N-16A'), 'Полюсын тоо', '1 Полюс (1P)', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ELC-SCH-IC60N-16A') and name = 'Полюсын тоо');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ELC-SCH-IC60N-16A'), 'Таслах чадвар', '6 кА (EN/IEC 60898-1)', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ELC-SCH-IC60N-16A') and name = 'Таслах чадвар');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ELC-SCH-IC60N-16A'), 'Ажиллагааны муруй', 'C-тип', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ELC-SCH-IC60N-16A') and name = 'Ажиллагааны муруй');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ELC-SCH-IC60N-16A'), 1, 19500) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ELC-SCH-IC60N-16A'), 12, 18200) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ELC-SCH-IC60N-16A'), 60, 17000) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ELC-SCH-IC60N-16A'), (select id from warehouses where code = 'wh-main'), 1540) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ELC-SCH-IC60N-16A'), (select id from warehouses where code = 'wh-gurvaljin'), 620) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- TLS-DEW-DWE4120 — DeWalt DWE4120 Булангийн таслагч Болгарк (125мм, 900W)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'TLS-DEW-DWE4120', '5035048534014', 'dewalt-dwe4120-bulangiin-taslagch-bolgark-125mm-900w', 'DeWalt DWE4120 Булангийн таслагч Болгарк (125мм, 900W)', 'ДеВолт Хүнд даацын 125мм булангийн зүлгүүр, таслагч',
  (select id from categories where slug = 'tools-hardware'), 'Цахилгаан гар багаж', (select id from brands where name = 'DeWalt (АНУ)' limit 1),
  345000, 380000, 'ширхэг', 2.05, 0.008,
  'Металл ба чулуу зүсэх, өнгөлөхөд зориулсан тоосны хамгаалалттай мотортой, авсаархан хөнгөн загвартай мэргэжлийн багаж.', 'Моторын хөргөлтийн шинэчлэгдсэн системтэй тул урт хугацаанд тасралтгүй ачаалалтай ажиллахад халахгүй.', 'ISO 9001, CE', 'АНУ / Мексик',
  'any', 'Шуурхай хүргэлтээр 2-4 цагт хүргэгдэнэ.',
  true, false, true,
  false, true, 13
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'TLS-DEW-DWE4120'), 'https://images.pexels.com/photos/4641061/pexels-photo-4641061.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'DeWalt DWE4120 Булангийн таслагч Болгарк (125мм, 900W)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'TLS-DEW-DWE4120') and url = 'https://images.pexels.com/photos/4641061/pexels-photo-4641061.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'TLS-DEW-DWE4120'), 'https://images.pexels.com/photos/3997251/pexels-photo-3997251.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'DeWalt DWE4120 Булангийн таслагч Болгарк (125мм, 900W)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'TLS-DEW-DWE4120') and url = 'https://images.pexels.com/photos/3997251/pexels-photo-3997251.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'TLS-DEW-DWE4120'), 'Чадал', '900 Ватт', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'TLS-DEW-DWE4120') and name = 'Чадал');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'TLS-DEW-DWE4120'), 'Дискийн диаметр', '125 мм', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'TLS-DEW-DWE4120') and name = 'Дискийн диаметр');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'TLS-DEW-DWE4120'), 'Эргэлтийн хурд', '11,800 эрг/мин', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'TLS-DEW-DWE4120') and name = 'Эргэлтийн хурд');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'TLS-DEW-DWE4120'), 'Голын эрээс', 'M14', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'TLS-DEW-DWE4120') and name = 'Голын эрээс');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'TLS-DEW-DWE4120'), 1, 345000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'TLS-DEW-DWE4120'), 3, 325000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'TLS-DEW-DWE4120'), 10, 305000) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'TLS-DEW-DWE4120'), (select id from warehouses where code = 'wh-main'), 85) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'TLS-DEW-DWE4120'), (select id from warehouses where code = 'wh-gurvaljin'), 32) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- PLB-WILO-YONOS25 — Wilo-Yonos PICO 25/1-6 Цусны эргэлтийн ухаалаг насос
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'PLB-WILO-YONOS25', '4048482490123', 'wilo-yonos-pico-25-1-6-tsusny-ergeltiin-uhaalag-nasos', 'Wilo-Yonos PICO 25/1-6 Цусны эргэлтийн ухаалаг насос', 'Вило Герман Эрчим хүчний хэмнэлттэй халаалтын насос',
  (select id from categories where slug = 'plumbing-hvac'), 'Усны насос ба даралт тохируулагч', (select id from brands where name = 'Wilo SE (Герман)' limit 1),
  620000, 670000, 'ширхэг', 2.15, 0.009,
  'Хувийн сууц, барилгын халаалтын системд 90% хүртэл цахилгаан эрчим хүч хэмнэдэг ECM технологийн өндөр үр ашигтай насос.', 'LED дэлгэц дээр бодит цахилгаан зарцуулалт (Ватт)-ыг шууд харуулдаг, агааргүйжүүлэх автомат горимтой.', 'MNS EN 16297, CE', 'Герман / Франц',
  'any', 'Шуурхай хүргэлтээр очих боломжтой.',
  true, true, false,
  false, true, 14
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'PLB-WILO-YONOS25'), 'https://images.pexels.com/photos/7937300/pexels-photo-7937300.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Wilo-Yonos PICO 25/1-6 Цусны эргэлтийн ухаалаг насос', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'PLB-WILO-YONOS25') and url = 'https://images.pexels.com/photos/7937300/pexels-photo-7937300.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'PLB-WILO-YONOS25'), 'https://images.pexels.com/photos/7859953/pexels-photo-7859953.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Wilo-Yonos PICO 25/1-6 Цусны эргэлтийн ухаалаг насос', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'PLB-WILO-YONOS25') and url = 'https://images.pexels.com/photos/7859953/pexels-photo-7859953.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-WILO-YONOS25'), 'Хамгийн их өргөлт (H)', '6 метр', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-WILO-YONOS25') and name = 'Хамгийн их өргөлт (H)');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-WILO-YONOS25'), 'Хамгийн их урсгал (Q)', '3.7 м³/цаг', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-WILO-YONOS25') and name = 'Хамгийн их урсгал (Q)');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-WILO-YONOS25'), 'Холболтын диаметр', 'G 1½" (DN 25)', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-WILO-YONOS25') and name = 'Холболтын диаметр');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-WILO-YONOS25'), 'Цахилгаан чадал', '4 - 40 Ватт', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-WILO-YONOS25') and name = 'Цахилгаан чадал');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PLB-WILO-YONOS25'), 1, 620000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PLB-WILO-YONOS25'), 3, 590000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PLB-WILO-YONOS25'), 10, 550000) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'PLB-WILO-YONOS25'), (select id from warehouses where code = 'wh-main'), 62) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'PLB-WILO-YONOS25'), (select id from warehouses where code = 'wh-gurvaljin'), 24) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- INS-BAS-RW50 — Монгол Базальт Дулаан ба дуу тусгаарлагч чулуун хөвөн (50мм, 100кг/м³)
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'INS-BAS-RW50', '8650016050012', 'mongol-bazalt-dulaan-ba-duu-tusgaarlagch-chuluun-hovon-50mm-100kg-m', 'Монгол Базальт Дулаан ба дуу тусгаарлагч чулуун хөвөн (50мм, 100кг/м³)', 'Монгол Базальт Фасад ба дээврийн өндөр нягттай хавтан',
  (select id from categories where slug = 'insulation-roof'), 'Базальт эрдэс хөвөн', (select id from brands where name = 'Монгол Базальт ХК' limit 1),
  49000, 53000, 'боодол', 18, 0.18,
  'Монгол орны байгалийн базальт чулуугаар хийсэн 1000°C халуунд шатдаггүй, 50 жилийн насжилттай үндэсний шилдэг дулаалга.', 'Өндөр нягттай (100 кг/м³) тул агааржуулалттай фасад, нойтон фасад болон үйлдвэрийн дээвэрт суулт өгөхгүй бат бөх тогтоно.', 'MNS EN 13162:2011', 'Монгол',
  'porter', 'Портер, Бонго эсвэл 5тн ачааны тэрэг тохиромжтой.',
  true, false, true,
  false, true, 15
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'INS-BAS-RW50'), 'https://images.pexels.com/photos/36574965/pexels-photo-36574965.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Монгол Базальт Дулаан ба дуу тусгаарлагч чулуун хөвөн (50мм, 100кг/м³)', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'INS-BAS-RW50') and url = 'https://images.pexels.com/photos/36574965/pexels-photo-36574965.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'INS-BAS-RW50'), 'https://images.pexels.com/photos/38749883/pexels-photo-38749883.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Монгол Базальт Дулаан ба дуу тусгаарлагч чулуун хөвөн (50мм, 100кг/м³)', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'INS-BAS-RW50') and url = 'https://images.pexels.com/photos/38749883/pexels-photo-38749883.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'INS-BAS-RW50'), 'Зузаан', '50 мм', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'INS-BAS-RW50') and name = 'Зузаан');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'INS-BAS-RW50'), 'Боодлын талбай', '3.6 м² (6 хавтан: 1000 x 600 мм)', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'INS-BAS-RW50') and name = 'Боодлын талбай');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'INS-BAS-RW50'), 'Нягт', '100 кг/м³', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'INS-BAS-RW50') and name = 'Нягт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'INS-BAS-RW50'), 'Дулаан дамжуулалт', '0.036 Вт/(м·K)', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'INS-BAS-RW50') and name = 'Дулаан дамжуулалт');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'INS-BAS-RW50'), 1, 49000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'INS-BAS-RW50'), 30, 46000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'INS-BAS-RW50'), 100, 43500) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'INS-BAS-RW50'), (select id from warehouses where code = 'wh-main'), 1400) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'INS-BAS-RW50'), (select id from warehouses where code = 'wh-gurvaljin'), 450) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- PLB-VAL-BALL-12 — Valtec VT.217 Бөмбөлгөг хаалт 1/2" эр/эм эрвээхэй бариултай
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'PLB-VAL-BALL-12', '8033675001204', 'valtec-vt-217-bombolgog-haalt-1-2-er-em-erveehei-bariultai', 'Valtec VT.217 Бөмбөлгөг хаалт 1/2" эр/эм эрвээхэй бариултай', 'Валтек Итали стандартын гуулин хаалт 1/2 дюйм',
  (select id from categories where slug = 'plumbing-hvac'), 'PPR хуванцар ба төмөр хоолой', (select id from brands where name = 'Valtec (Итали)' limit 1),
  14500, 16000, 'ширхэг', 0.19, 0.0003,
  'Халуун хүйтэн ус, халаалт, хийн шугам хоолойд зориулагдсан CW617N маркийн никель бүрсэн гуулин их биетэй хаалт.', '50,000 удаагийн нээж хаах цикл тэсвэрлэх чадвартай, 40 бар хүртэл даралтад найдвартай ажиллана.', 'EN 13828, GOST', 'Итали',
  'any', 'Шуурхай такси эсвэл шуудангаар хүргэгдэнэ.',
  true, false, false,
  false, true, 16
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'PLB-VAL-BALL-12'), 'https://images.pexels.com/photos/28178448/pexels-photo-28178448.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Valtec VT.217 Бөмбөлгөг хаалт 1/2" эр/эм эрвээхэй бариултай', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'PLB-VAL-BALL-12') and url = 'https://images.pexels.com/photos/28178448/pexels-photo-28178448.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'PLB-VAL-BALL-12'), 'https://images.pexels.com/photos/13726337/pexels-photo-13726337.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Valtec VT.217 Бөмбөлгөг хаалт 1/2" эр/эм эрвээхэй бариултай', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'PLB-VAL-BALL-12') and url = 'https://images.pexels.com/photos/13726337/pexels-photo-13726337.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-VAL-BALL-12'), 'Холболтын диаметр', '1/2" (Ду 15)', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-VAL-BALL-12') and name = 'Холболтын диаметр');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-VAL-BALL-12'), 'Нэрлэсэн даралт', 'PN 40 бар', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-VAL-BALL-12') and name = 'Нэрлэсэн даралт');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-VAL-BALL-12'), 'Ажлын температур', '-30°C -аас +150°C', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-VAL-BALL-12') and name = 'Ажлын температур');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'PLB-VAL-BALL-12'), 'Материал', 'Хүчитгэсэн гууль CW617N', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'PLB-VAL-BALL-12') and name = 'Материал');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PLB-VAL-BALL-12'), 1, 14500) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PLB-VAL-BALL-12'), 20, 13500) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'PLB-VAL-BALL-12'), 100, 12500) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'PLB-VAL-BALL-12'), (select id from warehouses where code = 'wh-main'), 2400) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'PLB-VAL-BALL-12'), (select id from warehouses where code = 'wh-gurvaljin'), 950) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

-- ROF-TN-BIKRO — Технониколь Бикроэст ЭПП Ус тусгаарлагч хайлуулж наадаг хуйлмал дээвэр
insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  'ROF-TN-BIKRO', '4607077421190', 'tehnonikol-bikroest-epp-us-tusgaarlagch-hailuulj-naadag-huilmal-deever', 'Технониколь Бикроэст ЭПП Ус тусгаарлагч хайлуулж наадаг хуйлмал дээвэр', 'Технониколь ОХУ 4мм полиэстер суурьтай хуйлмал битум',
  (select id from categories where slug = 'insulation-roof'), 'Металл ба төмөр дээвэр', (select id from brands where name = 'Технониколь (TechnoNICOL)' limit 1),
  88000, 95000, 'боодол', 40, 0.04,
  'Барилгын хавтгай дээвэр, суурийн гидро дулаалгад зориулагдсан өндөр уян хатан полиэстер суурьтай 10м² хуйлмал битум.', 'Монголын -40°C өвлийн хүйтэнд хэврэгшихгүй, өндөр барьцалдах чадвартай.', 'MNS EN 13707', 'ОХУ',
  'porter', '1 палет (25 боодол = 1тн) Портер эсвэл Бонго тээвэрлэнэ.',
  true, true, false,
  false, true, 17
) on conflict (sku) do nothing;
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'ROF-TN-BIKRO'), 'https://images.pexels.com/photos/38781401/pexels-photo-38781401.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Технониколь Бикроэст ЭПП Ус тусгаарлагч хайлуулж наадаг хуйлмал дээвэр', 0 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'ROF-TN-BIKRO') and url = 'https://images.pexels.com/photos/38781401/pexels-photo-38781401.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_images (product_id, url, alt, sort_order) select (select id from products where sku = 'ROF-TN-BIKRO'), 'https://images.pexels.com/photos/39238331/pexels-photo-39238331.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop', 'Технониколь Бикроэст ЭПП Ус тусгаарлагч хайлуулж наадаг хуйлмал дээвэр', 1 where not exists (select 1 from product_images where product_id = (select id from products where sku = 'ROF-TN-BIKRO') and url = 'https://images.pexels.com/photos/39238331/pexels-photo-39238331.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ROF-TN-BIKRO'), 'Боодлын урт x өргөн', '10 x 1 метр (10 м²)', 0 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ROF-TN-BIKRO') and name = 'Боодлын урт x өргөн');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ROF-TN-BIKRO'), 'Зузаан / Жин', '4.0 кг/м² (нийт 40 кг)', 1 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ROF-TN-BIKRO') and name = 'Зузаан / Жин');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ROF-TN-BIKRO'), 'Суурь', 'Полиэфир (Суналт ≥ 50%)', 2 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ROF-TN-BIKRO') and name = 'Суурь');
insert into product_specs (product_id, name, value, sort_order) select (select id from products where sku = 'ROF-TN-BIKRO'), 'Уян хатан чанар', '-15°C', 3 where not exists (select 1 from product_specs where product_id = (select id from products where sku = 'ROF-TN-BIKRO') and name = 'Уян хатан чанар');
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ROF-TN-BIKRO'), 1, 88000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ROF-TN-BIKRO'), 25, 83000) on conflict (product_id, min_qty) do nothing;
insert into bulk_price_tiers (product_id, min_qty, price) values ((select id from products where sku = 'ROF-TN-BIKRO'), 100, 78000) on conflict (product_id, min_qty) do nothing;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ROF-TN-BIKRO'), (select id from warehouses where code = 'wh-main'), 1100) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;
insert into product_stock (product_id, warehouse_id, qty) values ((select id from products where sku = 'ROF-TN-BIKRO'), (select id from warehouses where code = 'wh-gurvaljin'), 320) on conflict (product_id, warehouse_id) do update set qty = excluded.qty;

commit;
