/**
 * Барааг брэндэд холбох засвар.
 *
 * Анхны seed нь брэндийг ЯГ нэрээр нь тааруулсан боловч барааны брэндийн
 * бичвэр ("KNAUF (Герман)") хүснэгтийн нэртэй ("КНАУФ (Knauf)") таардаггүй
 * тул 12 бараа холбогдоогүй. Энд товч код болон нэрний хэсгээр тааруулна.
 */
import { PRODUCTS } from '../src/data/mockData';
import { CONSTRUCTION_BRANDS } from '../src/data/brandsData';
import { slugify } from '../src/lib/slug';

function findBrandSlug(brandText: string): string | null {
  const text = brandText.toLowerCase();
  for (const b of CONSTRUCTION_BRANDS) {
    const needles = [b.shortCode, b.id, b.name.split(' ')[0]].map((x) => x.toLowerCase());
    if (needles.some((n) => n.length > 2 && text.includes(n))) return b.id;
  }
  return null;
}

const lines: string[] = [
  '-- Барааг брэндэд холбох засвар (scripts/fix-brands.ts).',
  '',
  'begin;',
  '',
];
let matched = 0;
let created = 0;

for (const p of PRODUCTS) {
  const slug = findBrandSlug(p.brand);
  if (!slug) {
    // brandsData-д байхгүй брэнд: барааны бичвэрээс үүсгэнэ.
    const made = slugify(p.brand);
    const short = p.brand.split(' ')[0].toUpperCase().slice(0, 8);
    lines.push(
      `insert into brands (slug, name, short_code, sort_order) values (` +
        `'${made}', '${p.brand.replace(/'/g, "''")}', '${short.replace(/'/g, "''")}', 99) ` +
        `on conflict (slug) do nothing;`,
    );
    lines.push(
      `update products set brand_id = (select id from brands where slug = '${made}') ` +
        `where sku = '${p.sku.replace(/'/g, "''")}';`,
    );
    created += 1;
    continue;
  }
  matched += 1;
  lines.push(
    `update products set brand_id = (select id from brands where slug = '${slug}') ` +
      `where sku = '${p.sku.replace(/'/g, "''")}';`,
  );
}

lines.push('', 'commit;');
console.log(lines.join('\n'));
console.error(`${matched}/${PRODUCTS.length} таарлаа, ${created} шинэ брэнд үүсгэв`);
