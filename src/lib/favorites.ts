const KEY = 'barilgachin.favorites';

/**
 * Хадгалсан барааг хөтөч дээр үлдээнэ.
 *
 * Дэлгүүрт хэрэглэгчийн нэвтрэлт байхгүй тул энэ нь төхөөрөмж тус бүрд
 * хадгалагдана. Нууцлалын горим, цэвэрлэсэн хөтөч дээр уншиж бичих нь
 * алдаа өгч болзошгүй тул бүгдийг нь try/catch-д оруулав.
 */
export const loadFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
};

export const saveFavorites = (ids: string[]): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Хадгалах боломжгүй бол энэ хуудсанд л ажиллана — тасалдуулахгүй.
  }
};
