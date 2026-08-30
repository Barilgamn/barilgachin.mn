import React, { useState } from 'react';
import { Product, UnitOfMeasure } from '../types';
import { formatMNT } from '../utils/formatters';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface PromoShowcaseSectionProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number, uom: UnitOfMeasure) => void;
  onQuickView: (product: Product) => void;
  onSelectCategory?: (categoryId: string) => void;
}

const getBrandShortBadge = (brandName: string): string => {
  const lower = brandName.toLowerCase();
  if (lower.includes('мак') || lower.includes('mak')) return 'MAK';
  if (lower.includes('монцемент') || lower.includes('moncement')) return 'MONCEMENT';
  if (lower.includes('кнауф') || lower.includes('knauf')) return 'KNAUF';
  if (lower.includes('hilti')) return 'HILTI';
  if (lower.includes('дархан') || lower.includes('darkhan')) return 'ДАРХАН';
  if (lower.includes('schneider')) return 'SCHNEIDER';
  if (lower.includes('tikkurila')) return 'TIKKURILA';
  if (lower.includes('технониколь') || lower.includes('technonicol')) return 'TN';
  if (lower.includes('bosch')) return 'BOSCH';
  if (lower.includes('wilo')) return 'WILO';
  if (lower.includes('kalde')) return 'KALDE';
  if (lower.includes('базальт') || lower.includes('basalt')) return 'BASALT';
  if (lower.includes('dewalt')) return 'DEWALT';
  if (lower.includes('valtec')) return 'VALTEC';
  return brandName.split(' ')[0].toUpperCase().slice(0, 8);
};

export const PromoShowcaseSection: React.FC<PromoShowcaseSectionProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onSelectCategory,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 8; // 2 rows x 4 columns on large screens

  // Showcase items list (Featured, new, and popular items)
  const showcaseProducts = products.filter((p) => p.totalStock > 0 || p.isFeatured);
  const totalPages = Math.ceil(showcaseProducts.length / itemsPerPage);

  const displayedProducts = showcaseProducts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="w-full my-6 select-none">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-stretch">
        {/* =========================================================================
            LEFT COLUMN: PROMO BANNER (Matching Screenshot Blue Badge/Collage Style)
           ========================================================================= */}
        <div
          onClick={() => {
            if (onSelectCategory) onSelectCategory('cement-binder');
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="lg:w-[280px] xl:w-[320px] shrink-0 bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-md cursor-pointer group transition-all duration-300 hover:shadow-xl"
        >
          {/* Decorative Background Elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Title Badges matching the screenshot */}
          <div className="space-y-3 relative z-10">
            <div className="inline-block border-2 border-white text-white font-black text-xl sm:text-2xl px-4 py-1.5 rounded-2xl tracking-tight shadow-xs">
              Үндсэн суурь
            </div>
            <div>
              <span className="inline-block bg-amber-400 text-slate-950 font-black text-lg sm:text-xl px-3.5 py-1 rounded-xl shadow-xs">
                материал
              </span>
            </div>
            <p className="text-blue-100 text-xs font-medium pt-1">
              Үйлдвэрийн үнэ, MNS сертификаттай бэлэн нийлүүлэлт
            </p>
          </div>

          {/* Visual Collage in Center */}
          <div className="relative py-6 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[210px] flex items-center justify-center">
              {/* Center Main Product */}
              <div className="w-36 h-36 bg-white/95 backdrop-blur-xs rounded-2xl p-2 shadow-xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                <img
                  src={products[0]?.images[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'}
                  alt="Cement"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Top-Right Floater */}
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-white/90 rounded-xl p-1.5 shadow-lg transform rotate-6 group-hover:rotate-12 transition-transform duration-300 flex items-center justify-center">
                <img
                  src={products[2]?.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'}
                  alt="Rebar"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Bottom-Left Floater */}
              <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-white/90 rounded-xl p-1.5 shadow-lg transform -rotate-6 group-hover:-rotate-12 transition-transform duration-300 flex items-center justify-center">
                <img
                  src={products[4]?.images[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'}
                  alt="Knauf"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Row with Blue Circle Arrow Button */}
          <div className="relative z-10 flex items-center justify-between pt-2">
            <span className="text-white text-xs font-bold flex items-center gap-1 group-hover:underline">
              Бүх суурь бараа үзэх <ArrowRight className="w-3.5 h-3.5 inline" />
            </span>
            <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-amber-400 group-hover:text-slate-950 text-white flex items-center justify-center transition-all duration-300 shadow-md">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: 2-ROW PRODUCT GRID WITH FLOATING CAROUSEL CONTROLS
           ========================================================================= */}
        <div className="flex-1 relative">
          {/* Floating Navigation Controls (< and > matching the screenshot) */}
          {totalPages > 1 && (
            <>
              <button
                onClick={handlePrevPage}
                className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 shadow-lg text-slate-700 hover:text-slate-950 hover:bg-white hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
                title="Өмнөх хуудас"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPage}
                className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#ff4d4f] text-white shadow-lg hover:bg-[#e0383a] hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
                title="Дараагийн хуудас"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Product Cards Grid: 2 rows of 4 cards on desktop, matching screenshot style */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 h-full">
            {displayedProducts.map((product) => {
              const brandBadge = getBrandShortBadge(product.brand);

              return (
                <div
                  key={product.id}
                  onClick={() => onQuickView(product)}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group relative"
                >
                  {/* Top Image Box */}
                  <div className="relative aspect-square bg-slate-50/70 p-3 flex items-center justify-center overflow-hidden border-b border-slate-100/80">
                    {/* Top-Left: Dark Brand Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black tracking-wider bg-slate-900 text-white shadow-2xs">
                        {brandBadge}
                      </span>
                    </div>

                    {/* Top-Right: Yellow/Amber "Шинэ" Badge with Border (matching screenshot) */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold text-amber-900 bg-amber-50 border border-amber-300/90 shadow-2xs">
                        Шинэ
                      </span>
                    </div>

                    {/* Clean Product Image */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                      loading="lazy"
                    />
                  </div>

                  {/* Body Content (Matching Screenshot Typography: Title, Subtitle, Price) */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-[12.5px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {product.subcategory || product.brand}
                      </p>
                    </div>

                    {/* Price in ₮ with Bold Font */}
                    <div className="pt-1 flex items-baseline justify-between">
                      <span className="text-sm sm:text-base font-black text-slate-950 font-display">
                        {formatMNT(product.price)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        /{product.uom}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
