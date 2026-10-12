import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Save, X, Loader2, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { slugify, uniqueSlug } from '../lib/slug';
import type { BrandRow, CategoryRow, ProductRow } from '../types/db';
import { ProductImages } from './ProductImages';
import { ProductTiers } from './ProductTiers';
import { ProductStock } from './ProductStock';

const UOMS = [
  'ширхэг', 'шуудай 50кг', 'шуудай 25кг', 'тн', 'м²', 'м³', 'у/м',
  'палет', 'хайрцаг', 'боодол', 'литр', 'хувин 20л',
];

type Draft = Pick<
  ProductRow,
  | 'sku' | 'name' | 'mongolian_name' | 'slug' | 'category_id' | 'brand_id' | 'subcategory'
  | 'price' | 'original_price' | 'uom' | 'weight_kg' | 'description'
  | 'mns_standard' | 'is_mns_certified' | 'is_featured' | 'is_published'
>;

const emptyDraft: Draft = {
  sku: '',
  name: '',
  mongolian_name: '',
  slug: '',
  category_id: null,
  brand_id: null,
  subcategory: '',
  price: 0,
  original_price: null,
  uom: 'ширхэг',
  weight_kg: 0,
  description: '',
  mns_standard: '',
  is_mns_certified: false,
  is_featured: false,
  is_published: false,
};

export const ProductsPage: React.FC = () => {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [products, cats, brandRows] = await Promise.all([
      supabase.from('products').select('*').order('sort_order').order('name'),
      supabase.from('categories').select('*').order('name'),
      supabase.from('brands').select('*').order('name'),
    ]);
    if (products.error) setError(products.error.message);
    else {
      setRows((products.data as ProductRow[]) ?? []);
      setError(null);
    }
    setCategories((cats.data as CategoryRow[]) ?? []);
    setBrands((brandRows.data as BrandRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q),
    );
  }, [rows, query]);

  const categoryName = (id: string | null) =>
    categories.find((c) => c.id === id)?.name ?? '—';

  const startEdit = (row: ProductRow) => {
    setEditingId(row.id);
    setDraft({
      sku: row.sku,
      name: row.name,
      mongolian_name: row.mongolian_name ?? '',
      slug: row.slug,
      category_id: row.category_id,
      brand_id: row.brand_id,
      subcategory: row.subcategory ?? '',
      price: row.price,
      original_price: row.original_price,
      uom: row.uom,
      weight_kg: row.weight_kg,
      description: row.description ?? '',
      mns_standard: row.mns_standard ?? '',
      is_mns_certified: row.is_mns_certified,
      is_featured: row.is_featured,
      is_published: row.is_published,
    });
  };

  const save = async () => {
    if (!draft.name.trim() || !draft.sku.trim()) return;
    setSaving(true);
    setError(null);

    const slug =
      draft.slug.trim() ||
      uniqueSlug(
        slugify(draft.name),
        rows.filter((r) => r.id !== editingId).map((r) => r.slug),
      );

    const payload = {
      ...draft,
      slug,
      mongolian_name: draft.mongolian_name || null,
      subcategory: draft.subcategory || null,
      description: draft.description || null,
      mns_standard: draft.mns_standard || null,
      original_price: draft.original_price || null,
    };

    const { error: err } =
      editingId === 'new'
        ? await supabase.from('products').insert(payload)
        : await supabase.from('products').update(payload).eq('id', editingId);

    if (err) setError(err.message);
    else {
      setEditingId(null);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: ProductRow) => {
    if (!confirm(`"${row.name}" барааг устгах уу?`)) return;
    const { error: err } = await supabase.from('products').delete().eq('id', row.id);
    if (err) setError(err.message);
    else await load();
  };

  const field = 'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-slate-900';
  const label = 'text-xs font-medium text-slate-600';

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-display">Бараа</h1>
          <p className="text-sm text-slate-500">{rows.length} бараа</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Нэр, SKU-гаар хайх"
              className="w-56 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-hidden focus:border-slate-900"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingId('new');
              setDraft(emptyDraft);
            }}
            className="btn-liquid-dark px-3.5 py-2 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Шинэ бараа
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      {editingId && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className={label}>SKU / код</span>
              <input
                value={draft.sku}
                onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
                className={`${field} font-mono`}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={label}>Нэр</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className={field}
              />
            </label>
          </div>

          <label className="block">
            <span className={label}>Дэлгэрэнгүй нэр</span>
            <input
              value={draft.mongolian_name ?? ''}
              onChange={(e) => setDraft({ ...draft, mongolian_name: e.target.value })}
              className={field}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className={label}>Ангилал</span>
              <select
                value={draft.category_id ?? ''}
                onChange={(e) => setDraft({ ...draft, category_id: e.target.value || null })}
                className={field}
              >
                <option value="">— сонгоогүй —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={label}>Брэнд</span>
              <select
                value={draft.brand_id ?? ''}
                onChange={(e) => setDraft({ ...draft, brand_id: e.target.value || null })}
                className={field}
              >
                <option value="">— сонгоогүй —</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={label}>Дэд ангилал</span>
              <input
                value={draft.subcategory ?? ''}
                onChange={(e) => setDraft({ ...draft, subcategory: e.target.value })}
                placeholder="Портланд цемент"
                className={field}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <label className="block">
              <span className={label}>Үнэ (₮)</span>
              <input
                type="number"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                className={`${field} tabular-nums`}
              />
            </label>
            <label className="block">
              <span className={label}>Хуучин үнэ (₮)</span>
              <input
                type="number"
                value={draft.original_price ?? ''}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    original_price: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className={`${field} tabular-nums`}
              />
            </label>
            <label className="block">
              <span className={label}>Хэмжих нэгж</span>
              <select
                value={draft.uom}
                onChange={(e) => setDraft({ ...draft, uom: e.target.value })}
                className={field}
              >
                {UOMS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={label}>Жин (кг)</span>
              <input
                type="number"
                step="0.001"
                value={draft.weight_kg}
                onChange={(e) => setDraft({ ...draft, weight_kg: Number(e.target.value) })}
                className={`${field} tabular-nums`}
              />
            </label>
          </div>

          <label className="block">
            <span className={label}>Тайлбар</span>
            <textarea
              rows={3}
              value={draft.description ?? ''}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className={field}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={label}>MNS стандарт</span>
              <input
                value={draft.mns_standard ?? ''}
                onChange={(e) => setDraft({ ...draft, mns_standard: e.target.value })}
                placeholder="MNS 974:2008"
                className={field}
              />
            </label>
            <label className="block">
              <span className={label}>
                Slug <span className="text-slate-400">(хоосон бол нэрнээс)</span>
              </span>
              <input
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder={slugify(draft.name)}
                className={`${field} font-mono`}
              />
            </label>
          </div>

          {editingId === 'new' ? (
            <p className="text-[11px] text-slate-400">
              Зураг, бөөний үнэ, үлдэгдлийг нэмэхийн тулд эхлээд барааг хадгална уу.
            </p>
          ) : (
            <div className="space-y-3">
              <ProductImages productId={editingId} productName={draft.name} />
              <ProductTiers
                productId={editingId}
                basePrice={draft.price}
                uom={draft.uom}
              />
              <ProductStock productId={editingId} uom={draft.uom} />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-1">
            {([
              ['is_mns_certified', 'MNS баталгаатай'],
              ['is_featured', 'Онцлох'],
              ['is_published', 'Нийтлэх'],
            ] as const).map(([key, text]) => (
              <label key={key} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft[key]}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.checked })}
                />
                {text}
              </label>
            ))}

            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="btn-liquid-glass px-3 py-2 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                Болих
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving || !draft.name.trim() || !draft.sku.trim()}
                className="btn-liquid-dark px-3.5 py-2 text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Хадгалах
              </button>
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
              ? 'Бараа алга. «Шинэ бараа» дарж эхлүүлнэ үү.'
              : 'Хайлтад тохирох бараа олдсонгүй.'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">SKU</th>
                <th className="text-left font-medium px-4 py-2.5">Нэр</th>
                <th className="text-left font-medium px-4 py-2.5">Ангилал</th>
                <th className="text-right font-medium px-4 py-2.5">Үнэ</th>
                <th className="text-left font-medium px-4 py-2.5">Төлөв</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{row.sku}</td>
                  <td className="px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      className="font-medium text-slate-900 hover:text-amber-600 text-left cursor-pointer"
                    >
                      {row.name}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{categoryName(row.category_id)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {row.price.toLocaleString('mn-MN')}₮
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        row.is_published
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {row.is_published ? 'Нийтэлсэн' : 'Ноорог'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
