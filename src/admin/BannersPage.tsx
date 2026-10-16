import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BannerRow } from '../types/db';
import { ImageField } from './ImageField';
import { formatDate } from './orderLabels';

type Draft = Pick<
  BannerRow,
  'title' | 'image_url' | 'link_url' | 'starts_at' | 'ends_at' | 'sort_order' | 'is_published'
>;

const emptyDraft: Draft = {
  title: '',
  image_url: '',
  link_url: '',
  starts_at: null,
  ends_at: null,
  sort_order: 0,
  is_published: false,
};

const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : '');
const fromDateInput = (v: string) => (v ? new Date(`${v}T00:00:00`).toISOString() : null);

/** Нийтэлсэн бөгөөд огнооны хувьд яг одоо үйлчилж байгаа эсэх. */
const isLive = (b: BannerRow): boolean => {
  if (!b.is_published) return false;
  const now = Date.now();
  if (b.starts_at && new Date(b.starts_at).getTime() > now) return false;
  if (b.ends_at && new Date(b.ends_at).getTime() < now) return false;
  return true;
};

export const BannersPage: React.FC = () => {
  const [rows, setRows] = useState<BannerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('banners')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else {
      setRows((data as BannerRow[]) ?? []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const startEdit = (row: BannerRow) => {
    setEditingId(row.id);
    setDraft({
      title: row.title,
      image_url: row.image_url,
      link_url: row.link_url ?? '',
      starts_at: row.starts_at,
      ends_at: row.ends_at,
      sort_order: row.sort_order,
      is_published: row.is_published,
    });
  };

  const save = async () => {
    if (!draft.title.trim()) return;
    if (!draft.image_url) {
      setError('Баннерын зураг заавал хэрэгтэй.');
      return;
    }
    if (draft.starts_at && draft.ends_at && draft.ends_at < draft.starts_at) {
      setError('Дуусах огноо нь эхлэх огнооноос өмнө байж болохгүй.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = { ...draft, link_url: draft.link_url || null };
    const { error: err } =
      editingId === 'new'
        ? await supabase.from('banners').insert(payload)
        : await supabase.from('banners').update(payload).eq('id', editingId);

    if (err) setError(err.message);
    else {
      setEditingId(null);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: BannerRow) => {
    if (!confirm(`"${row.title}" баннерыг устгах уу?`)) return;
    const { error: err } = await supabase.from('banners').delete().eq('id', row.id);
    if (err) setError(err.message);
    else await load();
  };

  const field =
    'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-slate-900';
  const label = 'text-xs font-medium text-slate-600';
  const live = rows.filter(isLive);

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-display">Сурталчилгаа</h1>
          <p className="text-sm text-slate-500">
            {rows.length} баннер · {live.length} идэвхтэй
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
          Шинэ баннер
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Толгойн доор гарна. Эхлээд намхан зурвас байж, хулгана очиход бүтнээрээ
        дэлгэгдэнэ. Хэд хэдэн идэвхтэй баннер байвал эрэмбээрээ эхнийх нь гарна.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      {editingId && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <label className="block">
            <span className={label}>
              Нэр <span className="text-slate-400">(зөвхөн админд харагдана)</span>
            </span>
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Намрын урамшуулал"
              className={field}
            />
          </label>

          <ImageField
            value={draft.image_url || null}
            onChange={(url) => setDraft({ ...draft, image_url: url ?? '' })}
            folder="banners"
            label="Баннерын зураг"
            hint="Өргөн хэлбэртэй зураг тохиромжтой (жишээ нь 1920×730). 5MB хүртэл."
          />

          <label className="block">
            <span className={label}>
              Дарахад очих хаяг <span className="text-slate-400">(хоосон бол дарагдахгүй)</span>
            </span>
            <input
              value={draft.link_url ?? ''}
              onChange={(e) => setDraft({ ...draft, link_url: e.target.value })}
              placeholder="/medee/… эсвэл https://…"
              className={`${field} font-mono`}
            />
          </label>

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
                Эрэмбэ <span className="text-slate-400">(бага нь эхэнд)</span>
              </span>
              <input
                type="number"
                value={draft.sort_order}
                onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                className={`${field} tabular-nums`}
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
            Баннер алга. «Шинэ баннер» дарж эхлүүлнэ үү.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-2.5 w-28" />
                <th className="text-left font-medium px-4 py-2.5">Нэр</th>
                <th className="text-left font-medium px-4 py-2.5">Хугацаа</th>
                <th className="text-right font-medium px-4 py-2.5">Эрэмбэ</th>
                <th className="text-left font-medium px-4 py-2.5">Төлөв</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-2">
                    <div className="h-10 w-24 overflow-hidden rounded border border-slate-200 bg-slate-50">
                      <img src={row.image_url} alt="" className="h-full w-full object-cover" />
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
                    {row.link_url && (
                      <div className="font-mono text-[11px] text-slate-400">{row.link_url}</div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                    {row.starts_at || row.ends_at
                      ? `${formatDate(row.starts_at)} — ${formatDate(row.ends_at)}`
                      : 'Хугацаагүй'}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-600">
                    {row.sort_order}
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
