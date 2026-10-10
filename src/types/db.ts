/**
 * Supabase дэх хүснэгтүүдийн мөрийн төрөл.
 *
 * `src/types/index.ts` дэх төрлүүд нь дэлгүүрийн UI-д зориулагдсан (тооцоолсон
 * талбартай, camelCase). Эдгээр нь баазын мөрийг яг хэвээр нь илэрхийлнэ.
 */

export type Role = 'admin' | 'editor' | 'viewer';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
}

export interface BrandRow {
  id: string;
  slug: string;
  name: string;
  short_code: string;
  country: string | null;
  logo_url: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon_name: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface ProductRow {
  id: string;
  sku: string;
  barcode: string | null;
  slug: string;
  name: string;
  mongolian_name: string | null;
  category_id: string | null;
  subcategory: string | null;
  brand_id: string | null;

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
  is_published: boolean;

  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImageRow {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export interface ProductSpecRow {
  id: string;
  product_id: string;
  name: string;
  value: string;
  sort_order: number;
}

export interface BulkPriceTierRow {
  id: string;
  product_id: string;
  min_qty: number;
  price: number;
}

export interface WarehouseRow {
  id: string;
  code: string;
  name: string;
  address: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface ProductStockRow {
  product_id: string;
  warehouse_id: string;
  qty: number;
  updated_at: string;
}

export interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  author_name: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromotionRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  banner_url: string | null;
  discount_note: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_published: boolean;
  created_at: string;
}
