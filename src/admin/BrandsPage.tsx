import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { slugify, uniqueSlug } from '../lib/slug';
import type { BrandRow, ProductRow } from '../types/db';

type Draft = Pick<
  BrandRow,
  'name' | 'short_code' | 'slug' | 'country' | 'sort_order' | 'is_published'
>;

const emptyDraft: Draft = {
  name: '',
  short_code: '',
  slug: '',
  country: '',
  sort_order: 0,
  is_published: true,
};

export const BrandsPage: React.FC = () => {
  const [rows, setRows] = useState<BrandRow[]>([]);
  const [products, setProducts] = useState<Pick<ProductRow, 'id' | 'brand_id'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [brands, prods] = await Promise.all([
      supabase.from('brands').select('*').order('sort_order').order('name'),
      supabase.from('products').select('id,brand_id'),
    ]);
    if (brands.error) setError(brands.error.message);
    else {
      setRows((brands.data as BrandRow[]) ?? []);
      setError(null);
    }
    setProducts((prods.data as Pick<ProductRow, 'id' | 'brand_id'>[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  /** Брэнд бүрт хэдэн бараа холбогдсоныг тоолно. */
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of products) {
      if (p.brand_id) m.set(p.brand_id, (m.get(p.brand_id) ?? 0) + 1);
    }
    return m;
  }, [products]);

  const startEdit = (row: BrandRow) => {
    setEditingId(row.id);
    setDraft({
      name: row.name,
      short_code: row.short_code,
      slug: row.slug,
      country: row.country ?? '',
      sort_order: row.sort_order,
      is_published: row.is_published,
    });
  };

  const save = async () => {
    if (!draft.name.trim() || !draft.short_code.trim()) return;
    setSaving(true);
    setError(null);

    const slug =
      draft.slug.trim() ||
      uniqueSlug(
        slugify(draft.name),
        rows.filter((r) => r.id !== editingId).map((r) => r.slug),
      );

    const payload = { ...draft, slug, country: draft.country || null };

    const { error: err } =
      editingId === 'new'
        ? await supabase.from('brands').insert(payload)
        : await supabase.from('brands').update(payload).eq('id', editingId);

    if (err) setError(err.message);
    else {
      setEditingId(null);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: BrandRow) => {
    const used = counts.get(row.id) ?? 0;
    // products.brand_id нь "on delete set null" тул бараа устахгүй, зөвхөн сална.
    const warning = used
      ? `"${row.name}" брэндийг устгах уу?\n\n${used} бараа энэ брэндтэй холбоотой. Бараа устахгүй, гэхдээ брэндгүй болно.`
      : `"${row.name}" брэндийг устгах уу?`;
    if (!confirm(warning)) return;

    const { error: err } = await supabase.from('brands').delete().eq('id', row.id);
    if (err) setError(err.message);
    else await load();
  };

  const field =
    'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-slate-900';
  const label = 'text-xs font-medium text-slate-600';

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display">Брэнд</h1>
          <p className="text-sm text-slate-500">{rows.length} брэнд</p>
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
          Шинэ брэнд
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      {editingId && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block sm:col-span-2">
              <span className={label}>Нэр</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className={field}
              />
            </label>
            <label className="block">
              <span className={label}>
                Богино код <span className="text-slate-400">(картан дээр)</span>
              </span>
              <input
                value={draft.short_code}
                onChange={(e) => setDraft({ ...draft, short_code: e.target.value })}
                placeholder="MAK"
                className={`${field} font-mono`}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={label}>
                Товч тайлбар <span className="text-slate-400">(улс, чиглэл)</span>
              </span>
              <input
                value={draft.country ?? ''}
                onChange={(e) => setDraft({ ...draft, country: e.target.value })}
                placeholder="Герман гипс"
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

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              Эрэмбэ
              <input
                type="number"
                value={draft.sort_order}
                onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm tabular-nums outline-hidden focus:border-slate-900"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.is_published}
                onChange={(e) => setDraft({ ...draft, is_published: e.target.checked })}
              />
              Нийтлэх
            </label>

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
                disabled={saving || !draft.name.trim() || !draft.short_code.trim()}
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
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            Брэнд алга. «Шинэ брэнд» дарж эхлүүлнэ үү.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Код</th>
                <th className="text-left font-medium px-4 py-2.5">Нэр</th>
                <th className="text-left font-medium px-4 py-2.5">Тайлбар</th>
                <th className="text-right font-medium px-4 py-2.5">Бараа</th>
                <th className="text-left font-medium px-4 py-2.5">Төлөв</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">
                    {row.short_code}
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      className="font-medium text-slate-900 hover:text-amber-600 text-left cursor-pointer"
                    >
                      {row.name}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{row.country ?? '—'}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-600">
                    {counts.get(row.id) ?? 0}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        row.is_published
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {row.is_published ? 'Нийтэлсэн' : 'Нуусан'}
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
