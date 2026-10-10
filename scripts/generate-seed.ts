/**
 * mockData.ts → Supabase seed SQL.
 *
 * Нэг удаагийн хэрэгсэл: одоогийн статик каталогийг баазад оруулах SQL гаргана.
 * TS модулийг шууд импортолдог тул гараар хөрвүүлэхэд гардаг алдаа үүсэхгүй.
 *
 *   npx tsx scripts/generate-seed.ts > supabase/migrations/0003_seed.sql
 */
import { CATEGORIES, PRODUCTS, WAREHOUSES } from '../src/data/mockData';
import { CONSTRUCTION_BRANDS } from '../src/data/brandsData';
import { slugify, uniqueSlug } from '../src/lib/slug';

/** SQL-ийн мөрийн утга. null бол NULL. */
function q(v: string | number | boolean | null | undefined): string {
  if (v === null || v === undefined || v === '') return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return `'${v.replace(/'/g, "''")}'`;
}

const out: string[] = [];
const say = (s = '') => out.push(s);

say('-- barilgachin.mn — одоогийн каталогийг баазад оруулах.');
say('-- scripts/generate-seed.ts-ээр үүсгэсэн. Дахин ажиллуулахад давхардахгүй.');
say('');
say('begin;');
say('');

// ---------------------------------------------------------------- brands
say('-- брэнд');
for (const [i, b] of CONSTRUCTION_BRANDS.entries()) {
  say(
    `insert into brands (slug, name, short_code, country, sort_order) values (` +
      `${q(b.id)}, ${q(b.name)}, ${q(b.shortCode)}, ${q(b.tagline)}, ${i}) ` +
      `on conflict (slug) do nothing;`,
  );
}
say('');

// ---------------------------------------------------------------- warehouses
say('-- агуулах');
for (const [i, w] of WAREHOUSES.entries()) {
  say(
    `insert into warehouses (code, name, address, sort_order) values (` +
      `${q(w.branchId)}, ${q(w.branchName)}, ${q(w.address)}, ${i}) ` +
      `on conflict (code) do nothing;`,
  );
}
say('');

// ---------------------------------------------------------------- categories
say('-- ангилал');
for (const [i, c] of CATEGORIES.entries()) {
  say(
    `insert into categories (slug, name, description, icon_name, image_url, sort_order, is_published) values (` +
      `${q(c.slug)}, ${q(c.name)}, ${q(c.description)}, ${q(c.iconName)}, ${q(c.image)}, ${i}, true) ` +
      `on conflict (slug) do nothing;`,
  );
}
say('');

// ---------------------------------------------------------------- products
// mockData дээр product.category нь ангиллын id, харин зарим бараанд
// дэд ангиллын нэр бичигдсэн байна. Эхнийхийг slug-аар холбож, бусдыг
// NULL үлдээгээд subcategory талбарт нь хадгална.
const catById = new Map(CATEGORIES.map((c) => [c.id, c]));
const slugs: string[] = [];
let unmatched = 0;

say('-- бараа');
for (const [i, p] of PRODUCTS.entries()) {
  const cat = catById.get(p.category);
  if (!cat) unmatched += 1;

  const slug = uniqueSlug(slugify(p.name), slugs);
  slugs.push(slug);

  const catSelect = cat
    ? `(select id from categories where slug = ${q(cat.slug)})`
    : 'NULL';
  const brandSelect = `(select id from brands where name = ${q(p.brand)} limit 1)`;

  say(`-- ${p.sku} — ${p.name}`);
  say(
    `insert into products (
  sku, barcode, slug, name, mongolian_name, category_id, subcategory, brand_id,
  price, original_price, uom, weight_kg, volume_m3,
  description, full_description, mns_standard, origin_country,
  vehicle_requirement, vehicle_note,
  is_mns_certified, is_featured, is_bestseller, is_new_arrival, is_published, sort_order
) values (
  ${q(p.sku)}, ${q(p.barcode)}, ${q(slug)}, ${q(p.name)}, ${q(p.mongolianName)},
  ${catSelect}, ${q(cat ? p.subcategory : p.subcategory || p.category)}, ${brandSelect},
  ${q(p.price)}, ${q(p.originalPrice ?? null)}, ${q(p.uom)}, ${q(p.weightKg)}, ${q(p.volumeM3 ?? null)},
  ${q(p.description)}, ${q(p.fullDescription)}, ${q(p.mnsStandard ?? null)}, ${q(p.originCountry)},
  ${q(p.vehicleRequirement)}, ${q(p.vehicleRecommendationText)},
  ${q(p.isMNSCertified)}, ${q(Boolean(p.isFeatured))}, ${q(Boolean(p.isBestseller))},
  ${q(Boolean(p.isNewArrival))}, true, ${i}
) on conflict (sku) do nothing;`,
  );

  const pid = `(select id from products where sku = ${q(p.sku)})`;

  for (const [j, url] of p.images.entries()) {
    say(
      `insert into product_images (product_id, url, alt, sort_order) ` +
        `select ${pid}, ${q(url)}, ${q(p.name)}, ${j} ` +
        `where not exists (select 1 from product_images where product_id = ${pid} and url = ${q(url)});`,
    );
  }

  for (const [j, s] of p.techSpecs.entries()) {
    say(
      `insert into product_specs (product_id, name, value, sort_order) ` +
        `select ${pid}, ${q(s.name)}, ${q(s.value)}, ${j} ` +
        `where not exists (select 1 from product_specs where product_id = ${pid} and name = ${q(s.name)});`,
    );
  }

  for (const t of p.bulkTiers) {
    say(
      `insert into bulk_price_tiers (product_id, min_qty, price) ` +
        `values (${pid}, ${t.minQty}, ${q(t.price)}) on conflict (product_id, min_qty) do nothing;`,
    );
  }

  for (const loc of p.stockLocations) {
    say(
      `insert into product_stock (product_id, warehouse_id, qty) ` +
        `values (${pid}, (select id from warehouses where code = ${q(loc.branchId)}), ${q(loc.qty)}) ` +
        `on conflict (product_id, warehouse_id) do update set qty = excluded.qty;`,
    );
  }

  say('');
}

say('commit;');

console.log(out.join('\n'));
console.error(
  `брэнд ${CONSTRUCTION_BRANDS.length}, агуулах ${WAREHOUSES.length}, ` +
    `ангилал ${CATEGORIES.length}, бараа ${PRODUCTS.length}` +
    (unmatched ? ` — ${unmatched} бараа ангилалд холбогдсонгүй` : ''),
);
