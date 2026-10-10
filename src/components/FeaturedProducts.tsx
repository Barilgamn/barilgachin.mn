import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Flame,
  ShieldCheck,
  Percent,
  ArrowRight,
  ShoppingCart,
  Eye,
  FileText,
  Tag,
  Check,
  Truck,
  Plus,
  Minus,
  Star,
} from 'lucide-react';
import { Product, UnitOfMeasure } from '../types';
import { formatMNT, formatWeight } from '../utils/formatters';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number, uom: UnitOfMeasure) => void;
  onQuickView: (product: Product) => void;
  onAddToRFQ: (product: Product) => void;
  onViewAllProducts: () => void;
}

type TabType = 'bestsellers' | 'new_arrivals' | 'mns_certified' | 'bulk_deals';

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onAddToRFQ,
  onViewAllProducts,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('bestsellers');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [recentlyAdded, setRecentlyAdded] = useState<Record<string, boolean>>({});

  // Filter curated products based on active tab
  const curatedProducts = useMemo(() => {
    switch (activeTab) {
      case 'bestsellers':
        return products.filter((p) => p.isBestseller || p.rating >= 4.9).slice(0, 4);
      case 'new_arrivals':
        return products
          .filter((p) => p.category === 'tools-hardware' || p.category === 'drywall-interior' || p.isFeatured)
          .slice(0, 4);
      case 'mns_certified':
        return products.filter((p) => p.isMNSCertified && p.mnsStandard).slice(0, 4);
      case 'bulk_deals':
        return products
          .filter((p) => p.bulkTiers.length > 2 && p.bulkTiers.some((t) => t.discountPercent >= 10))
          .slice(0, 4);
      default:
        return products.slice(0, 4);
    }
  }, [products, activeTab]);

  const getQuantity = (id: string) => quantities[id] || 1;

  const handleUpdateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const qty = getQuantity(product.id);
    onAddToCart(product, qty, product.uom);
    setRecentlyAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setRecentlyAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section id="featured-products-section" className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8">
      {/* Header with Title and Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Онцлох & Эрэлттэй нийлүүлэлт</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Шилдэг барилгын материалууд
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            4 салбар агуулахын бодит үлдэгдэлтэй, баталгаат MNS сертификаттай бүтээгдэхүүнүүд.
          </p>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('bestsellers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bestsellers'
                ? 'btn-liquid-dark shadow-sm'
                : 'btn-liquid-glass text-slate-700'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${activeTab === 'bestsellers' ? 'text-white' : 'text-slate-700'}`} />
            <span>Их эрэлттэй</span>
          </button>

          <button
            onClick={() => setActiveTab('new_arrivals')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'new_arrivals'
                ? 'btn-liquid-dark shadow-sm'
                : 'btn-liquid-glass text-slate-700'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'new_arrivals' ? 'text-white' : 'text-slate-700'}`} />
            <span>Шинэ ирсэн</span>
          </button>

          <button
            onClick={() => setActiveTab('mns_certified')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'mns_certified'
                ? 'btn-liquid-dark shadow-sm'
                : 'btn-liquid-glass text-slate-700'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'mns_certified' ? 'text-white' : 'text-slate-700'}`} />
            <span>MNS Баталгаажсан</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk_deals')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bulk_deals'
                ? 'btn-liquid-dark shadow-sm'
                : 'btn-liquid-glass text-slate-700'
            }`}
          >
            <Percent className={`w-3.5 h-3.5 ${activeTab === 'bulk_deals' ? 'text-white' : 'text-slate-700'}`} />
            <span>Бөөний онцгой үнэ</span>
          </button>
        </div>
      </div>

      {/* Featured Products Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {curatedProducts.map((product) => {
          const qty = getQuantity(product.id);
          const activeTier = [...product.bulkTiers]
            .reverse()
            .find((tier) => qty >= tier.minQty);
          const currentPrice = activeTier ? activeTier.price : product.price;
          const maxDiscount = Math.max(...product.bulkTiers.map((t) => t.discountPercent));
          const isAdded = recentlyAdded[product.id];

          return (
            <div
              key={product.id}
              onClick={() => onQuickView(product)}
              className="group bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
            >
              {/* Product Visual Container */}
              <div className="relative aspect-4/3 bg-slate-200 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Floating Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                  {product.isBestseller && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-md">
                      <Flame className="w-3 h-3 fill-slate-950" />
                      TOP БОРЛУУЛАЛТ
                    </span>
                  )}
                  {product.isMNSCertified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/90 text-white backdrop-blur-xs border border-slate-700">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      {product.mnsStandard ? product.mnsStandard.split(' ')[0] : 'MNS'}
                    </span>
                  )}
                </div>

                {/* Discount Tag */}
                {maxDiscount > 0 && (
                  <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-md">
                    -{maxDiscount}% Хүртэл
                  </div>
                )}

                {/* Quick View Hover Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(product);
                  }}
                  className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-white/95 text-slate-900 backdrop-blur-xs shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  title="Дэлгэрэнгүй үзэх"
                >
                  <Eye className="w-5 h-5" />
                </button>

                {/* Weight & Location Overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/90 text-purple-900 backdrop-blur-xs shadow-xs">
                    {product.sku}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-950/80 text-white backdrop-blur-xs">
                    {formatWeight(product.weightKg)}
                  </span>
                </div>
              </div>

              {/* Product Content Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-700 uppercase tracking-wider truncate">
                      {product.brand}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 font-bold">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {product.rating}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {product.description}
                  </p>
                </div>

                {/* Stock Indicator across warehouses */}
                <div className="py-1 px-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    4 агуулахад бэлэн
                  </span>
                  <span className="font-mono font-extrabold text-slate-900">
                    {product.totalStock.toLocaleString()} {product.uom}
                  </span>
                </div>

                {/* Pricing & Stepper Box */}
                <div className="pt-2 border-t border-slate-200/70">
                  <div className="flex items-baseline justify-between mb-2.5">
                    <div>
                      <div className="text-lg font-black text-slate-950 font-display">
                        {formatMNT(currentPrice)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        НӨАТ-тай / {product.uom}
                      </div>
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-xs line-through text-slate-400 font-mono">
                        {formatMNT(product.originalPrice)}
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper & Add Button */}
                  <div className="flex items-center gap-2">
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center border border-slate-300 rounded-xl bg-white p-0.5 shrink-0"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQty(product.id, -1);
                        }}
                        disabled={qty <= 1}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-950 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-black text-slate-900">
                        {qty}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQty(product.id, 1);
                        }}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-950 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={(e) => handleAdd(e, product)}
                      className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'btn-liquid-dark'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span className="text-white">Нэмэгдлээ</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5 text-white" />
                          <span className="text-white">Сагслах</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToRFQ(product);
                      }}
                      className="p-2 rounded-xl btn-liquid-glass text-slate-700 cursor-pointer shrink-0"
                      title="Төслийн үнийн саналд нэмэх"
                    >
                      <FileText className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA Banner */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900/10 text-slate-900 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Улаанбаатар хот дотор 2-4 цагийн шуурхай хүргэлт
            </div>
            <div className="text-[11px] text-slate-500">
              Портер, 3.5тн Майти, 5тн Крантай машин, 20тн Трейлер бэлэн байна
            </div>
          </div>
        </div>

        <button
          onClick={onViewAllProducts}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-liquid-dark font-bold text-xs group cursor-pointer"
        >
          <span className="text-white">Бүх барилгын материал үзэх ({products.length})</span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
