import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CustomerRow, OrderRow, OrderStatus } from '../types/db';
import { OrderDetail } from './OrderDetail';
import { STATUS_CLASS, STATUS_LABEL, formatDate, formatMNT } from './orderLabels';

const FILTERS: Array<{ value: OrderStatus | 'all' | 'unpaid'; label: string }> = [
  { value: 'all', label: 'Бүгд' },
  { value: 'new', label: 'Шинэ' },
  { value: 'confirmed', label: 'Баталгаажсан' },
  { value: 'packed', label: 'Цуглуулсан' },
  { value: 'shipped', label: 'Илгээсэн' },
  { value: 'delivered', label: 'Хүргэсэн' },
  { value: 'unpaid', label: 'Төлөгдөөгүй' },
];

export const OrdersPage: React.FC = () => {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'all' | 'unpaid'>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [orders, custs] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('customers').select('*'),
    ]);
    if (orders.error) setError(orders.error.message);
    else {
      setRows((orders.data as OrderRow[]) ?? []);
      setError(null);
    }
    setCustomers((custs.data as CustomerRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const customerById = useMemo(
    () => new Map(customers.map((c) => [c.id, c])),
    [customers],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === 'unpaid') {
        if (r.payment_status === 'paid' || r.status === 'cancelled') return false;
      } else if (filter !== 'all' && r.status !== filter) {
        return false;
      }
      if (!q) return true;
      const c = r.customer_id ? customerById.get(r.customer_id) : null;
      return (
        r.order_no.toLowerCase().includes(q) ||
        (r.invoice_no ?? '').toLowerCase().includes(q) ||
        (c?.name ?? '').toLowerCase().includes(q) ||
        (c?.phone ?? '').includes(q)
      );
    });
  }, [rows, filter, query, customerById]);

  const open = openId ? rows.find((r) => r.id === openId) ?? null : null;

  // Нээлттэй, төлөгдөөгүй мөнгө — цуцалсныг тооцохгүй.
  const receivable = rows
    .filter((r) => r.payment_status !== 'paid' && r.status !== 'cancelled')
    .reduce((sum, r) => sum + Number(r.total), 0);
  const newCount = rows.filter((r) => r.status === 'new').length;

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-display">Захиалга</h1>
          <p className="text-sm text-slate-500">
            {rows.length} захиалга
            {newCount > 0 && <> · {newCount} шинэ</>}
            {receivable > 0 && <> · авлага {formatMNT(receivable)}</>}
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Дугаар, нэр, утас"
            className="w-56 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-hidden focus:border-slate-900"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer ${
              filter === f.value
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      {open && (
        <div className="mt-4">
          <OrderDetail
            order={open}
            customer={open.customer_id ? customerById.get(open.customer_id) ?? null : null}
            onChanged={() => void load()}
            onClose={() => setOpenId(null)}
          />
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-slate-400">Ачаалж байна…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            {rows.length === 0
              ? 'Захиалга алга. Дэлгүүрээс захиалга ирмэгц энд харагдана.'
              : 'Шүүлтэд тохирох захиалга олдсонгүй.'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Дугаар</th>
                <th className="text-left font-medium px-4 py-2.5">Огноо</th>
                <th className="text-left font-medium px-4 py-2.5">Захиалагч</th>
                <th className="text-right font-medium px-4 py-2.5">Дүн</th>
                <th className="text-left font-medium px-4 py-2.5">Төлөв</th>
                <th className="text-left font-medium px-4 py-2.5">Төлбөр</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => {
                const c = row.customer_id ? customerById.get(row.customer_id) : null;
                const overdue =
                  row.payment_status !== 'paid' &&
                  row.due_date !== null &&
                  new Date(row.due_date) < new Date();
                return (
                  <tr
                    key={row.id}
                    onClick={() => setOpenId(row.id === openId ? null : row.id)}
                    className={`cursor-pointer hover:bg-slate-50/60 ${
                      row.id === openId ? 'bg-slate-50' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="font-mono text-xs font-semibold text-slate-900">
                        {row.order_no}
                      </div>
                      {row.invoice_no && (
                        <div className="font-mono text-[11px] text-slate-400">
                          {row.invoice_no}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-slate-900">{c?.name ?? '—'}</div>
                      <div className="text-[11px] text-slate-400">{c?.phone ?? ''}</div>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
                      {formatMNT(Number(row.total))}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASS[row.status]}`}
                      >
                        {STATUS_LABEL[row.status]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {row.payment_status === 'paid' ? (
                        <span className="text-[11px] font-medium text-emerald-700">
                          Төлөгдсөн
                        </span>
                      ) : overdue ? (
                        <span className="text-[11px] font-medium text-rose-700">
                          Хугацаа хэтэрсэн
                        </span>
                      ) : row.due_date ? (
                        <span className="text-[11px] text-slate-500">
                          {formatDate(row.due_date)}-нд
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Төлөгдөөгүй</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
