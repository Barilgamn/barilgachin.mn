import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ProductStockRow, WarehouseRow } from '../types/db';

interface ProductStockProps {
  productId: string;
  uom: string;
}

export const ProductStock: React.FC<ProductStockProps> = ({ productId, uom }) => {
  const [warehouses, setWarehouses] = useState<WarehouseRow[]>([]);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [updatedAt, setUpdatedAt] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [whs, stock] = await Promise.all([
      supabase.from('warehouses').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('product_stock').select('*').eq('product_id', productId),
    ]);

    const err = whs.error ?? stock.error;
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    const rows = (stock.data as ProductStockRow[]) ?? [];
    setWarehouses((whs.data as WarehouseRow[]) ?? []);
    setQty(Object.fromEntries(rows.map((r) => [r.warehouse_id, Number(r.qty)])));
    setUpdatedAt(Object.fromEntries(rows.map((r) => [r.warehouse_id, r.updated_at])));
    setError(null);
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (Object.values(qty).some((v: number) => v < 0 || Number.isNaN(v))) {
      setError('Үлдэгдэл сөрөг байж болохгүй.');
      return;
    }

    setSaving(true);
    setError(null);

    // product_stock дээр touch_updated_at trigger байхгүй тул гараар тавина.
    const now = new Date().toISOString();
    const { error: err } = await supabase.from('product_stock').upsert(
      warehouses.map((w) => ({
        product_id: productId,
        warehouse_id: w.id,
        qty: qty[w.id] ?? 0,
        updated_at: now,
      })),
    );

    if (err) setError(err.message);
    else {
      await load();
      setSaved(true);
    }
    setSaving(false);
  };

  const total = warehouses.reduce((sum, w) => sum + (qty[w.id] ?? 0), 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-3">
      <div>
        <h3 className="text-xs font-semibold text-slate-900">Агуулахын үлдэгдэл</h3>
        <p className="text-[11px] text-slate-500">
          Нийт {total.toLocaleString('mn-MN')} {uom} — дэлгүүрт энэ тоогоор «Агуулахад бэлэн» гэж
          харагдана.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-[11px] text-rose-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-xs text-slate-400">Ачаалж байна…</p>
      ) : warehouses.length === 0 ? (
        <p className="text-xs text-slate-500">Идэвхтэй агуулах алга.</p>
      ) : (
        <div className="space-y-2">
          {warehouses.map((w) => (
            <div key={w.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-slate-900 truncate">{w.name}</div>
                <div className="text-[11px] text-slate-400 truncate">
                  {updatedAt[w.id]
                    ? `Шинэчилсэн: ${new Date(updatedAt[w.id]).toLocaleString('mn-MN')}`
                    : 'Хараахан бүртгээгүй'}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <input
                  type="number"
                  min={0}
                  step="0.001"
                  value={qty[w.id] ?? 0}
                  onChange={(e) => {
                    setSaved(false);
                    setQty({ ...qty, [w.id]: Number(e.target.value) });
                  }}
                  className="w-32 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-right outline-hidden focus:border-slate-900 tabular-nums"
                />
                <span className="text-[11px] text-slate-500 w-20">{uom}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        {saved && <span className="text-[11px] text-emerald-700 font-medium">Хадгалагдлаа</span>}
        <button
          type="button"
          onClick={save}
          disabled={saving || loading || warehouses.length === 0}
          className="btn-liquid-dark px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Үлдэгдэл хадгалах
        </button>
      </div>
    </div>
  );
};
