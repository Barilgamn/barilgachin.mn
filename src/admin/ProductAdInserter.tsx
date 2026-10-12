import React, { useEffect, useState } from 'react';
import { Plus, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CategoryRow, ProductRow } from '../types/db';

interface ProductAdInserterProps {
  /** Тэмдэглэгээг курсорын байрлалд оруулна. */
  onInsert: (token: string) => void;
}

/**
 * Мэдээний агуулгад `[бараа ...]` тэмдэглэгээ оруулах туслах.
 * Админ тэмдэглэгээний бичиглэлийг цээжлэх шаардлагагүй.
 */
export const ProductAdInserter: React.FC<ProductAdInserterProps> = ({ onInsert }) => {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [products, setProducts] = useState<Pick<ProductRow, 'id' | 'sku' | 'name'>[]>([]);
  const [mode, setMode] = useState<'category' | 'picked'>('category');
  const [categorySlug, setCategorySlug] = useState('');
  const [limit, setLimit] = useState(4);
  const [skus, setSkus] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      const [cats, prods] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('id,sku,name').order('name'),
      ]);
      setCategories((cats.data as CategoryRow[]) ?? []);
      setProducts(
        (prods.data as Pick<ProductRow, 'id' | 'sku' | 'name'>[]) ?? [],
      );
    })();
  }, []);

  const toggleSku = (sku: string) =>
    setSkus((prev) =>
      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku],
    );

  const insert = () => {
    const token =
      mode === 'picked'
        ? `[бараа sku=${skus.join(',')}]`
        : `[бараа ангилал=${categorySlug} тоо=${limit}]`;
    onInsert(`\n\n${token}\n\n`);
    setSkus([]);
  };

  const disabled = mode === 'picked' ? skus.length === 0 : !categorySlug;
  const select =
    'w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-hidden focus:border-slate-900';

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2.5">
      <div>
        <h3 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
          Агуулгад бараа оруулах
        </h3>
        <p className="text-[11px] text-slate-500">
          Текстийн төгсгөлд нэмнэ. Дараа нь хүссэн байрлал руу нь зөөж болно.
        </p>
      </div>

      <div className="flex gap-1.5">
        {([
          ['category', 'Ангиллаар'],
          ['picked', 'Сонгож'],
        ] as const).map(([value, text]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer ${
              mode === value
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      {mode === 'category' ? (
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className={select}
          >
            <option value="">— ангилал сонгох —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-[11px] text-slate-600">
            Тоо
            <input
              type="number"
              min={1}
              max={12}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-14 rounded-lg border border-slate-200 px-2 py-1.5 text-xs tabular-nums outline-hidden focus:border-slate-900"
            />
          </label>
        </div>
      ) : (
        <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 space-y-1">
          {products.map((p) => (
            <label
              key={p.id}
              className="flex items-start gap-2 text-[11px] text-slate-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={skus.includes(p.sku)}
                onChange={() => toggleSku(p.sku)}
                className="mt-0.5"
              />
              <span className="min-w-0">
                {p.name}
                <span className="ml-1 font-mono text-slate-400">{p.sku}</span>
              </span>
            </label>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">
          {mode === 'picked' ? `${skus.length} бараа сонгосон` : 'Ангиллын эхний барааг авна'}
        </span>
        <button
          type="button"
          onClick={insert}
          disabled={disabled}
          className="btn-liquid-dark px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Оруулах
        </button>
      </div>
    </div>
  );
};
