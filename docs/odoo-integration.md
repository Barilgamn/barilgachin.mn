# Odoo ERP интеграцийн шийдэл

Баримт бичгийн хамрах хүрээ: barilgachin.mn дэлгүүр ↔ Odoo ERP хооронд
**барааны мэдээлэл, үлдэгдэл, захиалга, төлбөр** солилцох архитектур, дуудлагууд,
өгөгдлийн зураглал ба хэрэгжүүлэх дараалал.

---

## 0. Батлагдсан баримтууд

Эдгээрийг таамаглаагүй, шууд шалгаж тогтоосон:

| Зүйл | Утга |
| --- | --- |
| Odoo хувилбар | **18.0 Enterprise** (`18.0+e-20260817`) |
| `/jsonrpc` төгсгөл | Гаднаас нээлттэй, ажиллаж байна (HTTP 200) |
| Суусан модулиуд | `website_sale` (/shop), `website_blog` (/blog), Helpdesk |
| Суугаагүй | `website_event` (/event → 404) |
| Нийтэлсэн бараа | 630 ш, 39 ангилал |

**Анхаар:** `/jsonrpc` ба `/xmlrpc/2` нь Odoo 22 (2028 намар) болон Online 21.1
(2027 өвөл) дээр **устгагдана**. Орлуулагч нь External JSON-2 API боловч тэр нь
Odoo 19-ээс эхэлдэг тул танайд одоохондоо байхгүй. Тиймээс `/jsonrpc`-ээр эхлэх нь
зөв, гэхдээ транспортыг **нэг файлд тусгаарлаж** бичнэ — хожим JSON-2 руу шилжихэд
зөвхөн тэр файл өөрчлөгдөнө.

---

## 1. Архитектур: яагаад завсрын сервер заавал хэрэгтэй вэ

Одоогийн апп нь **цэвэр Vite SPA** — сервер тал байхгүй. Odoo руу шууд хандаж
болохгүй гурван шалтгаан:

1. **Нэвтрэх мэдээлэл задарна.** API key browser-ийн JS дотор орвол хэн ч
   DevTools-оор аваад танай ERP-д бүрэн эрхээр хандана.
2. **CORS.** Odoo `/jsonrpc` нь өөр домэйноос ирэх хөтчийн хүсэлтэд
   `Access-Control-Allow-Origin` буцаадаггүй.
3. **Үнэ хуурамчлах.** Browser-ээс ирсэн үнэ, дүнд итгэж болохгүй.

Тиймээс дараах бүтэц:

```
Хөтөч (Vite SPA)
   │  fetch /api/...        ← зөвхөн өөрийн домэйн, API key байхгүй
   ▼
BFF сервер (Node/Express)   ← ODOO_API_KEY энд, орчны хувьсагчаар
   │  POST /jsonrpc
   ▼
Odoo 18 Enterprise
```

Төсөлд `express`, `dotenv`, `tsx` аль хэдийн dependency-д байгаа тул нэмэлт
хамаарал шаардлагагүй. Vercel/Netlify дээр байршуулах бол ижил кодыг
serverless function болгож болно.

> Гурав дахь хувилбар — Odoo дээр custom REST модуль бичих. Илүү цэвэр боловч
> Odoo талд хөгжүүлэлт, deploy шаардана. Эхлэхдээ BFF нь хамаагүй хурдан.

---

## 2. Odoo талын бэлтгэл

### 2.1 API хэрэглэгч

Админ хэрэглэгчийн key ашиглаж **болохгүй**. Тусад нь үүсгэнэ:

- Хэрэглэгч: `api@barilgachin.mn` (Portal биш, Internal User)
- Эрх: доорх хүснэгтээр, шаардлагатай хамгийн бага хэмжээгээр

| Үйлдэл | Шаардагдах эрх |
| --- | --- |
| Бараа, ангилал унших | Sales / User эсвэл Inventory / User |
| Үлдэгдэл унших | Inventory / User |
| Үнийн жагсаалт унших | Sales / User + Pricelists тохиргоо асаалттай |
| Захиалга үүсгэх | Sales / User: Own Documents Only болон илүү |
| Нэхэмжлэх, төлбөр | Accounting / Billing |

### 2.2 API key

Settings → Users & Companies → Users → тухайн хэрэглэгч → **Account Security**
таб → New API Key. Odoo 14-өөс хойш key нь **нууц үгийг орлоно**, харин login
(хэрэглэгчийн нэр) хэвээрээ хэрэглэгдэнэ.

Key-г зөвхөн серверийн орчны хувьсагчид хадгална:

```
ODOO_URL=https://barilgachin.mn
ODOO_DB=<өгөгдлийн сангийн нэр>
ODOO_USERNAME=api@barilgachin.mn
ODOO_API_KEY=<key>
```

---

## 3. Дуудлагын дүрэм

### 3.1 Нэвтрэлт

```
POST /jsonrpc
{"jsonrpc":"2.0","method":"call","id":1,
 "params":{"service":"common","method":"authenticate",
           "args":[db, username, api_key, {}]}}
→ result: uid (тоо) эсвэл false
```

`uid`-г процессын хугацаанд кэшлэнэ. Алдаа гарвал кэшийг цэвэрлээд дахин авна.

### 3.2 Модел дээрх дуудлага

```
POST /jsonrpc
{"jsonrpc":"2.0","method":"call","id":2,
 "params":{"service":"object","method":"execute_kw",
           "args":[db, uid, api_key, model, method, args, kwargs]}}
```

Аргументийн дараалал чухал: `args` нь жагсаалт (домэйн, id-ууд), `kwargs` нь
`fields`, `limit`, `offset`, `order`, `context`.

### 3.3 Хоёр чухал хязгаарлалт

1. **`_` -ээр эхэлсэн метод дуудагдахгүй.** Odoo хувийн методуудыг RPC-ээр
   хориглодог. Тиймээс `_get_products_price` гэх мэт үнэ бодох дотоод функцийг
   шууд дуудах боломжгүй — 6-р хэсгийг үзнэ үү.
2. **Record rules үйлчилнэ.** API хэрэглэгчийн эрхээс гадуурх бичлэг
   шүүгдэхгүй, харин алдаа шиднэ.

---

## 4. Барааны мэдээлэл

### 4.1 Уншилт

```
model:  product.template
method: search_read
args:   [[["sale_ok","=",true],["is_published","=",true]]]
kwargs: {
  "fields": ["name","default_code","barcode","list_price","standard_price",
             "uom_id","weight","volume","categ_id","public_categ_ids",
             "description_sale","qty_available","virtual_available",
             "product_tag_ids","write_date"],
  "limit": 100, "offset": 0, "order": "id asc"
}
```

Зураг нь **RPC-ээр биш**, шууд URL-аар ачаална (нийтэлсэн бараанд нээлттэй):

```
https://barilgachin.mn/web/image/product.template/{id}/image_1024
```

Нэмэлт зурган цомог хэрэгтэй бол `product.image` моделийг `product_tmpl_id`-аар
шүүнэ.

### 4.2 Ангилал

Дэлгүүрт **`public_categ_ids`** (вэбсайтын ангилал) хэрэглэнэ, `categ_id`
(нягтлан бодох дотоод ангилал) биш. Уншихдаа `product.public.category` моделээс
`name`, `parent_id`, `sequence`.

> Танай одоогийн ангиллын мод дээр засах зүйл бий: дээд түвшний нэрс буруу
> (`Халаагуур` дотор Дулаалга, Дээвэр байна), `Халаагуур` хоёр удаа давхардсан,
> `Тест дэд ангилал` нийтлэгдсэн хэвээр. Интеграц эхлэхээс өмнө Odoo дээр
> цэгцлэх нь хамгийн хямд.

### 4.3 Өөрчлөлтийг мөрдөх (нэмэлт синк)

Бүх 630 барааг байнга татахгүйн тулд `write_date`-ээр шүүнэ:

```
[["sale_ok","=",true],["is_published","=",true],
 ["write_date",">",<сүүлийн синкийн UTC хугацаа>]]
```

Устсан/нийтлэлтээс хассан барааг олохын тулд тогтмол хугацаанд бүх `id`-г
`search` хийж, локал жагсаалттай харьцуулна.

---

## 5. Үлдэгдэл

### 5.1 Нийт үлдэгдэл

`qty_available` (гарт байгаа) ба `virtual_available` (ирэх нөөцийг оруулсан).
Дэлгүүрт **`virtual_available`** илүү зөв — захиалсан барааг давхар зарахгүй.

### 5.2 Салбар агуулах тус бүрээр

Танай UI 4 салбарын үлдэгдэл харуулдаг. Хоёр арга:

**А. Context-оор (энгийн).** Агуулах бүрт нэг дуудлага:

```
kwargs: {"fields":["qty_available"], "context":{"warehouse": <warehouse_id>}}
```

**Б. `stock.quant`-аар (нэг дуудлагаар бүгд).** Байршлаар бүлэглэнэ:

```
model:  stock.quant
method: read_group
args:   [[["product_id","in",[...]],["location_id.usage","=","internal"]],
         ["quantity","reserved_quantity"],
         ["product_id","location_id"]]
kwargs: {"lazy": false}
```

Боломжит үлдэгдэл = `quantity - reserved_quantity`. Олон бараа зэрэг авахад
Б хувилбар хамаагүй хэмнэлттэй.

Агуулахуудын жагсаалтыг `stock.warehouse`-оос (`name`, `code`, `lot_stock_id`,
`partner_id`) уншиж, UI дэх `StockLocation.address`-ыг `partner_id`-аас авна.

### 5.3 Кэшлэлт

Үлдэгдэл хурдан өөрчлөгддөг. Каталогийн кэштэй **хамт хадгалахгүй**:

| Өгөгдөл | TTL |
| --- | --- |
| Бараа, ангилал | 10–30 мин |
| Үлдэгдэл (жагсаалтын хуудсанд) | 60 сек |
| Үлдэгдэл (сагсанд нэмэх, checkout) | кэшгүй, шууд |

---

## 6. Үнэ ба бөөний хямдрал

Энэ хэсэг хамгийн нарийн. Танай UI `bulkTiers` (тоо ширхэгээс хамаарсан үнэ),
`originalPrice` (дарсан үнэ), хямдралын хувь харуулдаг. Odoo дээр эдгээр нь
**pricelist** дээр тохирдог.

### 6.1 Дүрмийг унших (харуулахад)

```
model:  product.pricelist.item
method: search_read
args:   [[["pricelist_id","=",<id>]]]
kwargs: {"fields":["applied_on","product_tmpl_id","product_id","categ_id",
                   "min_quantity","compute_price","fixed_price",
                   "percent_price","price_discount","price_surcharge",
                   "date_start","date_end"]}
```

Эдгээр дүрмийг BFF дотор бодож, "10-аас дээш авбал X₮" гэсэн шатуудыг харуулна.

### 6.2 Эцсийн үнэ (төлбөр тооцоход)

**Харуулсан үнээр төлбөр бодож болохгүй.** Хөтчөөс ирсэн үнэд итгэхгүй, мөн
BFF-ийн бодолт Odoo-гийнхтэй зөрж болзошгүй. Checkout дээр:

1. `sale.order`-ыг **draft** төлөвт үүсгэнэ (мөр бүр бараа + тоо ширхэг).
2. Odoo өөрөө pricelist-ийн дагуу `price_unit`, `amount_total`-ыг тооцно.
3. Тэр дүнг буцааж уншаад хэрэглэгчид баталгаажуулуулна.
4. Зөвшөөрсний дараа л төлбөрт оруулна.

Ингэснээр үнэ үргэлж ERP-ийн эрх мэдэлд байна.

### 6.3 Хэрэглэгч тус бүрийн үнэ

B2B харилцагчид өөр pricelist-тэй байж болно. Тухайн `res.partner`-ийн
`property_product_pricelist`-ийг уншаад тэр дүрмээр тооцно. **Ийм үнийг
хэрэглэгч хооронд кэшлэхгүй.**

---

## 7. Захиалга

### 7.1 Харилцагч

```
res.partner: search_read [["phone","=",<утас>]] эсвэл [["vat","=",<регистр>]]
олдохгүй бол → create {name, phone, email, street, vat, company_type}
```

Регистрийн дугаараар НӨАТ-ын нэхэмжлэх шаардсан бол `vat` талбарыг заавал бөглөнө.

### 7.2 Захиалга үүсгэх

```
model:  sale.order
method: create
args:   [{
  "partner_id": <id>,
  "client_order_ref": "<дэлгүүрийн захиалгын дугаар>",
  "order_line": [
    [0, 0, {"product_id": <product.product id>, "product_uom_qty": 10}],
    [0, 0, {"product_id": <id>, "product_uom_qty": 2}]
  ]
}]
```

**Анхаар:** `order_line`-д `product.product` (хувилбар) id хэрэгтэй,
`product.template` биш. Хувилбаргүй бараанд `product_variant_id`-г урьдчилж уншиж
авна.

`price_unit`-ыг **бүү дамжуул** — Odoo pricelist-ээр өөрөө бодог.

### 7.3 Баталгаажуулах

```
sale.order → action_confirm [[order_id]]
```

Энэ нь `stock.picking` (хүргэлтийн баримт) автоматаар үүсгэнэ. Хянахдаа:

```
stock.picking: search_read [["sale_id","=",<id>]]
fields: ["name","state","scheduled_date","carrier_tracking_ref"]
```

`state`: `draft → waiting → confirmed → assigned → done`. Танай UI-ийн
`preparing / on_delivery / completed` төлөвийг эндээс зураглана.

### 7.4 Үнийн санал (RFQ)

Танай `RFQRequest` нь Odoo дээр **draft `sale.order`** буюу үнийн санал. Тусад нь
модель хэрэггүй. CRM хэрэглэдэг бол зэрэгцээд `crm.lead` үүсгэж болно.

---

## 8. Төлбөр

### 8.1 Гол зарчим

QPay, SocialPay, StorePay, Хаан банк — эдгээрийн **аль нь ч Odoo-гийн native
payment provider биш**. Тиймээс төлбөрийг BFF өөрөө гүйцэтгээд, үр дүнг Odoo руу
бичнэ.

### 8.2 Урсгал

```
1. BFF → Odoo: sale.order үүсгэнэ (draft), дүнг Odoo-гоос уншина
2. BFF → Gateway: тэр дүнгээр нэхэмжлэх үүсгэнэ (QPay invoice гэх мэт)
3. Хэрэглэгч төлнө
4. Gateway → BFF webhook: төлөгдсөн баталгаа
5. BFF → Odoo: action_confirm → нэхэмжлэх үүсгэх → account.payment бүртгэх
```

**Хөтчөөс ирсэн "төлсөн" гэсэн дохиогоор захиалгыг баталгаажуулж болохгүй.**
Зөвхөн gateway-ийн webhook (гарын үсэг шалгасны дараа) итгэл хүлээнэ.

### 8.3 Odoo дээр төлбөр бүртгэх

```
sale.order → _create_invoices  ← хувийн метод, RPC-ээр дуудагдахгүй!
```

Оронд нь:

```
model: sale.advance.payment.inv   (wizard)
create {"advance_payment_method": "delivered"}
→ create_invoices [[wizard_id]]   (context: {"active_ids":[order_id],
                                             "active_model":"sale.order"})
```

Дараа нь нэхэмжлэхийг батлаад төлбөр бүртгэнэ:

```
account.move  → action_post [[move_id]]
account.payment → create {"payment_type":"inbound",
                          "partner_id": <id>,
                          "amount": <дүн>,
                          "journal_id": <банкны журнал>,
                          "ref": "<gateway гүйлгээний дугаар>"}
                → action_post
```

Нэхэмжлэхтэй тулгах (reconcile) нь нягтлан бодогчийн журмаас хамаарна —
эхний ээлжинд `ref`-д gateway-ийн дугаарыг бичээд гараар тулгах нь хангалттай.

### 8.4 Давхардлаас сэргийлэх

Webhook дахин ирж болно. `client_order_ref` эсвэл gateway-ийн гүйлгээний
дугаараар Odoo-гоос эхлээд хайж, аль хэдийн бүртгэгдсэн эсэхийг шалгана.

### 8.5 Зээлээр (`invoice_odoo`)

B2B харилцагчид шууд төлдөггүй. Энэ тохиолдолд: захиалгыг баталгаажуулаад
нэхэмжлэх үүсгэнэ, төлбөрийг бүртгэхгүй. Odoo дээр авлага болж үлдэнэ.

---

## 9. Өгөгдлийн зураглал ба цоорхой

`src/types/index.ts` дэх `Product`-ыг Odoo-той тулгав:

| UI талбар | Odoo эх сурвалж | Төлөв |
| --- | --- | --- |
| `sku` | `product.template.default_code` | ✅ Бэлэн |
| `barcode` | `barcode` | ✅ |
| `name`, `description` | `name`, `description_sale` | ✅ |
| `price` | `list_price` + pricelist | ✅ |
| `uom` | `uom_id` | ✅ |
| `weightKg`, `volumeM3` | `weight`, `volume` | ✅ (бөглөгдсөн эсэхийг шалгах) |
| `category` | `public_categ_ids` | ⚠️ Ангиллын мод цэгцлэх шаардлагатай |
| `totalStock` | `virtual_available` | ✅ |
| `stockLocations` | `stock.quant` байршлаар | ✅ |
| `bulkTiers` | `product.pricelist.item` | ⚠️ Pricelist тохируулах шаардлагатай |
| `originalPrice` | pricelist-ийн өмнөх үнэ | ⚠️ Мөн адил |
| `images` | `/web/image/...`, `product.image` | ✅ |
| `brand` | — | ❌ **Талбар байхгүй** |
| `isMNSCertified`, `mnsStandard` | — | ❌ **Талбар байхгүй** |
| `techSpecs` | attributes эсвэл custom | ❌ Тохируулах шаардлагатай |
| `rating`, `reviewCount` | `rating.rating` | ❌ Идэвхгүй бол өгөгдөл байхгүй |
| `vehicleRequirement` | — | ❌ Жингээс тооцох эсвэл custom |
| `isFeatured`, `isBestseller` | `website_ribbon_id` эсвэл tag | ⚠️ |

### Санал: `product.tag` ашиглах

Odoo 17-оос `product.tag` модель нэмэгдсэн. **Brand, MNS, Онцлох, Шинэ ирсэн**
зэргийг тус бүрд нь custom талбар нэмэхийн оронд шошгоор шийдэж болно —
Odoo дээр код бичихгүйгээр, зүгээр тохиргоогоор.

Хэрэв брэндийг шүүлтүүрт бүрэн ашиглах бол `product.template` дээр
`product_brand_id` (many2one) custom талбар нэмэх нь илүү цэгцтэй. Энэ нь Odoo
талд жижиг модуль шаардана.

---

## 10. Хэрэгжүүлэх дараалал

| Үе | Ажил | Үр дүн |
| --- | --- | --- |
| 1 | BFF суурь + JSON-RPC client + health check | Холболт батлагдана |
| 2 | Бараа, ангилал уншиж `mockData.ts`-ийг солих | Жинхэнэ 630 бараа |
| 3 | Үлдэгдэл (нийт + салбараар) | Бодит нөөц |
| 4 | Pricelist, бөөний шат | Бодит үнэ |
| 5 | Draft `sale.order` + RFQ | Захиалга Odoo руу очно |
| 6 | Төлбөрийн gateway + webhook + нэхэмжлэх | Бүрэн урсгал |
| 7 | `stock.picking`-ээр захиалга хянах | Хүргэлтийн төлөв |

1–3 үе дуусахад сайт бодит өгөгдлөөр ажиллана. 4-өөс цааш нь Odoo талд
тохиргоо (pricelist, шошго, ангилал) шаардана.

---

## 11. Аюулгүй байдлын шалгах хуудас

- [ ] `ODOO_API_KEY` зөвхөн серверийн орчинд, git-д хэзээ ч ороогүй
- [ ] API хэрэглэгч админ биш, эрх нь хамгийн бага
- [ ] BFF дээр дуудаж болох модель/методын **цагаан жагсаалт** — хөтөч дурын
      модель дуудах боломжгүй байх
- [ ] Хөтчөөс ирсэн үнэ, дүнг хэзээ ч ашиглахгүй — Odoo дахин тооцно
- [ ] Захиалгын тоо ширхэгийг сервер талд шалгах (сөрөг, хэт их)
- [ ] Gateway webhook-ийн гарын үсгийг шалгах
- [ ] Webhook давхардлаас хамгаалах (idempotency)
- [ ] CORS зөвхөн өөрийн домэйнд
- [ ] BFF дээр rate limit

---

## 12. Тодруулах шаардлагатай зүйлс

1. **Өгөгдлийн сангийн нэр** (`ODOO_DB`) — API key-тэй хамт хэрэгтэй.
2. **Pricelist ашигладаг эсэх** — бөөний үнэ одоо Odoo дээр хэрхэн хөтлөгддөг вэ?
3. **Салбар агуулахууд Odoo дээр `stock.warehouse` болж тохируулагдсан уу**,
   эсвэл нэг агуулахын дэд байршил уу?
4. **Брэнд, MNS-ийг** шошгоор шийдэх үү, эсвэл custom талбар нэмэх үү?
5. **Төлбөрийн gateway** — QPay эхэлж үү? Merchant данс бэлэн үү?
6. **НӨАТ-ын баримт** (ebarimt) хэн үүсгэх вэ — Odoo уу, gateway үү?
