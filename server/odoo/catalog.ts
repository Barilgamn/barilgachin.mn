import { readGroup, searchCount, searchRead } from "./client.js";
import type {
  OdooProduct,
  OdooPublicCategory,
  OdooWarehouse,
  StockGroup,
} from "./types.js";

const PRODUCT_FIELDS = [
  "name",
  "default_code",
  "barcode",
  "list_price",
  "uom_id",
  "weight",
  "volume",
  "categ_id",
  "public_categ_ids",
  "description_sale",
  "qty_available",
  "virtual_available",
  "product_tag_ids",
  "write_date",
];

/** Дэлгүүрт харагдах бараа: зарагддаг ба вэбэд нийтэлсэн. */
function publishedDomain(): unknown[] {
  return [
    ["sale_ok", "=", true],
    ["is_published", "=", true],
  ];
}

export function listProducts(
  { limit = 100, offset = 0, since }: { limit?: number; offset?: number; since?: string } = {},
): Promise<OdooProduct[]> {
  const domain = [...publishedDomain()];
  // Нэмэлт синк: сүүлийн татсанаас хойш өөрчлөгдсөнийг л авна.
  if (since) domain.push(["write_date", ">", since]);

  return searchRead<OdooProduct>("product.template", domain, {
    fields: PRODUCT_FIELDS,
    limit,
    offset,
    order: "id asc",
  });
}

export function countProducts(): Promise<number> {
  return searchCount("product.template", publishedDomain());
}

export function listCategories(): Promise<OdooPublicCategory[]> {
  return searchRead<OdooPublicCategory>("product.public.category", [], {
    fields: ["name", "parent_id", "sequence"],
    order: "sequence asc, name asc",
  });
}

export function listWarehouses(): Promise<OdooWarehouse[]> {
  return searchRead<OdooWarehouse>("stock.warehouse", [], {
    fields: ["name", "code", "lot_stock_id", "partner_id"],
  });
}

/**
 * Бараануудын үлдэгдлийг дотоод байршил тус бүрээр нэг дуудлагаар авна.
 * Боломжит үлдэгдэл = quantity − reserved_quantity.
 */
export function stockByLocation(productIds: number[]): Promise<StockGroup[]> {
  return readGroup<StockGroup>(
    "stock.quant",
    [
      ["product_id", "in", productIds],
      ["location_id.usage", "=", "internal"],
    ],
    ["quantity", "reserved_quantity"],
    ["product_id", "location_id"],
  );
}

/** Барааны зургийн нийтэд нээлттэй хаяг — RPC-ээр дамжуулах шаардлагагүй. */
export function productImageUrl(
  templateId: number,
  size: 128 | 256 | 512 | 1024 | 1920 = 1024,
): string {
  const base = (process.env.ODOO_URL ?? "").replace(/\/+$/, "");
  return `${base}/web/image/product.template/${templateId}/image_${size}`;
}
