import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const BUCKET = 'media';
const MAX_BYTES = 5 * 1024 * 1024;

/** Манай bucket доторх зам. Гаднын URL бол null. */
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

interface ImageFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
  /** media bucket доторх хавтас, жишээ нь "posts". */
  folder: string;
  label: string;
  hint?: string;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  value,
  onChange,
  folder,
  label,
  hint,
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Зураг биш файл байна.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Файл 5MB-аас том байна.');
      return;
    }

    setBusy(true);
    const path = `${folder}/${crypto.randomUUID()}.${extensionOf(file)}`;
    const up = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (up.error) {
      setError(up.error.message);
      setBusy(false);
      return;
    }

    // Өмнөх зураг манайх байсан бол сольсны дараа үлдээх утгагүй.
    if (value) {
      const old = storagePath(value);
      if (old) await supabase.storage.from(BUCKET).remove([old]);
    }

    onChange(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const clear = async () => {
    if (!value) return;
    setBusy(true);
    const path = storagePath(value);
    if (path) await supabase.storage.from(BUCKET).remove([path]);
    onChange(null);
    setBusy(false);
  };

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-slate-600">{label}</span>

      <div className="flex items-start gap-3">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-[10px] text-slate-400">
              Зураггүй
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 ${
                busy
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'border border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
              }`}
            >
              {busy ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImagePlus className="w-3.5 h-3.5" />
              )}
              {value ? 'Солих' : 'Зураг нэмэх'}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                disabled={busy}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void upload(f);
                }}
              />
            </label>

            {value && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void clear()}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 disabled:opacity-40 cursor-pointer"
                title="Устгах"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
          {error && (
            <p role="alert" className="text-[11px] text-rose-700">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
