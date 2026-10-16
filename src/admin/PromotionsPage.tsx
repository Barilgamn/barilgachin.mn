import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { slugify, uniqueSlug } from '../lib/slug';
import type { PromotionRow } from '../types/db';
import { ImageField } from './ImageField';
import { formatDate } from './orderLabels';

type Draft = Pick<
  PromotionRow,
  'title' | 'slug' | 'description' | 'banner_url' | 'discount_note'
  | 'starts_at' | 'ends_at' | 'is_published'
>;

const emptyDraft: Draft = {
  title: '',
  slug: '',
  description: '',
  banner_url: null,
  discount_note: '',
  starts_at: null,
  ends_at: null,
  is_published: false,
};

const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : '');
const fromDateInput = (v: string) => (v ? new Date(`${v}T00:00:00`).toISOString() : null);

/** Нийтлэгдсэн бөгөөд огнооны хувьд яг одоо үйлчилж байгаа эсэх. */
const isLive = (p: PromotionRow): boolean => {
  if (!p.is_published) return false;
  const now = Date.now();
  if (p.starts_at && new Date(p.starts_at).getTime() > now) return false;
  if (p.ends_at && new Date(p.ends_at).getTime() < now) return false;
  return true;
};

export const PromotionsPage: React.FC = () => {
  const [rows, setRows] = useState<PromotionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('promotions')
      .select('*')
      .order('starts_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else {
      setRows((data as PromotionRow[]) ?? []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const startEdit = (row: PromotionRow) => {
    setEditingId(row.id);
    setDraft({
      title: row.title,
      slug: row.slug,
      description: row.description ?? '',
      banner_url: row.banner_url,
      discount_note: row.discount_note ?? '',
      starts_at: row.starts_at,
      ends_at: row.ends_at,
      is_published: row.is_published,
    });
  };

  const save = async () => {
    if (!draft.title.trim()) return;
    if (draft.starts_at && draft.ends_at && draft.ends_at < draft.starts_at) {
      setError('Дуусах огноо нь эхлэх огнооноос өмнө байж болохгүй.');
      return;
    }

    setSaving(true);
    setError(null);

    const slug =
      draft.slug.trim() ||
      uniqueSlug(
        slugify(draft.title),
        rows.filter((r) => r.id !== editingId).map((r) => r.slug),
      );

    const payload = {
      ...draft,
      slug,
      description: draft.description || null,
      discount_note: draft.discount_note || null,
    };

    const { error: err } =
      editingId === 'new'
        ? await supabase.from('promotions').insert(payload)
        : await supabase.from('promotions').update(payload).eq('id', editingId);

    if (err) setError(err.message);
    else {
      setEditingId(null);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: PromotionRow) => {
    if (!confirm(`"${row.title}" урамшууллыг устгах уу?`)) return;
    const { error: err } = await supabase.from('promotions').delete().eq('id', row.id);
    if (err) setError(err.message);
    else await load();
  };

  const field =
    'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-slate-900';
  const label = 'text-xs font-medium text-slate-600';

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-display">Хямдрал</h1>
          <p className="text-sm text-slate-500">
            {rows.length} урамшуулал · {rows.filter(isLive).length} идэвхтэй
          </p>
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
          Шинэ урамшуулал
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      {editingId && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block sm:col-span-2">
              <span className={label}>Гарчиг</span>
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Цементийн хаврын хямдрал"
                className={field}
              />
            </label>
            <label className="block">
              <span className={label}>
                Хямдралын тэмдэглэгээ <span className="text-slate-400">(баннер дээр)</span>
              </span>
              <input
                value={draft.discount_note ?? ''}
                onChange={(e) => setDraft({ ...draft, discount_note: e.target.value })}
                placeholder="15% хүртэл"
                className={field}
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

          <ImageField
            value={draft.banner_url}
            onChange={(url) => setDraft({ ...draft, banner_url: url })}
            folder="promotions"
            label="Баннер"
            hint="Нүүр хуудасны урамшууллын хэсэгт гарна. 5MB хүртэл."
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className={label}>Эхлэх</span>
              <input
                type="date"
                value={toDateInput(draft.starts_at)}
                onChange={(e) => setDraft({ ...draft, starts_at: fromDateInput(e.target.value) })}
                className={field}
              />
            </label>
            <label className="block">
              <span className={label}>Дуусах</span>
              <input
                type="date"
                value={toDateInput(draft.ends_at)}
                onChange={(e) => setDraft({ ...draft, ends_at: fromDateInput(e.target.value) })}
                className={field}
              />
            </label>
            <label className="block">
              <span className={label}>
                Slug <span className="text-slate-400">(хоосон бол гарчгаас)</span>
              </span>
              <input
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder={slugify(draft.title)}
                className={`${field} font-mono`}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.is_published}
                onChange={(e) => setDraft({ ...draft, is_published: e.target.checked })}
              />
              Нийтлэх
            </label>
            <span className="text-[11px] text-slate-400">
              Огноо тавиагүй бол хугацаагүй үргэлжилнэ.
            </span>

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
                disabled={saving || !draft.title.trim()}
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
            Урамшуулал алга. «Шинэ урамшуулал» дарж эхлүүлнэ үү.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-2.5 w-16" />
                <th className="text-left font-medium px-4 py-2.5">Гарчиг</th>
                <th className="text-left font-medium px-4 py-2.5">Хугацаа</th>
                <th className="text-left font-medium px-4 py-2.5">Төлөв</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-2">
                    <div className="h-9 w-14 overflow-hidden rounded border border-slate-200 bg-slate-50">
                      {row.banner_url && (
                        <img src={row.banner_url} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      className="font-medium text-slate-900 hover:text-amber-600 text-left cursor-pointer"
                    >
                      {row.title}
                    </button>
                    {row.discount_note && (
                      <div className="text-[11px] text-amber-700">{row.discount_note}</div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                    {row.starts_at || row.ends_at
                      ? `${formatDate(row.starts_at)} — ${formatDate(row.ends_at)}`
                      : 'Хугацаагүй'}
                  </td>
                  <td className="px-4 py-2.5">
                    {isLive(row) ? (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        Идэвхтэй
                      </span>
                    ) : row.is_published ? (
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        Хугацаанаас гадуур
                      </span>
                    ) : (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        Ноорог
                      </span>
                    )}
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
