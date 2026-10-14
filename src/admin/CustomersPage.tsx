import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, Pencil, Plus, Search, Trash2, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CustomerRow, OrderRow } from '../types/db';
import { STATUS_CLASS, STATUS_LABEL, formatDate, formatMNT } from './orderLabels';
import { CustomerForm } from './CustomerForm';

export const CustomersPage: React.FC = () => {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState<CustomerRow | null | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    const [custs, ords] = await Promise.all([
      supabase.from('customers').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]);
    if (custs.error) setError(custs.error.message);
    else {
      setRows((custs.data as CustomerRow[]) ?? []);
      setError(null);
    }
    setOrders((ords.data as OrderRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** Харилцагч бүрийн захиалгын тоо, нийт дүн, авлага. Цуцалсныг тооцохгүй. */
  const stats = useMemo(() => {
    const m = new Map<string, { count: number; spent: number; owed: number; last: string | null }>();
    for (const o of orders) {
      if (!o.customer_id || o.status === 'cancelled') continue;
      const cur = m.get(o.customer_id) ?? { count: 0, spent: 0, owed: 0, last: null };
      cur.count += 1;
      cur.spent += Number(o.total);
      if (o.payment_status !== 'paid') cur.owed += Number(o.total);
      if (!cur.last || o.created_at > cur.last) cur.last = o.created_at;
      m.set(o.customer_id, cur);
    }
    return m;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.company_name ?? '').toLowerCase().includes(q),
    );
  }, [rows, query]);

  const remove = async (row: CustomerRow) => {
    const theirs = orders.filter((o) => o.customer_id === row.id).length;
    // orders.customer_id нь "on delete set null" тул захиалга устахгүй, зөвхөн сална.
    const warning = theirs
      ? `"${row.name}" харилцагчийг устгах уу?\n\n${theirs} захиалга байна. Захиалга устахгүй, гэхдээ эзэнгүй болно.`
      : `"${row.name}" харилцагчийг устгах уу?`;
    if (!confirm(warning)) return;

    const { error: err } = await supabase.from('customers').delete().eq('id', row.id);
    if (err) setError(err.message);
    else {
      setOpenId(null);
      await load();
    }
  };

  const openOrders = openId ? orders.filter((o) => o.customer_id === openId) : [];

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-display">Харилцагч</h1>
          <p className="text-sm text-slate-500">{rows.length} харилцагч</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Нэр, утас, байгууллага"
              className="w-56 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-hidden focus:border-slate-900"
            />
          </div>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="btn-liquid-dark px-3.5 py-2 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Шинэ харилцагч
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      {editing !== undefined && (
        <CustomerForm
          key={editing?.id ?? 'new'}
          editing={editing}
          onSaved={() => {
            setEditing(undefined);
            void load();
          }}
          onCancel={() => setEditing(undefined)}
        />
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-slate-400">Ачаалж байна…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            {rows.length === 0
              ? 'Харилцагч алга. Захиалга ирмэгц автоматаар бүртгэгдэнэ.'
              : 'Хайлтад тохирох харилцагч олдсонгүй.'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Нэр</th>
                <th className="text-left font-medium px-4 py-2.5">Утас</th>
                <th className="text-right font-medium px-4 py-2.5">Захиалга</th>
                <th className="text-right font-medium px-4 py-2.5">Нийт</th>
                <th className="text-right font-medium px-4 py-2.5">Авлага</th>
                <th className="text-left font-medium px-4 py-2.5">Сүүлд</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => {
                const s = stats.get(row.id);
                const isOpen = row.id === openId;
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      onClick={() => setOpenId(isOpen ? null : row.id)}
                      className={`cursor-pointer hover:bg-slate-50/60 ${isOpen ? 'bg-slate-50' : ''}`}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          {row.customer_type === 'corporate' ? (
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="text-slate-900 truncate">{row.name}</div>
                            {row.company_name && (
                              <div className="text-[11px] text-slate-400 truncate">
                                {row.company_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{row.phone}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{s?.count ?? 0}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
                        {formatMNT(s?.spent ?? 0)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
                        {s?.owed ? (
                          <span className="text-rose-700 font-medium">{formatMNT(s.owed)}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                        {s?.last ? formatDate(s.last) : '—'}
                      </td>
                      <td
                        className="px-4 py-2.5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setEditing(row)}
                          title="Засах"
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(row)}
                          title="Устгах"
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr>
                        <td colSpan={7} className="bg-slate-50/60 px-4 py-3">
                          {openOrders.length === 0 ? (
                            <p className="text-xs text-slate-500">Захиалга алга.</p>
                          ) : (
                            <div className="space-y-1">
                              {openOrders.map((o) => (
                                <div
                                  key={o.id}
                                  className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
                                >
                                  <span className="font-mono font-semibold text-slate-900">
                                    {o.order_no}
                                  </span>
                                  <span className="text-slate-500">{formatDate(o.created_at)}</span>
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${STATUS_CLASS[o.status]}`}
                                  >
                                    {STATUS_LABEL[o.status]}
                                  </span>
                                  {o.invoice_no && (
                                    <span className="font-mono text-[11px] text-slate-400">
                                      {o.invoice_no}
                                    </span>
                                  )}
                                  <span className="ml-auto tabular-nums font-medium text-slate-900">
                                    {formatMNT(Number(o.total))}
                                  </span>
                                  <span
                                    className={`w-24 text-right text-[11px] ${
                                      o.payment_status === 'paid'
                                        ? 'text-emerald-700'
                                        : 'text-rose-700'
                                    }`}
                                  >
                                    {o.payment_status === 'paid' ? 'Төлөгдсөн' : 'Төлөгдөөгүй'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
