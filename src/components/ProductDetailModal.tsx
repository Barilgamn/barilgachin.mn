import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Building,
  Plus,
  Minus,
  Check,
  ShoppingCart,
  FileText,
  Tag,
} from 'lucide-react';
import { Product, UnitOfMeasure } from '../types';
import { formatMNT, formatWeight } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, uom: UnitOfMeasure) => void;
  onAddToRFQ: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToRFQ,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0] || '');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const currentMainImage = selectedImage || product.images[0];

  // Active bulk tier
  const activeBulkTier = [...product.bulkTiers]
    .reverse()
    .find((tier) => quantity >= tier.minQty);
  const currentUnitPrice = activeBulkTier ? activeBulkTier.price : product.price;
  const totalPrice = currentUnitPrice * quantity;
  const totalWeight = product.weightKg * quantity;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, product.uom);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs overscroll-contain animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
          aria-label="Хаах"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Body: Side-by-Side (Image Left, Details Right) */}
        <div className="p-4 sm:p-6 sm:pt-7 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 bg-white overscroll-contain">
          {/* =========================================================================
              LEFT COLUMN: Sticky Image Gallery & Badges (5 / 12)
             ========================================================================= */}
          <div className="md:col-span-5 space-y-3.5 md:sticky md:top-0 h-fit">
            {/* Main Image Stage */}
            <div className="aspect-4/3 sm:aspect-square md:aspect-4/3 rounded-2xl bg-slate-50 overflow-hidden border border-slate-200 relative group shadow-2xs flex items-center justify-center">
              <img
                src={currentMainImage}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />

              {/* MNS Badge overlay */}
              {product.isMNSCertified && (
                <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border border-slate-700 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{product.mnsStandard}</span>
                </div>
              )}

              {/* Brand Pill overlay */}
              <div className="absolute top-2.5 right-2.5 bg-white/90 text-slate-900 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[11px] font-black border border-slate-200 shadow-xs">
                {product.brand}
              </div>
            </div>

            {/* Thumbnail Selector if multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-slate-50 ${
                      currentMainImage === img
                        ? 'border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumb"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Details, Tier Pricing, Stock & Purchase Actions (7 / 12)
             ========================================================================= */}
          <div className="md:col-span-7 space-y-5">
            {/* Title & Brand Header */}
            <div className="space-y-1 border-b border-slate-100 pb-3.5 pr-10">
              <div className="flex items-center gap-2 text-xs text-amber-600 font-bold uppercase tracking-wider">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black">{product.brand}</span>
                <span>•</span>
                <span className="text-slate-500 font-mono">SKU: {product.sku}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                {product.name}
              </h2>
              <div className="text-xs text-slate-500 font-medium">
                {product.mongolianName}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Bulk Tiered Pricing Table */}
            <div className="bg-slate-50/80 rounded-2xl p-3.5 sm:p-4 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-600" />
                  <span>Бөөний захиалгын шатлалт үнэ</span>
                </h4>
                <span className="text-[11px] text-emerald-700 font-bold hidden sm:inline">
                  Бөөний үнэ автоматаар тооцогдоно
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {product.bulkTiers.map((tier, idx) => {
                  const isTierActive = quantity >= tier.minQty;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isTierActive
                          ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 shadow-xs'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="text-[11px] font-semibold text-slate-500">
                        {tier.minQty}+ {product.uom}
                      </div>
                      <div className="text-sm font-black text-slate-900 mt-0.5">
                        {formatMNT(tier.price)}
                      </div>
                      {tier.discountPercent > 0 ? (
                        <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                          {tier.discountPercent}% хямдрал
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          Үндсэн үнэ
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Warehouse Stock Breakdown (4 Branches in UB) */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>Салбар агуулахуудын үлдэгдэл</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {product.stockLocations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{loc.branchName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {loc.address}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                        {loc.qty.toLocaleString()} {product.uom}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>Техникийн үзүүлэлтүүд</span>
              </h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs shadow-2xs">
                {product.techSpecs.map((spec, idx) => (
                  <div key={idx} className="p-2.5 flex justify-between hover:bg-slate-50 transition-colors">
                    <span className="text-slate-500 font-medium">{spec.name}</span>
                    <span className="font-bold text-slate-900 text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Action Box */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl space-y-4 border border-slate-800">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <span className="text-[11px] text-slate-400">Нэгжийн үнэ:</span>
                  <div className="text-2xl font-black text-amber-400 font-display">
                    {formatMNT(currentUnitPrice)}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    НӨАТ орсон / {product.uom} • Нэгж жин: {formatWeight(product.weightKg)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400">
                    Нийт үнэ ({quantity} {product.uom}):
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white font-display">
                    {formatMNT(totalPrice)}
                  </div>
                  <span className="text-[11px] text-amber-300 font-mono">
                    Нийт жин: {formatWeight(totalWeight)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Quantity input */}
                <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 shrink-0">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 sm:w-14 text-center text-sm font-bold bg-transparent text-white outline-hidden"
                  />
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'btn-liquid-dark'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-white">Нэмэгдлээ!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-white" />
                      <span className="text-white">Сагсанд нэмэх</span>
                    </>
                  )}
                </button>

                {/* RFQ Quote */}
                <button
                  onClick={() => {
                    onAddToRFQ(product);
                    onClose();
                  }}
                  className="px-3 sm:px-4 py-3 rounded-xl btn-liquid-glass text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 border border-white/20"
                  title="B2B Төслийн үнийн санал авах"
                >
                  <FileText className="w-4 h-4 text-slate-300" />
                  <span className="hidden sm:inline text-white">B2B Үнийн санал</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
