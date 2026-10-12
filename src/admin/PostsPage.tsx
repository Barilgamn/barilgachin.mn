import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { slugify, uniqueSlug } from '../lib/slug';
import type { PostRow } from '../types/db';
import { ImageField } from './ImageField';
import { ProductAdInserter } from './ProductAdInserter';
import { formatDate } from './orderLabels';

type Draft = Pick<
  PostRow,
  'title' | 'slug' | 'excerpt' | 'body' | 'cover_url' | 'author_name'
  | 'published_at' | 'is_published'
>;

const emptyDraft: Draft = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  cover_url: null,
  author_name: '',
  published_at: null,
  is_published: false,
};

/** timestamptz ↔ <input type="date"> хооронд хөрвүүлнэ. */
const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : '');
const fromDateInput = (v: string) => (v ? new Date(`${v}T00:00:00`).toISOString() : null);

export const PostsPage: React.FC = () => {
  const [rows, setRows] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else {
      setRows((data as PostRow[]) ?? []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.title.toLowerCase().includes(q));
  }, [rows, query]);

  /**
   * Зарын тэмдэглэгээг курсор зогсож байгаа байранд оруулна.
   *
   * Хэрэглэгч сонгогч рүү шилжихэд textarea фокусаа алддаг ч selectionStart
   * хэвээр үлддэг тул сүүлд зогссон байрлалыг олж чадна.
   */
  const insertIntoBody = (token: string) => {
    const el = bodyRef.current;
    const body = draft.body ?? '';
    const at = el ? el.selectionStart : body.length;

    const before = body.slice(0, at);
    const after = body.slice(at);

    // Тэмдэглэгээ өөрийн догол мөр дээрээ зогсох ёстой, гэхдээ байгаа хоосон
    // мөрүүд дээр нэмж давхарлахгүй.
    const gapBefore = before.trim() ? '\n\n'.slice(0, 2 - (/\n*$/.exec(before)?.[0].length ?? 0)) : '';
    const gapAfter = after.trim() ? '\n\n'.slice(0, 2 - (/^\n*/.exec(after)?.[0].length ?? 0)) : '';

    const inserted = gapBefore + token + gapAfter;
    const next = before + inserted + after;
    setDraft((d) => ({ ...d, body: next }));

    // React утгыг шинэчилсний дараа курсорыг оруулсан текстийн ард тавина.
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const caret = at + inserted.length;
      el.setSelectionRange(caret, caret);
    });
  };

  const startEdit = (row: PostRow) => {
    setEditingId(row.id);
    setDraft({
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt ?? '',
      body: row.body ?? '',
      cover_url: row.cover_url,
      author_name: row.author_name ?? '',
      published_at: row.published_at,
      is_published: row.is_published,
    });
  };

  const save = async () => {
    if (!draft.title.trim()) return;
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
      excerpt: draft.excerpt || null,
      body: draft.body || null,
      author_name: draft.author_name || null,
      // Нийтлэх гэж тэмдэглэсэн атлаа огноо тавиагүй бол өнөөдрөөр тавина.
      published_at:
        draft.is_published && !draft.published_at
          ? new Date().toISOString()
          : draft.published_at,
    };

    const { error: err } =
      editingId === 'new'
        ? await supabase.from('posts').insert(payload)
        : await supabase.from('posts').update(payload).eq('id', editingId);

    if (err) setError(err.message);
    else {
      setEditingId(null);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: PostRow) => {
    if (!confirm(`"${row.title}" мэдээг устгах уу?`)) return;
    const { error: err } = await supabase.from('posts').delete().eq('id', row.id);
    if (err) setError(err.message);
    else await load();
  };

  const field =
    'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-slate-900';
  const label = 'text-xs font-medium text-slate-600';

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-display">Мэдээ</h1>
          <p className="text-sm text-slate-500">
            {rows.length} мэдээ · {rows.filter((r) => r.is_published).length} нийтэлсэн
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Гарчгаар хайх"
              className="w-48 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-hidden focus:border-slate-900"
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
            Шинэ мэдээ
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      {editingId && (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px] items-start">
          {/* ─── Зүүн: бичих талбар ─── */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <label className="block">
              <span className={label}>Гарчиг</span>
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className={field}
              />
            </label>

            <label className="block">
              <span className={label}>
                Товч танилцуулга{' '}
                <span className="text-slate-400">(мэдээний картан дээр гарах 1-2 өгүүлбэр)</span>
              </span>
              <textarea
                rows={2}
                value={draft.excerpt ?? ''}
                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                className={field}
              />
            </label>

            <label className="block">
              <span className={label}>
                Мэдээний агуулга{' '}
                <span className="text-slate-400">(хоосон мөр = шинэ догол мөр)</span>
              </span>
              <textarea
                ref={bodyRef}
                rows={14}
                value={draft.body ?? ''}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                className={field}
              />
            </label>

            <ProductAdInserter onInsert={insertIntoBody} />
          </div>

          {/* ─── Баруун: нийтлэх тохиргоо ─── */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
              Нийтлэх тохиргоо
            </h2>

            <div>
              <label className="flex items-start gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.is_published}
                  onChange={(e) => setDraft({ ...draft, is_published: e.target.checked })}
                  className="mt-0.5"
                />
                <span>
                  <span className="font-semibold text-slate-900">
                    {draft.is_published ? 'Нийтэлсэн' : 'Ноорог'}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {draft.is_published
                      ? 'Сайт дээр харагдана.'
                      : 'Зөвхөн энд харагдана. Уншигчид хүрэхгүй.'}
                  </span>
                </span>
              </label>
            </div>

            <ImageField
              value={draft.cover_url}
              onChange={(url) => setDraft({ ...draft, cover_url: url })}
              folder="posts"
              label="Нүүр зураг"
              hint="Карт болон мэдээний дээр гарна. Өргөн хэлбэртэй, 5MB хүртэл."
            />

            <label className="block">
              <span className={label}>Нийтлэх огноо</span>
              <input
                type="date"
                value={toDateInput(draft.published_at)}
                onChange={(e) =>
                  setDraft({ ...draft, published_at: fromDateInput(e.target.value) })
                }
                className={field}
              />
              <span className="mt-1 block text-[11px] text-slate-400">
                Мэдээг эрэмбэлнэ. Хоосон бол нийтлэх үед өнөөдрөөр тавигдана.
              </span>
            </label>

            <label className="block">
              <span className={label}>Нийтлэгчийн нэр</span>
              <input
                value={draft.author_name ?? ''}
                onChange={(e) => setDraft({ ...draft, author_name: e.target.value })}
                className={field}
              />
              <span className="mt-1 block text-[11px] text-slate-400">
                Мэдээн дотор огнооны хажууд гарна.
              </span>
            </label>

            <label className="block">
              <span className={label}>Хаягийн нэр</span>
              <input
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder={slugify(draft.title)}
                className={`${field} font-mono`}
              />
              <span className="mt-1 block text-[11px] text-slate-400 break-all">
                /medee/{draft.slug || slugify(draft.title) || '…'}
                <br />
                Хоосон бол гарчгаас үүснэ. Нийтэлсний дараа солиход хуучин холбоос
                эвдэрнэ.
              </span>
            </label>

            <div className="flex gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="btn-liquid-glass flex-1 px-3 py-2 text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                Болих
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving || !draft.title.trim()}
                className="btn-liquid-dark flex-1 px-3 py-2 text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
              ? 'Мэдээ алга. «Шинэ мэдээ» дарж эхлүүлнэ үү.'
              : 'Хайлтад тохирох мэдээ олдсонгүй.'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-2.5 w-16" />
                <th className="text-left font-medium px-4 py-2.5">Гарчиг</th>
                <th className="text-left font-medium px-4 py-2.5">Огноо</th>
                <th className="text-left font-medium px-4 py-2.5">Төлөв</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-2">
                    <div className="h-9 w-14 overflow-hidden rounded border border-slate-200 bg-slate-50">
                      {row.cover_url && (
                        <img src={row.cover_url} alt="" className="h-full w-full object-cover" />
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
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                    {formatDate(row.published_at)}
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
