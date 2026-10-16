import { supabase, isSupabaseConfigured } from './supabase';
import type { BannerRow, PostRow, PromotionRow } from '../types/db';

/**
 * Нийтэлсэн мэдээ. RLS нь ноорогийг аль хэдийн нуудаг тул энд
 * нэмэлт шүүлт хэрэггүй.
 */
export const fetchPosts = async (limit?: number): Promise<PostRow[]> => {
  if (!isSupabaseConfigured) return [];
  let q = supabase
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false });
  if (limit) q = q.limit(limit);

  const { data, error } = await q;
  if (error) {
    console.error('Мэдээ уншиж чадсангүй:', error.message);
    return [];
  }
  return (data as PostRow[]) ?? [];
};

export const fetchPostBySlug = async (slug: string): Promise<PostRow | null> => {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    console.error('Мэдээ уншиж чадсангүй:', error.message);
    return null;
  }
  return (data as PostRow | null) ?? null;
};

/** Огнооны хувьд яг одоо үйлчилж байгаа эсэх. */
const isLive = (p: { starts_at: string | null; ends_at: string | null }): boolean => {
  const now = Date.now();
  if (p.starts_at && new Date(p.starts_at).getTime() > now) return false;
  if (p.ends_at && new Date(p.ends_at).getTime() < now) return false;
  return true;
};

/**
 * Идэвхтэй урамшууллууд. Нийтэлсэн ч хугацаа нь эхлээгүй, дууссан нь
 * орохгүй — хугацааг бааз биш, энд шалгана.
 */
export const fetchLivePromotions = async (): Promise<PromotionRow[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('starts_at', { ascending: false, nullsFirst: false });
  if (error) {
    console.error('Урамшуулал уншиж чадсангүй:', error.message);
    return [];
  }
  return ((data as PromotionRow[]) ?? []).filter(isLive);
};

/**
 * Нийтэлсэн бөгөөд хугацаандаа багтаж буй сурталчилгааны баннерууд.
 * RLS нь нийтлээгүйг нуудаг тул энд зөвхөн огноог шалгана.
 */
export const fetchLiveBanners = async (): Promise<BannerRow[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Баннер уншиж чадсангүй:', error.message);
    return [];
  }
  return ((data as BannerRow[]) ?? []).filter(isLive);
};
