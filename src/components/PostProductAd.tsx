import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useCategories, useProducts } from '../CatalogProvider';
import { formatMNT } from '../utils/formatters';
import type { PostBlock } from '../lib/postBlocks';

type Block = Extract<PostBlock, { kind: 'products' }>;

/**
 * Мэдээний дунд гарах барааны зурвас.
 *
 * Мэдээний хуудсанд сагс байхгүй тул энд сагслах товч тавихгүй — дарвал
 * дэлгүүр дээрх тухайн бараа руу очно.
 */
export const PostProductAd: React.FC<{ block: Block }> = ({ block }) => {
  const products = useProducts();
  const categories = useCategories();

  // Тэмдэглэгээнд ангиллыг slug-аар бичдэг — текст дотор уншигдахуйц байх ёстой.
  const category = block.categorySlug
    ? categories.find((c) => c.slug === block.categorySlug)
    : null;

  const picked = block.skus.length
    ? // Админы бичсэн дарааллыг хадгална.
      block.skus
        .map((sku) => products.find((p) => p.sku.toLowerCase() === sku.toLowerCase()))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    : products.filter((p) => !category || p.category === category.id);

  const shown = picked.slice(0, block.limit);
  if (shown.length === 0) return null;

  return (
    <aside className="not-prose my-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
          {category ? category.name : 'Холбоотой бараа'}
        </h3>
        {category && (
          <a
            href={`/?category=${encodeURIComponent(category.id)}`}
            className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            Бүгдийг үзэх
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {shown.map((p) => (
          <a
            key={p.id}
            href={`/?product=${encodeURIComponent(p.sku)}`}
            className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-md transition-all"
          >
            <div className="aspect-square bg-slate-50 p-2">
              <img
                src={p.images[0]}
                alt=""
                loading="lazy"
                className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-2 space-y-0.5">
              <div className="text-sm font-bold text-slate-950 tabular-nums leading-none">
                {formatMNT(p.price)}
                <span className="ml-1 text-[10px] font-medium text-slate-400">/{p.uom}</span>
              </div>
              <div className="text-[11px] text-slate-600 line-clamp-2 leading-snug group-hover:text-amber-700">
                {p.name}
              </div>
            </div>
          </a>
        ))}
      </div>
    </aside>
  );
};
