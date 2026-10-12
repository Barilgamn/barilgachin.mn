import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ProductImageRow } from '../types/db';

const BUCKET = 'media';
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Манай bucket дотор байгаа зургийн замыг URL-аас салгаж авна.
 *
 * Seed-ээр орж ирсэн гадны зургууд (Pexels гэх мэт) null буцаана — тэдгээрийг
 * устгахад зөвхөн хүснэгтийн мөр нь арилна, Storage-д хүрэхгүй.
 */
const storagePath = (url: string): string | null => {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const at = url.indexOf(marker);
  return at === -1 ? null : decodeURIComponent(url.slice(at + marker.length));
};

const extensionOf = (file: File): string => {
  const fromName = file.name.split('.').pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return (file.type.split('/')[1] ?? 'jpg').toLowerCase();
};

interface ProductImagesProps {
  productId: string;
  /** alt текстийг автоматаар бөглөхөд ашиглана. */
  productName: string;
}

export const ProductImages: React.FC<ProductImagesProps> = ({ productId, productName }) => {
  const [images, setImages] = useState<ProductImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order');
    if (err) setError(err.message);
    else {
      setImages((data as ProductImageRow[]) ?? []);
      setError(null);
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Дарааллыг 0..n-1 болгож шинэчилнэ. */
  const persistOrder = async (next: ProductImageRow[]) => {
    const { error: err } = await supabase.from('product_images').upsert(
      next.map((img, i) => ({
        id: img.id,
        product_id: img.product_id,
        url: img.url,
        alt: img.alt,
        sort_order: i,
      })),
    );
    if (err) {
      setError(err.message);
      await load();
    } else {
      setImages(next.map((img, i) => ({ ...img, sort_order: i })));
    }
  };

  const upload = async (files: FileList) => {
    setBusy(true);
    setError(null);

    const problems: string[] = [];
    let added = 0;
    let nextOrder = images.length;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        problems.push(`${file.name}: зураг биш байна`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        problems.push(`${file.name}: 5MB-аас том байна`);
        continue;
      }

      const path = `products/${productId}/${crypto.randomUUID()}.${extensionOf(file)}`;
      const up = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (up.error) {
        problems.push(`${file.name}: ${up.error.message}`);
        continue;
      }

      const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      const ins = await supabase.from('product_images').insert({
        product_id: productId,
        url,
        alt: productName || null,
        sort_order: nextOrder,
      });
      if (ins.error) {
        // Мөр нь үүсээгүй тул файлыг үлдээх нь утгагүй — буцааж цэвэрлэнэ.
        await supabase.storage.from(BUCKET).remove([path]);
        problems.push(`${file.name}: ${ins.error.message}`);
        continue;
      }

      nextOrder += 1;
      added += 1;
    }

    if (problems.length) {
      setError(
        added > 0
          ? `${added} зураг орлоо. Оролгүй үлдсэн: ${problems.join('; ')}`
          : problems.join('; '),
      );
    }
    if (added > 0) await load();
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const remove = async (img: ProductImageRow) => {
    if (!confirm('Энэ зургийг устгах уу?')) return;
    setBusy(true);
    setError(null);

    const { error: err } = await supabase.from('product_images').delete().eq('id', img.id);
    if (err) {
      setError(err.message);
      setBusy(false);
      return;
    }

    const path = storagePath(img.url);
    if (path) await supabase.storage.from(BUCKET).remove([path]);

    const next = images.filter((i) => i.id !== img.id);
    await persistOrder(next);
    setBusy(false);
  };

  const move = async (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setBusy(true);
    await persistOrder(next);
    setBusy(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold text-slate-900">Зураг</h3>
          <p className="text-[11px] text-slate-500">
            Эхний зураг нь дэлгүүр дээр үндсэн зураг болж харагдана.
          </p>
        </div>

        <label
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
            busy
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'btn-liquid-dark cursor-pointer'
          }`}
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
          <span>Зураг нэмэх</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            disabled={busy}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) void upload(e.target.files);
            }}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-[11px] text-rose-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-xs text-slate-400">Ачаалж байна…</p>
      ) : images.length === 0 ? (
        <p className="text-xs text-slate-500">
          Зураг алга. JPG, PNG, WebP — нэг файл 5MB хүртэл.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="w-28 rounded-lg border border-slate-200 bg-white overflow-hidden"
            >
              <div className="relative aspect-square bg-slate-100">
                <img
                  src={img.url}
                  alt={img.alt ?? ''}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
                {i === 0 && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-bold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    Үндсэн
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between px-1 py-1">
                <div className="flex">
                  <button
                    type="button"
                    disabled={busy || i === 0}
                    onClick={() => void move(i, i - 1)}
                    title="Урагш"
                    className="p-1 rounded text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={busy || i === images.length - 1}
                    onClick={() => void move(i, i + 1)}
                    title="Хойш"
                    className="p-1 rounded text-slate-400 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void remove(img)}
                  title="Устгах"
                  className="p-1 rounded text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
