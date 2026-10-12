import { supabase } from './supabase';
import type { CartItem } from '../types';

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  customerType: 'individual' | 'corporate';
  companyName?: string;
  companyRegister?: string;
}

export interface OrderDelivery {
  deliveryType: 'delivery' | 'pickup';
  warehouseCode?: string;
  district?: string;
  khoroo?: string;
  streetAddress?: string;
  notes?: string;
}

export interface OrderVat {
  vatType: 'individual' | 'company';
  companyRegister?: string;
  companyName?: string;
  vatEmail?: string;
}

/** create_order() буцаадаг дүн. Үнэ, төлбөрийг бааз өөрөө тооцно. */
export interface PlacedOrder {
  orderNo: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  weightKg: number;
}

/**
 * Захиалгыг баазад үүсгэнэ.
 *
 * Зөвхөн бараа, тоо хэмжээг явуулна — үнэ, хүргэлтийн төлбөрийг
 * create_order() серверийн талд өөрөө тооцдог тул хөтчөөс ирсэн дүнг
 * хуурамчаар өөрчлөх боломжгүй.
 */
export const placeOrder = async (
  customer: OrderCustomer,
  delivery: OrderDelivery,
  vat: OrderVat,
  paymentMethod: string,
  items: CartItem[],
): Promise<PlacedOrder> => {
  const { data, error } = await supabase.rpc('create_order', {
    p_customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email ?? '',
      customer_type: customer.customerType,
      company_name: customer.companyName ?? '',
      company_register: customer.companyRegister ?? '',
    },
    p_delivery: {
      delivery_type: delivery.deliveryType,
      warehouse_code: delivery.warehouseCode ?? '',
      district: delivery.district ?? '',
      khoroo: delivery.khoroo ?? '',
      street_address: delivery.streetAddress ?? '',
      notes: delivery.notes ?? '',
    },
    p_vat: {
      vat_type: vat.vatType,
      company_register: vat.companyRegister ?? '',
      company_name: vat.companyName ?? '',
      vat_email: vat.vatEmail ?? '',
    },
    p_payment_method: paymentMethod,
    p_items: items.map((item) => ({
      product_id: item.product.id,
      qty: item.quantity,
    })),
  });

  if (error) throw new Error(error.message);

  const row = data as {
    order_no: string;
    subtotal: number;
    delivery_fee: number;
    total: number;
    weight_kg: number;
  };

  return {
    orderNo: row.order_no,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    weightKg: Number(row.weight_kg),
  };
};
