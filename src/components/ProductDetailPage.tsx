import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  FileText,
  Tag,
  Heart,
  Share2,
  Truck,
  CheckCircle2,
  ChevronRight,
  Layers,
  Award,
  Clock,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useCategories } from '../CatalogProvider';
import { Product, UnitOfMeasure, CartItem } from '../types';
import { formatMNT, formatWeight } from '../utils/formatters';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, uom: UnitOfMeasure) => void;
  onAddToRFQ: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  favoriteIds: string[];
  onToggleFavorite: (productId: string) => void;
  onSelectCategory?: (categorySlug: string) => void;
  onOpenCalculator?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onAddToRFQ,
  onSelectProduct,
  favoriteIds,
  onToggleFavorite,
  onSelectCategory,
  onOpenCalculator,
}) => {
  const CATEGORIES = useCategories();
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // When product changes, scroll to top and reset state
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImage(product.images[0] || '');
    setQuantity(1);
    setIsAdded(false);
  }, [product.id]);

  const isFavorite = favoriteIds.includes(product.id);
  const currentCategory = CATEGORIES.find((c) => c.id === product.category);

  // Active bulk tier calculation
  const activeBulkTier = [...product.bulkTiers]
    .reverse()
    .find((tier) => quantity >= tier.minQty);
  const currentUnitPrice = activeBulkTier ? activeBulkTier.price : product.price;
  const totalPrice = currentUnitPrice * quantity;
  const totalWeight = product.weightKg * quantity;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, product.uom);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Smart Related Products Recommendation Engine
  const getSmartRelatedProducts = (current: Product, list: Product[]): Product[] => {
    const others = list.filter((p) => p.id !== current.id);
    
    // Category affinity mapping for construction workflow
    // e.g. Blocks -> Cement, Rebar, Insulation, Tools
    // e.g. Cement -> Rebar, Blocks, Tools
    // e.g. Rebar -> Cement, Blocks, Tools
    // e.g. Insulation -> Drywall, Tools, Blocks
    const categoryAffinities: Record<string, string[]> = {
      'bricks-blocks': ['cement-mortar', 'rebar-steel', 'insulation-roof', 'tools-hardware'],
      'cement-mortar': ['rebar-steel', 'bricks-blocks', 'tools-hardware', 'insulation-roof'],
      'rebar-steel': ['cement-mortar', 'bricks-blocks', 'tools-hardware', 'drywall-interior'],
      'insulation-roof': ['drywall-interior', 'bricks-blocks', 'tools-hardware', 'paint-finishing'],
      'drywall-interior': ['paint-finishing', 'tools-hardware', 'insulation-roof', 'electrical-lighting'],
      'electrical-lighting': ['tools-hardware', 'drywall-interior', 'plumbing-hvac'],
      'plumbing-hvac': ['tools-hardware', 'cement-mortar', 'electrical-lighting'],
      'tools-hardware': ['cement-mortar', 'bricks-blocks', 'rebar-steel', 'drywall-interior'],
    };

    const preferredCategories = categoryAffinities[current.category] || [];

    // 1. Same subcategory or category items
    const sameCategoryItems = others.filter((p) => p.category === current.category);
    
    // 2. Complementary workflow items
    const complementaryItems = others.filter((p) => preferredCategories.includes(p.category));

    // Combine prioritizing 1-2 from same category, 2-3 from complementary
    const recommended: Product[] = [];

    // Add up to 2 complementary
    complementaryItems.forEach((p) => {
      if (!recommended.some((r) => r.id === p.id) && recommended.length < 3) {
        recommended.push(p);
      }
    });

    // Add same category items
    sameCategoryItems.forEach((p) => {
      if (!recommended.some((r) => r.id === p.id) && recommended.length < 4) {
        recommended.push(p);
      }
    });

    // Fallback if still under 4
    others.forEach((p) => {
      if (!recommended.some((r) => r.id === p.id) && recommended.length < 4) {
        recommended.push(p);
      }
    });

    return recommended.slice(0, 4);
  };

  const relatedProducts = getSmartRelatedProducts(product, allProducts);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 sm:pb-16 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Бүтээгдэхүүний холбоос хуулагдлаа!</span>
        </div>
      )}

      {/* Top Breadcrumbs & Back Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 sm:top-[72px] z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Breadcrumbs — гар утсан дээр зай эзэлж, нэрийг нь таслаад
              давхардуулдаг тул зөвхөн өргөн дэлгэц дээр. */}
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={onBack}
              className="font-semibold text-slate-700 hover:text-amber-600 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Нүүр</span>
            </button>

            {/* Ангилалгүй бараан дээр сум дангаараа үлдэхгүй. */}
            {currentCategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <button
                  onClick={() => {
                    if (onSelectCategory) {
                      onSelectCategory(currentCategory.id);
                    }
                    onBack();
                  }}
                  className="font-semibold text-slate-700 hover:text-amber-600 transition-colors truncate max-w-[140px] sm:max-w-none cursor-pointer shrink-0"
                >
                  {currentCategory.name}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </>
            )}

            <span className="font-bold text-slate-900 truncate max-w-[160px] sm:max-w-[300px]">
              {product.name}
            </span>
          </div>

          {/* Back Button & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Хуваалцах"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleFavorite(product.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-100 hover:bg-slate-200 border-transparent text-slate-700'
              }`}
              title="Хадгалах"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Буцах</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Layout Container */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-8 sm:space-y-12">
        {/* Top Product Section: Left (Gallery + Tech Specs) & Right (Details + Buy Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          
          {/* =========================================================================
              LEFT COLUMN: Product Images & Technical Specifications Directly Below
             ========================================================================= */}
          <div className="lg:col-span-6 space-y-6">

            {/* Гар утсан дээр нэр зургийн дээр байх нь ойлгомжтой. Дэлгэц дээр
                баруун баганад, үнийн хажууд хэвээр. */}
            <h1
              className="lg:hidden line-clamp-2 text-base sm:text-xl font-bold text-slate-900 font-display leading-snug"
              title={product.name}
            >
              {product.name}
            </h1>

            {/* Image Gallery Stage */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              {/* Main Active Image Display */}
              <div className="aspect-4/3 sm:aspect-square rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 relative group flex items-center justify-center">
                <img
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                />

              </div>

              {/* Thumbnails list */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-slate-50 p-1 ${
                        (selectedImage || product.images[0]) === img
                          ? 'border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TECHNICAL SPECIFICATIONS (Directly below product images as requested) */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 font-display">
                      Техникийн үзүүлэлтүүд
                    </h3>
                  </div>
                </div>

                <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {product.sku}
                </span>
              </div>

              {/* Specs Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs sm:text-sm">
                {product.techSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 flex items-center justify-between gap-4 transition-colors ${
                      idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'
                    }`}
                  >
                    <span className="text-slate-600 font-medium">{spec.name}</span>
                    <span className="font-bold text-slate-900 text-right font-mono sm:font-sans">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Official Standard Certificate Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-emerald-950">
                    Үндэсний & Олон улсын чанарын тохирлын гэрчилгээ
                  </div>
                  <div className="text-emerald-800 leading-relaxed">
                    Энэхүү бүтээгдэхүүн нь {product.mnsStandard || 'MNS'} стандартын дагуу итгэмжлэгдсэн лабораторийн тогтмол сорилтоор баталгаажсан.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN: Pricing, Tiers, Live Warehouse Stock, and Buy Action Box
             ========================================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header & Product Information */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="hidden lg:block border-b border-slate-100 pb-4">
                <h1 className="text-[30px] font-bold text-slate-900 font-display leading-[1.15]">
                  {product.name}
                </h1>
              </div>

              {product.description && (
                <p className="max-w-[62ch] text-sm text-slate-600 leading-[1.7]">
                  {product.description}
                </p>
              )}

              {/* Bulk Tiered Pricing Grid */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
                <h3 className="text-[13px] font-semibold text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Бөөний үнэ</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {product.bulkTiers.map((tier, idx) => {
                    const isTierActive = quantity >= tier.minQty;
                    return (
                      <div
                        key={idx}
                        onClick={() => setQuantity(tier.minQty)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isTierActive
                            ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
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

              {/* Худалдан авах хэсэг */}
              <div className="p-5 bg-slate-900 text-white rounded-3xl shadow-xl border border-slate-800 space-y-4">
                {/* Нэгжийн үнэ — хоёрдогч мэдээлэл */}
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xs text-slate-400">Нэгжийн үнэ</span>
                  <span className="text-base font-semibold text-amber-400 tabular-nums">
                    {formatMNT(currentUnitPrice)}
                    <span className="ml-0.5 text-xs font-normal text-slate-500">/{product.uom}</span>
                  </span>
                </div>

                {/* Нийт дүн — хэрэглэгчийн төлөх дүн тул хамгийн тод */}
                <div className="border-t border-slate-800 pt-4">
                  <span className="text-xs text-slate-400">Нийт үнэ</span>
                  <div className="mt-0.5 text-3xl sm:text-4xl font-bold font-display tabular-nums leading-none">
                    {formatMNT(totalPrice)}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 tabular-nums">
                    {quantity} {product.uom} · {formatWeight(totalWeight)}
                  </p>
                </div>

                {/* Тоо ширхэг ба сагслах — хамт явдаг тул нэг мөрөнд */}
                <div className="flex items-stretch gap-2.5">
                  <div className="flex items-center rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-12 grid place-items-center text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      aria-label="Хасах"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      aria-label="Тоо ширхэг"
                      className="w-12 text-center text-base font-semibold bg-transparent text-white outline-hidden tabular-nums"
                    />
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="w-10 h-12 grid place-items-center text-slate-300 hover:text-white cursor-pointer transition-colors"
                      aria-label="Нэмэх"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Нэмэгдлээ</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Сагслах</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Хоёрдогч үйлдэл — өөрийн мөрөнд, давчуурахгүй */}
                <button
                  onClick={() => onAddToRFQ(product)}
                  className="w-full h-11 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Бөөний үнийн санал авах</span>
                </button>

                <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    УБ дотор 2-4 цагт хүргэнэ
                  </span>
                  {onOpenCalculator && (
                    <button
                      onClick={onOpenCalculator}
                      className="text-amber-400 hover:text-amber-300 font-medium underline cursor-pointer shrink-0"
                    >
                      Материал тооцоолох
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* =========================================================================
            BOTTOM SECTION: RELATED / COMPLEMENTARY PRODUCTS (Холбоотой бүтээгдэхүүнүүд)
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Холбоотой бараа
            </h2>
          </div>

          {/* Related Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProduct(item)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
              >
                {/* Image Stage */}
                <div className="aspect-4/3 bg-slate-50 p-4 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-900/90 text-amber-300">
                      {item.brand}
                    </span>
                  </div>
                  {item.isMNSCertified && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        MNS
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-400 font-mono">SKU: {item.sku}</div>
                    <h3 className="text-xs sm:text-[13px] font-medium text-slate-700 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Нэгж үнэ:</div>
                      <div className="text-sm sm:text-base font-black text-slate-900">
                        {formatMNT(item.price)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item, 1, item.uom);
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer shadow-xs"
                      title="Сагслах"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
