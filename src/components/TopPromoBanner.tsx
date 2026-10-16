import React, { useEffect, useState } from 'react';
import { fetchLivePromotions } from '../lib/content';
import type { PromotionRow } from '../types/db';

/** Хураангуй өндөр — баннерын дээд хэсэг л харагдана. */
const COLLAPSED = 120;
/** Хулгана очиход тэлэх өндөр. */
const EXPANDED = 420;

/**
 * Толгойн доорх сурталчилгааны баннер.
 *
 * Хураангуй байрлалаас хулгана очиход дэлгэгдэнэ. Хулганагүй төхөөрөмж
 * дээр дэлгэх үйлдэл утгагүй тул гар утсан дээр огт гаргахгүй.
 */
export const TopPromoBanner: React.FC = () => {
  const [promo, setPromo] = useState<PromotionRow | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void fetchLivePromotions().then((list) => {
      setPromo(list.find((p) => p.banner_url) ?? null);
    });
  }, []);

  if (!promo?.banner_url) return null;

  const inner = (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition-[height] duration-300 ease-out"
      style={{ height: open ? EXPANDED : COLLAPSED }}
    >
      <img
        src={promo.banner_url}
        alt={promo.title}
        className="h-full w-full object-cover object-top"
      />

      {/* Хураангуй үед доод ирмэгийг бүдгэрүүлж, цаана нь үргэлжилж буйг
          мэдрүүлнэ. Дэлгэгдсэн үед хэрэггүй. */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900/25 to-transparent transition-opacity ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );

  return (
    <div
      className="hidden md:block max-w-6xl mx-auto px-4 pt-3"
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
