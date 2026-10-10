import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client.
 *
 * Anon key нь нийтэд нээлттэй байхад асуудалгүй — өгөгдлийн хамгаалалт
 * бүхэлдээ Postgres дээрх RLS бодлогоор хийгдэнэ (supabase/migrations).
 * Service role key-г энд хэзээ ч оруулахгүй: VITE_* хувьсагч build үед
 * хөтчийн багцад шигддэг.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Тохиргоо бүрэн эсэх — бэлэн болтол сайт mock өгөгдлөөр ажиллана. */
export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    'Supabase тохируулаагүй байна. .env дотор VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY-г бөглөнө үү.',
  );
}

export const supabase = createClient(
  url ?? 'http://localhost:54321',
  anonKey ?? 'public-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
