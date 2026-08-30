import React, { useState } from 'react';
import {
  ShoppingCart,
  ShieldCheck,
  Check,
  Eye,
  Plus,
  Minus,
  Heart,
  FileText,
  Copy,
} from 'lucide-react';
import { Product, UnitOfMeasure } from '../types';
import { formatMNT } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, uom: UnitOfMeasure) => void;
  onQuickView: (product: Product) => void;
  onAddToRFQ: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

// Brand shortcode helper for top-left black badge
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
  if (lower.includes('кабель')) return 'CABLE';
  return brandName.split(' ')[0].toUpperCase().slice(0, 8);
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onAddToRFQ,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedRecently, setIsAddedRecently] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(product.images[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80');

  // Discount percentage calculation
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Active bulk discount if any
  const maxBulkDiscount =
    product.bulkTiers.length > 1
      ? product.bulkTiers[product.bulkTiers.length - 1].discountPercent
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity, product.uom);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1800);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const handleRfqClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToRFQ(product);
  };

  const brandBadge = getBrandShortBadge(product.brand);

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square bg-slate-50/90 p-2 sm:p-3 flex items-center justify-center overflow-hidden border-b border-slate-100/80">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80');
          }}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
          loading="lazy"
        />

        {/* Top-Left: Brand Badge */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black tracking-wider bg-slate-900 text-white shadow-xs uppercase">
            {brandBadge}
          </span>
          {product.isMNSCertified && (
            <span className="px-1 py-0.2 rounded text-[8px] sm:text-[9px] font-extrabold bg-emerald-600 text-white shadow-2xs">
              MNS
            </span>
          )}
        </div>

        {/* Top-Right: Favorite Button & Discount Badge */}
        <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 backdrop-blur-xs text-slate-600 hover:text-rose-500 hover:bg-white'
            }`}
            title={isFavorite ? 'Хадгалснаас хасах' : 'Хадгалах'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {discountPercent && (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black bg-rose-600 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Desktop Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="hidden sm:flex absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/95 text-slate-900 shadow-md items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110 z-20"
          title="Дэлгэрэнгүй харах"
        >
          <Eye className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* Product Content Body */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {/* Subtitle / Brand text */}
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="font-mono truncate">{product.sku}</span>
            <span className="truncate">{product.subcategory || product.brand}</span>
          </div>

          {/* Product Name (Bold, 2 lines truncated) */}
          <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Stock indicator badge */}
          <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{product.totalStock > 0 ? `Агуулахад бэлэн` : 'Захиалгаар'}</span>
          </div>
        </div>

        {/* Pricing & Add to Cart Area */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-black text-slate-950 font-display">
                {formatMNT(product.price)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                /{product.uom}
              </span>
            </div>

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-rose-500 line-through font-semibold">
                {formatMNT(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart & Stepper */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Quantity Stepper */}
            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5 shrink-0">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <span className="w-4 sm:w-5 text-center text-[10px] sm:text-xs font-bold text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Direct Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-1.5 px-2 rounded-lg font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 ${
                isAddedRecently
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'btn-liquid-dark'
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-3 h-3 text-white" />
                  <span className="truncate text-white">Нэмлээ</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3 text-white shrink-0" />
                  <span className="truncate text-white">Сагслах</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
