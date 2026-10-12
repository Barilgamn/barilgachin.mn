import React, { useState } from 'react';
import { ArrowLeft, Loader2, Printer, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { InvoiceDocument, type InvoiceData } from './InvoiceDocument';

interface LookupRow {
  order_no: string;
  status: string;
  invoice_no: string | null;
  invoice_issued_at: string | null;
  due_date: string | null;
  paid_at: string | null;
  payment_status: string;
  created_at: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_type: string;
  district: string | null;
  khoroo: string | null;
  street_address: string | null;
  company_register: string | null;
  company_name: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  items: Array<{
    sku: string;
    name: string;
    uom: string;
    qty: number;
    unit_price: number;
    line_total: number;
  }>;
}

const toInvoice = (r: LookupRow): InvoiceData => ({
  invoiceNo: r.invoice_no,
  orderNo: r.order_no,
  issuedAt: r.invoice_issued_at ?? r.created_at,
  dueDate: r.due_date,
  paidAt: r.paid_at,
  buyer: {
    name: r.customer_name,
    phone: r.customer_phone,
    email: r.customer_email,
    register: r.company_register,
    companyName: r.company_name,
  },
  lines: r.items.map((i) => ({
    name: i.name,
    sku: i.sku,
    uom: i.uom,
    qty: Number(i.qty),
    unitPrice: Number(i.unit_price),
    lineTotal: Number(i.line_total),
  })),
  subtotal: Number(r.subtotal),
  deliveryFee: Number(r.delivery_fee),
  total: Number(r.total),
  deliveryAddress:
    r.delivery_type === 'delivery'
      ? [r.district, r.khoroo, r.street_address].filter(Boolean).join(', ')
      : null,
});

export const OrderLookupPage: React.FC = () => {
  const [params] = useSearchParams();
  const [orderNo, setOrderNo] = useState(params.get('order') ?? '');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<InvoiceData | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFound(null);

    const { data, error: err } = await supabase.rpc('lookup_order', {
      p_order_no: orderNo,
      p_phone: phone,
    });

    if (err) setError(err.message);
    else setFound(toInvoice(data as LookupRow));
    setLoading(false);
  };

  const field =
    'mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-hidden focus:border-slate-900';

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="no-print inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Дэлгүүр рүү буцах
        </Link>

        <div className="no-print mt-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-xl font-bold font-display text-slate-900">
            Захиалга, нэхэмжлэх харах
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Захиалгын дугаар, захиалга өгсөн утасны дугаараа оруулна уу.
          </p>

          <form onSubmit={search} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Захиалгын дугаар</span>
              <input
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                placeholder="BGH-2610-0001"
                className={`${field} font-mono`}
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Утасны дугаар</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9911-2233"
                className={field}
              />
            </label>
            <button
              type="submit"
              disabled={loading || !orderNo.trim() || !phone.trim()}
              className="btn-liquid-dark h-[42px] self-end px-4 text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Хайх
            </button>
          </form>

          {error && (
            <p role="alert" className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </p>
          )}
        </div>

        {found && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="no-print flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
              <span className="text-sm font-semibold text-slate-900">
                {found.invoiceNo ?? found.orderNo}
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-liquid-dark px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Хэвлэх
              </button>
            </div>
            <InvoiceDocument data={found} />
          </div>
        )}
      </div>
    </div>
  );
};
