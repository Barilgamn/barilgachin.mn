import { supabase } from './supabase';

export interface RfqCustomer {
  companyName: string;
  companyRegister?: string;
  contactPerson?: string;
  phone: string;
  email?: string;
}

export interface RfqProject {
  location?: string;
  requiredDate?: string;
  deliveryNeeded: boolean;
  notes?: string;
}

export interface RfqLine {
  productId: string;
  qty: number;
  note?: string;
}

export interface SubmittedRfq {
  rfqNo: string;
  estimatedTotal: number;
}

/**
 * Үнийн саналын хүсэлт илгээнэ.
 *
 * Захиалгатай адил зөвхөн бараа, тоо хэмжээг явуулна — лавлах үнийг
 * create_rfq() баазаас уншиж, бөөний шатлалыг өөрөө тооцдог.
 */
export const submitRfq = async (
  customer: RfqCustomer,
  project: RfqProject,
  items: RfqLine[],
): Promise<SubmittedRfq> => {
  const { data, error } = await supabase.rpc('create_rfq', {
    p_customer: {
      company_name: customer.companyName,
      company_register: customer.companyRegister ?? '',
      contact_person: customer.contactPerson ?? '',
      phone: customer.phone,
      email: customer.email ?? '',
    },
    p_project: {
      location: project.location ?? '',
      required_date: project.requiredDate ?? '',
      delivery_needed: project.deliveryNeeded,
      notes: project.notes ?? '',
    },
    p_items: items.map((i) => ({
      product_id: i.productId,
      qty: i.qty,
      note: i.note ?? '',
    })),
  });

  if (error) throw new Error(error.message);

  const row = data as { rfq_no: string; estimated_total: number };
  return { rfqNo: row.rfq_no, estimatedTotal: Number(row.estimated_total) };
};
