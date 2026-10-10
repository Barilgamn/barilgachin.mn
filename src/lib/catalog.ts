import { supabase } from './supabase';
import type { Category, Product, StockLocation, UnitOfMeasure, VehicleRequirement } from '../types';

/**
 * Баазаас каталогийг уншиж, UI-ийн төрөл рүү хөрвүүлнэ.
 *
 * Дэлгүүрийн компонентууд `src/types/index.ts` дэх `Product`/`Category`-г
 * ашигладаг тул энэ давхарга баазын мөрийг тэр хэлбэрт буулгана. Ингэснээр
 * UI-г өөрчлөхгүйгээр өгөгдлийн эх сурвалжийг солих боломжтой.
 */

/** Нэг дуудлагаар бараа болон түүний дэд хүснэгтүүдийг цуг татна. */
const PRODUCT_SELECT = `
  *,
  product_images ( url, sort_order ),
  product_specs ( name, value, sort_order ),
  bulk_price_tiers ( min_qty, price ),
  product_stock ( qty, warehouses ( code, name, address ) )
`;

interface RawProduct {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  mongolian_name: string | null;
  category_id: string | null;
  subcategory: string | null;
  price: number;
  original_price: number | null;
  uom: string;
  weight_kg: number;
  volume_m3: number | null;
  description: string | null;
  full_description: string | null;
  mns_standard: string | null;
  origin_country: string | null;
  vehicle_requirement: string;
  vehicle_note: string | null;
  is_mns_certified: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  brand_id: string | null;
  product_images: { url: string; sort_order: number }[];
  product_specs: { name: string; value: string; sort_order: number }[];
  bulk_price_tiers: { min_qty: number; price: number }[];
  product_stock: {
    qty: number;
    warehouses: { code: string; name: string; address: string | null } | null;
  }[];
}

interface RawCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon_name: string | null;
  image_url: string | null;
  sort_order: number;
}

interface RawWarehouse {
  id: string;
  code: string;
  name: string;
  address: string | null;
  sort_order: number;
}

export interface Catalog {
  products: Product[];
  categories: Category[];
  warehouses: StockLocation[];
}

function toProduct(row: RawProduct, brandName: string): Product {
  const stockLocations: StockLocation[] = row.product_stock
    .filter((s) => s.warehouses)
    .map((s) => ({
      branchId: s.warehouses!.code,
      branchName: s.warehouses!.name,
      qty: Number(s.qty),
      locationCode: s.warehouses!.code,
      address: s.warehouses!.address ?? '',
    }));

  const price = Number(row.price);

  return {
    id: row.id,
    sku: row.sku,
    barcode: row.barcode ?? '',
    name: row.name,
    mongolianName: row.mongolian_name ?? row.name,
    category: row.category_id ?? '',
    subcategory: row.subcategory ?? '',
    brand: brandName,
    price,
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    uom: row.uom as UnitOfMeasure,
    availableUoms: [row.uom as UnitOfMeasure],
    weightKg: Number(row.weight_kg),
    volumeM3: row.volume_m3 ? Number(row.volume_m3) : undefined,

    // Бөөний хямдралын хувийг үндсэн үнээс тооцно — баазад давхар хадгалахгүй.
    bulkTiers: [...row.bulk_price_tiers]
      .sort((a, b) => a.min_qty - b.min_qty)
      .map((t) => ({
        minQty: t.min_qty,
        price: Number(t.price),
        discountPercent:
          price > 0 ? Math.round(((price - Number(t.price)) / price) * 1000) / 10 : 0,
      })),

    stockLocations,
    totalStock: stockLocations.reduce((sum, s) => sum + s.qty, 0),

    // Үнэлгээний өгөгдөл хараахан байхгүй.
    rating: 0,
    reviewCount: 0,

    images: [...row.product_images]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.url),

    description: row.description ?? '',
    fullDescription: row.full_description ?? row.description ?? '',
    techSpecs: [...row.product_specs]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({ name: s.name, value: s.value })),

    mnsStandard: row.mns_standard ?? undefined,
    originCountry: row.origin_country ?? '',
    vehicleRequirement: row.vehicle_requirement as VehicleRequirement,
    vehicleRecommendationText: row.vehicle_note ?? '',

    isMNSCertified: row.is_mns_certified,
    isFeatured: row.is_featured,
    isBestseller: row.is_bestseller,
    isNewArrival: row.is_new_arrival,
    isEcoGreen: false,

    odooSyncStatus: 'synced',
    odooProductId: 0,
  };
}

export async function fetchCatalog(): Promise<Catalog> {
  const [productsRes, categoriesRes, warehousesRes, brandsRes] = await Promise.all([
    supabase.from('products').select(PRODUCT_SELECT).order('sort_order'),
    supabase.from('categories').select('*').order('sort_order').order('name'),
    supabase.from('warehouses').select('*').order('sort_order'),
    supabase.from('brands').select('id, name'),
  ]);

  const firstError =
    productsRes.error ?? categoriesRes.error ?? warehousesRes.error ?? brandsRes.error;
  if (firstError) throw new Error(firstError.message);

  const brandById = new Map(
    ((brandsRes.data ?? []) as { id: string; name: string }[]).map((b) => [b.id, b.name]),
  );

  const rawProducts = (productsRes.data ?? []) as unknown as RawProduct[];
  const products = rawProducts.map((row) =>
    toProduct(row, row.brand_id ? (brandById.get(row.brand_id) ?? '') : ''),
  );

  // Дэд ангилал ба барааны тоог бараанаас гаргана — баазад давхар хөтлөхгүй.
  const categories = ((categoriesRes.data ?? []) as RawCategory[]).map((c) => {
    const inCategory = products.filter((p) => p.category === c.id);
    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description ?? '',
      iconName: c.icon_name ?? 'Package',
      subcategories: [...new Set(inCategory.map((p) => p.subcategory).filter(Boolean))],
      image: c.image_url ?? '',
      productCount: inCategory.length,
    } satisfies Category;
  });

  const warehouses = ((warehousesRes.data ?? []) as RawWarehouse[]).map((w) => ({
    branchId: w.code,
    branchName: w.name,
    qty: 0,
    locationCode: w.code,
    address: w.address ?? '',
  }));

  return { products, categories, warehouses };
}
