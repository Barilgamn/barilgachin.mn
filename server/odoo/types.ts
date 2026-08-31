/** Odoo-гийн many2one талбар: [id, дэлгэцийн нэр], утгагүй бол false. */
export type Many2One = [number, string] | false;

export function m2oId(value: Many2One): number | null {
  return Array.isArray(value) ? value[0] : null;
}

export function m2oName(value: Many2One): string | null {
  return Array.isArray(value) ? value[1] : null;
}

export type OdooProduct = {
  id: number;
  name: string;
  default_code: string | false;
  barcode: string | false;
  list_price: number;
  uom_id: Many2One;
  weight: number;
  volume: number;
  categ_id: Many2One;
  public_categ_ids: number[];
  description_sale: string | false;
  qty_available: number;
  virtual_available: number;
  product_tag_ids: number[];
  write_date: string;
};

export type OdooPublicCategory = {
  id: number;
  name: string;
  parent_id: Many2One;
  sequence: number;
};

export type OdooWarehouse = {
  id: number;
  name: string;
  code: string;
  lot_stock_id: Many2One;
  partner_id: Many2One;
};

/** stock.quant-ыг бараа/байршлаар бүлэглэсэн үр дүн. */
export type StockGroup = {
  product_id: Many2One;
  location_id: Many2One;
  quantity: number;
  reserved_quantity: number;
};
