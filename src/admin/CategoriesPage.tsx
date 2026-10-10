import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Save, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { slugify, uniqueSlug } from '../lib/slug';
import type { CategoryRow } from '../types/db';

type Draft = Pick<
  CategoryRow,
  'name' | 'slug' | 'description' | 'sort_order' | 'is_published'
>;

const emptyDraft: Draft = {
  name: '',
  slug: '',
  description: '',
  sort_order: 0,
  is_published: true,
};

export const CategoriesPage: React.FC = () => {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .order('name');
    if (err) setError(err.message);
    else {
      setRows((data as CategoryRow[]) ?? []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const startNew = () => {
    setEditingId('new');
    setDraft(emptyDraft);
  };

  const startEdit = (row: CategoryRow) => {
    setEditingId(row.id);
    setDraft({
      name: row.name,
      slug: row.slug,
      description: row.description ?? '',
      sort_order: row.sort_order,
      is_published: row.is_published,
    });
  };

  const save = async () => {
    if (!draft.name.trim()) return;
    setSaving(true);
    setError(null);

    // Slug хоосон бол нэрнээс үүсгэж, давхардлаас сэргийлнэ.
    const slug =
      draft.slug.trim() ||
      uniqueSlug(
        slugify(draft.name),
        rows.filter((r) => r.id !== editingId).map((r) => r.slug),
      );

    const payload = { ...draft, slug, description: draft.description || null };

    const { error: err } =
      editingId === 'new'
        ? await supabase.from('categories').insert(payload)
        : await supabase.from('categories').update(payload).eq('id', editingId);

    if (err) setError(err.message);
    else {
      setEditingId(null);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: CategoryRow) => {
    if (!confirm(`"${row.name}" ангиллыг устгах уу?`)) return;
    const { error: err } = await supabase.from('categories').delete().eq('id', row.id);
    if (err) setError(err.message);
    else await load();
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display">Ангилал</h1>
          <p className="text-sm text-slate-500">{rows.length} ангилал</p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="btn-liquid-dark px-3.5 py-2 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Шинэ ангилал
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      {editingId && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Нэр</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-slate-900"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600">
                Slug <span className="text-slate-400">(хоосон бол нэрнээс үүснэ)</span>
              </span>
              <input
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder={slugify(draft.name)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-hidden focus:border-slate-900"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-slate-600">Тайлбар</span>
            <textarea
              rows={2}
              value={draft.description ?? ''}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-slate-900"
            />
          </label>

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
                disabled={saving || !draft.name.trim()}
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
            Ангилал алга. «Шинэ ангилал» дарж эхлүүлнэ үү.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Нэр</th>
                <th className="text-left font-medium px-4 py-2.5">Slug</th>
                <th className="text-right font-medium px-4 py-2.5">Эрэмбэ</th>
                <th className="text-left font-medium px-4 py-2.5">Төлөв</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      className="font-medium text-slate-900 hover:text-amber-600 cursor-pointer"
                    >
                      {row.name}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{row.slug}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-500">
                    {row.sort_order}
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
