import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BulkPriceTierRow } from '../types/db';

/** Шинэ мөрийг хадгалахаас өмнө түр ялгах түлхүүр. */
type Tier = { key: string; id: string | null; min_qty: number; price: number };

const toTier = (row: BulkPriceTierRow): Tier => ({
  key: row.id,
  id: row.id,
  min_qty: row.min_qty,
  price: Number(row.price),
});

interface ProductTiersProps {
  productId: string;
  /** Хөнгөлөлтийн хувийг харуулахад ашиглах үндсэн үнэ. */
  basePrice: number;
  uom: string;
}

export const ProductTiers: React.FC<ProductTiersProps> = ({ productId, basePrice, uom }) => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('bulk_price_tiers')
      .select('*')
      .eq('product_id', productId)
      .order('min_qty');
    if (err) setError(err.message);
    else {
      setTiers(((data as BulkPriceTierRow[]) ?? []).map(toTier));
      setRemoved([]);
      setError(null);
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = (key: string, next: Partial<Tier>) => {
    setSaved(false);
    setTiers((prev) => prev.map((t) => (t.key === key ? { ...t, ...next } : t)));
  };

  const addRow = () => {
    setSaved(false);
    const highest = tiers.reduce((m, t) => Math.max(m, t.min_qty), 0);
    setTiers((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        id: null,
        min_qty: highest ? highest * 2 : 10,
        price: basePrice,
      },
    ]);
  };

  const dropRow = (t: Tier) => {
    setSaved(false);
    if (t.id) setRemoved((prev) => [...prev, t.id!]);
    setTiers((prev) => prev.filter((x) => x.key !== t.key));
  };

  const save = async () => {
    // (product_id, min_qty) нь баазад давхардахыг хориглодог тул эндээс шалгана.
    const counts = new Map<number, number>();
    for (const t of tiers) counts.set(t.min_qty, (counts.get(t.min_qty) ?? 0) + 1);
    const duplicate = [...counts.entries()].find(([, n]) => n > 1);
    if (duplicate) {
      setError(`${duplicate[0]} ${uom} гэсэн шатлал давхардаж байна.`);
      return;
    }
    if (tiers.some((t) => !Number.isInteger(t.min_qty) || t.min_qty < 1)) {
      setError('Доод тоо хэмжээ 1-ээс багагүй бүхэл тоо байх ёстой.');
      return;
    }
    if (tiers.some((t) => t.price < 0)) {
      setError('Үнэ сөрөг байж болохгүй.');
      return;
    }

    setSaving(true);
    setError(null);

    if (removed.length) {
      const { error: delErr } = await supabase
        .from('bulk_price_tiers')
        .delete()
        .in('id', removed);
      if (delErr) {
        setError(delErr.message);
        setSaving(false);
        return;
      }
    }

    // Шинэ, хуучин мөрийг салгана: PostgREST нэг хүсэлтийн бүх мөрийг ижил
    // баганатай болгодог тул id-гүй мөр холилдвол id нь default биш NULL болно.
    const existing = tiers.filter((t) => t.id);
    const fresh = tiers.filter((t) => !t.id);

    if (existing.length) {
      const { error: upErr } = await supabase.from('bulk_price_tiers').upsert(
        existing.map((t) => ({
          id: t.id!,
          product_id: productId,
          min_qty: t.min_qty,
          price: t.price,
        })),
      );
      if (upErr) {
        setError(upErr.message);
        setSaving(false);
        return;
      }
    }

    if (fresh.length) {
      const { error: insErr } = await supabase.from('bulk_price_tiers').insert(
        fresh.map((t) => ({
          product_id: productId,
          min_qty: t.min_qty,
          price: t.price,
        })),
      );
      if (insErr) {
        setError(insErr.message);
        setSaving(false);
        return;
      }
    }

    await load();
    setSaving(false);
    setSaved(true);
  };

  const field =
    'w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-hidden focus:border-slate-900 tabular-nums';

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold text-slate-900">Бөөний үнийн шатлал</h3>
          <p className="text-[11px] text-slate-500">
            Тухайн тоо хэмжээнээс дээш захиалахад мөрдөх нэгж үнэ.
          </p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Мөр нэмэх
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-[11px] text-rose-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-xs text-slate-400">Ачаалж байна…</p>
      ) : tiers.length === 0 ? (
        <p className="text-xs text-slate-500">
          Шатлал алга. Бөөний хөнгөлөлт санал болгохгүй бол хоосон орхиж болно.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-[11px] text-slate-500">
            <tr>
              <th className="text-left font-medium pb-1">Доод тоо хэмжээ ({uom})</th>
              <th className="text-left font-medium pb-1">Нэгж үнэ (₮)</th>
              <th className="text-right font-medium pb-1">Хөнгөлөлт</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {tiers.map((t) => {
              const off =
                basePrice > 0
                  ? Math.round(((basePrice - t.price) / basePrice) * 1000) / 10
                  : 0;
              return (
                <tr key={t.key}>
                  <td className="pr-2 py-1">
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={t.min_qty}
                      onChange={(e) => patch(t.key, { min_qty: Number(e.target.value) })}
                      className={field}
                    />
                  </td>
                  <td className="pr-2 py-1">
                    <input
                      type="number"
                      min={0}
                      value={t.price}
                      onChange={(e) => patch(t.key, { price: Number(e.target.value) })}
                      className={field}
                    />
                  </td>
                  <td className="pr-2 py-1 text-right tabular-nums">
                    <span
                      className={
                        off > 0 ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                      }
                    >
                      {off > 0 ? `−${off}%` : '—'}
                    </span>
                  </td>
                  <td className="py-1 text-right">
                    <button
                      type="button"
                      onClick={() => dropRow(t)}
                      title="Мөр устгах"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="flex items-center justify-end gap-2">
        {saved && <span className="text-[11px] text-emerald-700 font-medium">Хадгалагдлаа</span>}
        <button
          type="button"
          onClick={save}
          disabled={saving || loading}
          className="btn-liquid-dark px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Шатлал хадгалах
        </button>
      </div>
    </div>
  );
};
