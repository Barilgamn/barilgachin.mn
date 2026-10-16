import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fetchLivePromotions } from '../lib/content';
import type { PromotionRow } from '../types/db';

/** Хураангуй үед зургийн хэдэн хувийг харуулах. */
const COLLAPSED_SHARE = 0.4;
/** Хураангуй хэдий чинээ өндөр байлаа ч үүнээс хэтрэхгүй. */
const COLLAPSED_MAX = 200;
/** Дэлгэгдсэн ч хуудсыг бүхэлд нь эзлэхээс сэргийлнэ. */
const EXPANDED_MAX = 520;
/** Зураг ачаалахаас өмнөх түр өндөр. */
const FALLBACK = 200;

/**
 * Толгойн доорх сурталчилгааны баннер.
 *
 * Хураангуй байрлалаас хулгана очиход дэлгэгдэнэ. Дэлгэгдсэн өндрийг
 * зургийн өөрийнх нь харьцаанаас тооцдог тул админ ямар ч хэлбэрийн
 * баннер тавилаа гэсэн бүтнээрээ харагдана.
 *
 * Хулганагүй төхөөрөмж дээр дэлгэх үйлдэл утгагүй тул гар утсанд гарахгүй.
 */
export const TopPromoBanner: React.FC = () => {
  const [promo, setPromo] = useState<PromotionRow | null>(null);
  const [open, setOpen] = useState(false);
  const [fullHeight, setFullHeight] = useState(FALLBACK);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    void fetchLivePromotions().then((list) => {
      setPromo(list.find((p) => p.banner_url) ?? null);
    });
  }, []);

  const measure = useCallback(() => {
    const img = imgRef.current;
    // Зургийн өөрийнх нь өргөнөөр хэмжинэ — гадна хүрээний px-4 дотоод
    // зай нь clientWidth-д ордог тул савыг хэмжвэл өндөр нь хэтэрнэ.
    const width = img?.clientWidth ?? 0;
    if (!img?.naturalWidth || !width) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    setFullHeight(Math.min(Math.round(width / ratio), EXPANDED_MAX));
  }, []);

  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  if (!promo?.banner_url) return null;

  const collapsed = Math.min(Math.round(fullHeight * COLLAPSED_SHARE), COLLAPSED_MAX, fullHeight);
  const isCropped = fullHeight > collapsed;

  const inner = (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition-[height] duration-300 ease-out"
      style={{ height: open ? fullHeight : collapsed }}
    >
      <img
        ref={imgRef}
        src={promo.banner_url}
        alt={promo.title}
        onLoad={measure}
        className="h-full w-full object-cover object-top"
      />

      {/* Доод ирмэгийн бүдгэрэлт нь цаана үргэлжилж байгааг мэдрүүлнэ.
          Зураг бүтнээрээ багтаж байвал хэрэггүй. */}
      {isCropped && (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900/25 to-transparent transition-opacity ${
            open ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );

  return (
    <div
      className="hidden md:block w-full max-w-6xl mx-auto px-4 pt-3"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {promo.link_url ? (
        <a
          href={promo.link_url}
          target={promo.link_url.startsWith('http') ? '_blank' : undefined}
          rel={promo.link_url.startsWith('http') ? 'noreferrer' : undefined}
          title={promo.title}
          className="block"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
};
