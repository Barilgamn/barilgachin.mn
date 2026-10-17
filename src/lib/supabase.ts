import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client.
 *
 * Anon key нь нийтэд нээлттэй байхад асуудалгүй — өгөгдлийн хамгаалалт
 * бүхэлдээ Postgres дээрх RLS бодлогоор хийгдэнэ (supabase/migrations).
 * Service role key-г энд хэзээ ч оруулахгүй: VITE_* хувьсагч build үед
 * хөтчийн багцад шигддэг.
 */

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const url = rawUrl?.trim();
const anonKey = rawKey?.trim();

/**
 * Түлхүүр нь HTTP толгойд орох тул зөвхөн latin-1 тэмдэгт агуулж болно.
 * Тохиргоо хуулах үед тайлбар, кирилл үсэг санамсаргүй орвол хөтөч
 * «String contains non ISO-8859-1 code point» гэж шалтгааныг нь хэлэлгүй
 * унадаг — иймд эндээс нь барина.
 */
const isHeaderSafe = (v: string | undefined): boolean =>
  Boolean(v) && /^[\x20-\x7E]+$/.test(v as string);

/** Тохиргоо бүрэн, ашиглахад тохиромжтой эсэх. */
export const isSupabaseConfigured = isHeaderSafe(url) && isHeaderSafe(anonKey);

if (url && anonKey && !isSupabaseConfigured) {
  console.error(
    'Supabase тохиргоонд латин бус тэмдэгт орсон байна. VITE_SUPABASE_URL, ' +
      'VITE_SUPABASE_ANON_KEY-г тайлбаргүй, цэвэр утгаар нь дахин оруулна уу.',
  );
}

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    'Supabase тохируулаагүй байна. .env дотор VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY-г бөглөнө үү.',
  );
}

// Тохиргоо бүрэн биш бол орлуулагч утгаар үүсгэнэ. Бохир утгыг дамжуулбал
// хөтөч толгой угсрах үедээ унаж, алдаа нь шалтгаанаа хэлэхгүй.
export const supabase = createClient(
  isSupabaseConfigured ? (url as string) : 'http://localhost:54321',
  isSupabaseConfigured ? (anonKey as string) : 'public-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
