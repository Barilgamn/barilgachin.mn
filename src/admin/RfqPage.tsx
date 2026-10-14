import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Phone, Search, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { RfqItemRow, RfqRequestRow, RfqStatus } from '../types/db';
import { formatDate, formatDateTime, formatMNT } from './orderLabels';

const STATUS_LABEL: Record<RfqStatus, string> = {
  new: 'Шинэ',
  in_review: 'Судалж байна',
  quoted: 'Санал илгээсэн',
  won: 'Гэрээ болсон',
  lost: 'Амжилтгүй',
};

const STATUS_CLASS: Record<RfqStatus, string> = {
  new: 'bg-amber-50 text-amber-700',
  in_review: 'bg-blue-50 text-blue-700',
  quoted: 'bg-indigo-50 text-indigo-700',
  won: 'bg-emerald-50 text-emerald-700',
  lost: 'bg-slate-100 text-slate-500',
};

const ORDER: RfqStatus[] = ['new', 'in_review', 'quoted', 'won', 'lost'];

export const RfqPage: React.FC = () => {
  const [rows, setRows] = useState<RfqRequestRow[]>([]);
  const [items, setItems] = useState<RfqItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RfqStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [reqs, its] = await Promise.all([
      supabase.from('rfq_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('rfq_items').select('*'),
    ]);
    if (reqs.error) setError(reqs.error.message);
    else {
      setRows((reqs.data as RfqRequestRow[]) ?? []);
      setError(null);
    }
    setItems((its.data as RfqItemRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.rfq_no.toLowerCase().includes(q) ||
        r.company_name.toLowerCase().includes(q) ||
        r.phone.includes(q)
      );
    });
  }, [rows, filter, query]);

  const open = openId ? rows.find((r) => r.id === openId) ?? null : null;
  const openItems = openId ? items.filter((i) => i.rfq_id === openId) : [];

  const setStatus = async (id: string, status: RfqStatus) => {
    setBusy(true);
    const { error: err } = await supabase
      .from('rfq_requests')
      .update({ status })
      .eq('id', id);
    if (err) setError(err.message);
    else await load();
    setBusy(false);
  };

  const saveNote = async (id: string, note: string) => {
    setBusy(true);
    const { error: err } = await supabase
      .from('rfq_requests')
      .update({ admin_note: note || null })
      .eq('id', id);
    if (err) setError(err.message);
    else await load();
    setBusy(false);
  };

  const remove = async (row: RfqRequestRow) => {
    if (!confirm(`${row.rfq_no} хүсэлтийг устгах уу?`)) return;
    const { error: err } = await supabase.from('rfq_requests').delete().eq('id', row.id);
    if (err) setError(err.message);
    else {
      setOpenId(null);
      await load();
    }
  };

  const newCount = rows.filter((r) => r.status === 'new').length;
  const pipeline = rows
    .filter((r) => r.status !== 'lost' && r.status !== 'won')
    .reduce((sum, r) => sum + Number(r.estimated_total), 0);

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-display">Үнийн санал</h1>
          <p className="text-sm text-slate-500">
            {rows.length} хүсэлт
            {newCount > 0 && <> · {newCount} шинэ</>}
            {pipeline > 0 && <> · хүлээгдэж буй {formatMNT(pipeline)}</>}
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Дугаар, байгууллага, утас"
            className="w-56 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-hidden focus:border-slate-900"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(['all', ...ORDER] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f as RfqStatus | 'all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer ${
              filter === f
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {f === 'all' ? 'Бүгд' : STATUS_LABEL[f as RfqStatus]}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      {open && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-3">
              <h2 className="font-mono font-bold text-slate-900">{open.rfq_no}</h2>
              <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASS[open.status]}`}>
                {STATUS_LABEL[open.status]}
              </span>
            </div>
            <button
              type="button"
              onClick={() => remove(open)}
              title="Устгах"
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-[11px] text-slate-500">
                    <tr>
                      <th className="text-left font-medium px-3 py-2">Бараа</th>
                      <th className="text-right font-medium px-3 py-2">Тоо</th>
                      <th className="text-right font-medium px-3 py-2">Лавлах үнэ</th>
                      <th className="text-right font-medium px-3 py-2">Дүн</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {openItems.map((it) => (
                      <tr key={it.id}>
                        <td className="px-3 py-2">
                          <div className="text-slate-900">{it.name}</div>
                          <div className="font-mono text-[11px] text-slate-400">{it.sku}</div>
                          {it.note && (
                            <div className="text-[11px] text-slate-500">{it.note}</div>
                          )}
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
                  <tfoot className="bg-slate-50/60">
                    <tr className="text-sm font-bold text-slate-900">
                      <td colSpan={3} className="px-3 py-2 text-right">
                        Лавлах дүн
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatMNT(Number(open.estimated_total))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <p className="text-[11px] text-slate-400">
                Лавлах дүн нь хүсэлт ирэх үеийн нийтийн үнэ. Эцсийн саналыг гэрээгээр
                тогтооно.
              </p>

              <div className="flex flex-wrap gap-1.5">
                {ORDER.map((st) => (
                  <button
                    key={st}
                    type="button"
                    disabled={busy || open.status === st}
                    onClick={() => void setStatus(open.id, st)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium disabled:opacity-40 cursor-pointer ${
                      open.status === st
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {STATUS_LABEL[st]}
                  </button>
                ))}
                {busy && <Loader2 className="w-4 h-4 animate-spin text-slate-400 self-center" />}
              </div>

              <label className="block">
                <span className="text-xs font-medium text-slate-600">Дотоод тэмдэглэл</span>
                <textarea
                  key={open.id}
                  rows={2}
                  defaultValue={open.admin_note ?? ''}
                  onBlur={(e) => {
                    if (e.target.value !== (open.admin_note ?? '')) {
                      void saveNote(open.id, e.target.value);
                    }
                  }}
                  placeholder="Фокусаас гармагц хадгална."
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-slate-900"
                />
              </label>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-lg border border-slate-200 p-3 space-y-1.5">
                <h3 className="text-[11px] font-semibold text-slate-900">Байгууллага</h3>
                <div className="font-medium text-slate-900">{open.company_name}</div>
                {open.company_register && (
                  <div className="text-slate-500">ТТД: {open.company_register}</div>
                )}
                {open.contact_person && (
                  <div className="text-slate-500">{open.contact_person}</div>
                )}
                <a
                  href={`tel:${open.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-1.5 font-semibold text-amber-700 hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  {open.phone}
                </a>
                {open.email && (
                  <a href={`mailto:${open.email}`} className="block text-slate-500 hover:underline">
                    {open.email}
                  </a>
                )}
              </div>

              <div className="rounded-lg border border-slate-200 p-3 space-y-1.5">
                <h3 className="text-[11px] font-semibold text-slate-900">Төсөл</h3>
                {open.project_location && (
                  <div className="text-slate-500 leading-snug">{open.project_location}</div>
                )}
                <div className="text-slate-500">
                  Шаардагдах хугацаа: {formatDate(open.required_date)}
                </div>
                <div className="text-slate-500">
                  {open.delivery_needed ? 'Хүргэлт шаардлагатай' : 'Өөрөө ачина'}
                </div>
                {open.notes && (
                  <div className="border-t border-slate-100 pt-1.5 text-slate-500 leading-snug">
                    {open.notes}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-slate-200 p-3 text-slate-500">
                Ирсэн: {formatDateTime(open.created_at)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-slate-400">Ачаалж байна…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            {rows.length === 0
              ? 'Хүсэлт алга. Дэлгүүрээс үнийн саналын хүсэлт ирмэгц энд харагдана.'
              : 'Шүүлтэд тохирох хүсэлт олдсонгүй.'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Дугаар</th>
                <th className="text-left font-medium px-4 py-2.5">Огноо</th>
                <th className="text-left font-medium px-4 py-2.5">Байгууллага</th>
                <th className="text-right font-medium px-4 py-2.5">Лавлах дүн</th>
                <th className="text-left font-medium px-4 py-2.5">Төлөв</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setOpenId(row.id === openId ? null : row.id)}
                  className={`cursor-pointer hover:bg-slate-50/60 ${
                    row.id === openId ? 'bg-slate-50' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono text-xs font-semibold text-slate-900">
                    {row.rfq_no}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                    {formatDate(row.created_at)}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="text-slate-900">{row.company_name}</div>
                    <div className="text-[11px] text-slate-400">{row.phone}</div>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
                    {formatMNT(Number(row.estimated_total))}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASS[row.status]}`}>
                      {STATUS_LABEL[row.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
