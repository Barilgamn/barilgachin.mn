import React, { useCallback, useEffect, useState } from 'react';
import {
  Banknote,
  Check,
  FileText,
  Loader2,
  Package,
  Truck,
  X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CustomerRow, OrderItemRow, OrderRow, OrderStatus } from '../types/db';
import {
  NEXT_STATUS,
  STATUS_CLASS,
  STATUS_LABEL,
  formatDate,
  formatDateTime,
  formatMNT,
  paymentLabel,
} from './orderLabels';

const DIRECT_METHODS = [
  { value: 'cash', label: 'Бэлэн мөнгө' },
  { value: 'transfer', label: 'Дансаар шилжүүлэг' },
  { value: 'qpay', label: 'QPay' },
  { value: 'khanbank', label: 'Хаан банк' },
];

interface OrderDetailProps {
  order: OrderRow;
  customer: CustomerRow | null;
  onChanged: () => void;
  onClose: () => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({
  order,
  customer,
  onChanged,
  onClose,
}) => {
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dueDays, setDueDays] = useState(14);
  const [method, setMethod] = useState('cash');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);
    if (err) setError(err.message);
    else setItems((data as OrderItemRow[]) ?? []);
    setLoading(false);
  }, [order.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (fn: () => PromiseLike<{ error: { message: string } | null }>) => {
    setBusy(true);
    setError(null);
    const { error: err } = await fn();
    if (err) setError(err.message);
    else onChanged();
    setBusy(false);
  };

  const confirmOrder = (settlement: 'direct' | 'invoice') =>
    run(() =>
      supabase.rpc('confirm_order', {
        p_order_id: order.id,
        p_settlement: settlement,
        p_payment_method: settlement === 'direct' ? method : null,
        p_due_days: settlement === 'invoice' ? dueDays : null,
      }),
    );

  const markPaid = () =>
    run(() => supabase.rpc('mark_order_paid', { p_order_id: order.id }));

  const setStatus = (status: OrderStatus) =>
    run(() => supabase.from('orders').update({ status }).eq('id', order.id));

  const next = NEXT_STATUS[order.status];
  const address = [order.district, order.khoroo, order.street_address]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="font-mono font-bold text-slate-900">{order.order_no}</h2>
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASS[order.status]}`}
          >
            {STATUS_LABEL[order.status]}
          </span>
          {order.payment_status === 'paid' ? (
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              Төлөгдсөн
            </span>
          ) : (
            <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
              Төлөгдөөгүй
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 cursor-pointer"
          title="Хаах"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <p role="alert" className="m-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 p-4 lg:grid-cols-3">
        {/* ─── Бараа ─── */}
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            {loading ? (
              <p className="p-4 text-xs text-slate-400">Ачаалж байна…</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[11px] text-slate-500">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">Бараа</th>
                    <th className="text-right font-medium px-3 py-2">Тоо</th>
                    <th className="text-right font-medium px-3 py-2">Нэгж үнэ</th>
                    <th className="text-right font-medium px-3 py-2">Дүн</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td className="px-3 py-2">
                        <div className="text-slate-900">{it.name}</div>
                        <div className="font-mono text-[11px] text-slate-400">{it.sku}</div>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                        {Number(it.qty).toLocaleString('mn-MN')} {it.uom}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatMNT(Number(it.unit_price))}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">
                        {formatMNT(Number(it.line_total))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/60 text-xs">
                  <tr>
                    <td colSpan={3} className="px-3 py-1.5 text-right text-slate-500">
                      Барааны дүн
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {formatMNT(Number(order.subtotal))}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-3 py-1.5 text-right text-slate-500">
                      Хүргэлт ({Number(order.total_weight_kg).toLocaleString('mn-MN')} кг)
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {formatMNT(Number(order.delivery_fee))}
                    </td>
                  </tr>
                  <tr className="font-bold text-sm text-slate-900">
                    <td colSpan={3} className="px-3 py-2 text-right">
                      Нийт
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatMNT(Number(order.total))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* ─── Үйлдэл ─── */}
          {order.status === 'new' && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 space-y-3">
              <h3 className="text-xs font-semibold text-slate-900">Баталгаажуулах</h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                    Шууд төлбөр
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Төлбөр хүлээн авсан. Төлөгдсөн гэж тэмдэглэнэ.
                  </p>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-hidden focus:border-slate-900"
                  >
                    {DIRECT_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void confirmOrder('direct')}
                    className="w-full btn-liquid-dark px-3 py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Төлбөртэй баталгаажуулах
                  </button>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    Нэхэмжлэхээр
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Нэхэмжлэх дугаар үүсгэж, төлөх хугацаа тогтооно.
                  </p>
                  <label className="flex items-center gap-2 text-[11px] text-slate-600">
                    Хугацаа
                    <input
                      type="number"
                      min={0}
                      value={dueDays}
                      onChange={(e) => setDueDays(Number(e.target.value))}
                      className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-xs tabular-nums outline-hidden focus:border-slate-900"
                    />
                    хоног
                  </label>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void confirmOrder('invoice')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 hover:border-slate-400 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                    Нэхэмжлэх үүсгэх
                  </button>
                </div>
              </div>
            </div>
          )}

          {order.status !== 'new' && order.status !== 'cancelled' && (
            <div className="flex flex-wrap items-center gap-2">
              {next && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void setStatus(next)}
                  className="btn-liquid-dark px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {next === 'packed' && <Package className="w-3.5 h-3.5" />}
                  {next === 'shipped' && <Truck className="w-3.5 h-3.5" />}
                  {next === 'delivered' && <Check className="w-3.5 h-3.5" />}
                  {STATUS_LABEL[next]} болгох
                </button>
              )}
              {order.payment_status !== 'paid' && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void markPaid()}
                  className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:border-emerald-400 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Banknote className="w-3.5 h-3.5" />
                  Төлөгдсөн гэж тэмдэглэх
                </button>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  if (confirm('Энэ захиалгыг цуцлах уу?')) void setStatus('cancelled');
                }}
                className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:border-rose-200 disabled:opacity-50 cursor-pointer"
              >
                Цуцлах
              </button>
            </div>
          )}
        </div>

        {/* ─── Талууд ─── */}
        <div className="space-y-3 text-xs">
          <div className="rounded-lg border border-slate-200 p-3 space-y-1.5">
            <h3 className="text-[11px] font-semibold text-slate-900">Захиалагч</h3>
            <div className="text-slate-900">{customer?.name ?? '—'}</div>
            <div className="text-slate-500">{customer?.phone ?? '—'}</div>
            {customer?.email && <div className="text-slate-500">{customer.email}</div>}
            {customer?.customer_type === 'corporate' && customer.company_name && (
              <div className="text-slate-500">{customer.company_name}</div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 p-3 space-y-1.5">
            <h3 className="text-[11px] font-semibold text-slate-900">
              {order.delivery_type === 'delivery' ? 'Хүргэлт' : 'Өөрөө ачих'}
            </h3>
            {order.delivery_type === 'delivery' ? (
              <div className="text-slate-500 leading-snug">{address || '—'}</div>
            ) : (
              <div className="text-slate-500">Агуулахаас</div>
            )}
            {order.delivery_notes && (
              <div className="text-slate-500 leading-snug border-t border-slate-100 pt-1.5">
                {order.delivery_notes}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 p-3 space-y-1.5">
            <h3 className="text-[11px] font-semibold text-slate-900">Төлбөр</h3>
            <div className="flex justify-between">
              <span className="text-slate-500">Хэрэгсэл</span>
              <span className="text-slate-900">{paymentLabel(order.payment_method)}</span>
            </div>
            {order.settlement && (
              <div className="flex justify-between">
                <span className="text-slate-500">Арга</span>
                <span className="text-slate-900">
                  {order.settlement === 'invoice' ? 'Нэхэмжлэхээр' : 'Шууд төлбөр'}
                </span>
              </div>
            )}
            {order.invoice_no && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">Нэхэмжлэх</span>
                  <span className="font-mono text-slate-900">{order.invoice_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Төлөх хугацаа</span>
                  <span className="text-slate-900">{formatDate(order.due_date)}</span>
                </div>
              </>
            )}
            {order.paid_at && (
              <div className="flex justify-between">
                <span className="text-slate-500">Төлсөн</span>
                <span className="text-slate-900">{formatDateTime(order.paid_at)}</span>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 p-3 space-y-1.5">
            <h3 className="text-[11px] font-semibold text-slate-900">НӨАТ</h3>
            <div className="text-slate-500">
              {order.vat_type === 'company'
                ? `Байгууллага · ТТД ${order.company_register ?? '—'}`
                : 'Хувь хүн'}
            </div>
            {order.company_name && <div className="text-slate-500">{order.company_name}</div>}
          </div>

          <div className="rounded-lg border border-slate-200 p-3 text-slate-500">
            Үүссэн: {formatDateTime(order.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};
