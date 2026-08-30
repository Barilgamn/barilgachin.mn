import React, { useState, useMemo } from 'react';
import { Product, UnitOfMeasure } from '../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES, WAREHOUSES } from '../data/mockData';
import { CONSTRUCTION_BRANDS } from '../data/brandsData';
import {
  ChevronRight,
  ChevronDown,
  Minus,
  Plus,
  SlidersHorizontal,
  X,
  Search,
  Check,
  Truck,
  Grid3X3,
  Blocks,
  Home,
  Paintbrush,
  Zap,
  Droplets,
  Wrench,
  Layers,
} from 'lucide-react';

const getCategoryIcon = (iconName: string, className = "w-4 h-4") => {
  switch (iconName) {
    case 'Truck':
    case 'Boxes':
      return <Truck className={className} />;
    case 'Grid3X3':
    case 'Layers':
      return <Grid3X3 className={className} />;
    case 'Blocks':
    case 'Building':
      return <Blocks className={className} />;
    case 'Home':
    case 'ShieldCheck':
      return <Home className={className} />;
    case 'Paintbrush':
      return <Paintbrush className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Droplets':
    case 'Flame':
      return <Droplets className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    default:
      return <Blocks className={className} />;
  }
};

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddToCart: (product: Product, quantity: number, uom: UnitOfMeasure) => void;
  onQuickView: (product: Product) => void;
  onAddToRFQ: (product: Product) => void;
  onOpenCalculator?: () => void;
  onOpenRFQModal?: () => void;
  onOpenOdooModal?: () => void;
  favoriteIds?: string[];
  onToggleFavorite?: (productId: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onAddToCart,
  onQuickView,
  onAddToRFQ,
  favoriteIds = [],
  onToggleFavorite,
}) => {
  // Multiple Brand selection state
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);

  // Subcategory selection
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  // Discount tier filters (Checkbox states)
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);

  // Status filters (Checkboxes)
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isNewOnly, setIsNewOnly] = useState<boolean>(false);
  const [isMNSOnly, setIsMNSOnly] = useState<boolean>(false);
  const [isBestsellerOnly, setIsBestsellerOnly] = useState<boolean>(false);

  // Warehouse filter
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  // Price range filters
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Sorting
  const [sortBy, setSortBy] = useState<
    'newest' | 'popular' | 'price_asc' | 'price_desc' | 'discount' | 'name'
  >('newest');

  // Collapsible accordion states
  const [isBrandOpen, setIsBrandOpen] = useState<boolean>(true);
  const [isDiscountOpen, setIsDiscountOpen] = useState<boolean>(true);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(true);
  const [isWarehouseOpen, setIsWarehouseOpen] = useState<boolean>(true);
  const [isPriceOpen, setIsPriceOpen] = useState<boolean>(true);

  // Brand search in sidebar
  const [brandSearchQuery, setBrandSearchQuery] = useState<string>('');

  // Mobile drawers
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState<boolean>(false);

  // Brand dropdown strip expansion
  const [showAllBrands, setShowAllBrands] = useState<boolean>(false);

  // Toggle brand selection
  const toggleBrand = (brandId: string) => {
    setSelectedBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  // Toggle discount filter
  const toggleDiscount = (tierKey: string) => {
    setSelectedDiscounts((prev) =>
      prev.includes(tierKey) ? prev.filter((k) => k !== tierKey) : [...prev, tierKey]
    );
  };

  // Toggle branch filter
  const toggleBranch = (branchId: string) => {
    setSelectedBranches((prev) =>
      prev.includes(branchId) ? prev.filter((b) => b !== branchId) : [...prev, branchId]
    );
  };

  // Active Category Object
  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const displayCategoryTitle = activeCategoryObj ? activeCategoryObj.name.split(',')[0] : 'Барилгын материал';

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Subcategory filter
        if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) {
          return false;
        }

        // Multi-Brand filter
        if (selectedBrandIds.length > 0) {
          const matchesAnyBrand = selectedBrandIds.some((brandId) => {
            const brandObj = CONSTRUCTION_BRANDS.find((b) => b.id === brandId);
            if (!brandObj) return false;
            return (
              p.brand.toLowerCase().includes(brandObj.shortCode.toLowerCase()) ||
              p.brand.toLowerCase().includes(brandObj.name.toLowerCase()) ||
              p.name.toLowerCase().includes(brandObj.shortCode.toLowerCase())
            );
          });
          if (!matchesAnyBrand) return false;
        }

        // Discount filter
        if (selectedDiscounts.length > 0) {
          const pDiscount =
            p.originalPrice && p.originalPrice > p.price
              ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
              : 0;

          const matchesDiscount = selectedDiscounts.some((tier) => {
            if (tier === 'under_10') return pDiscount > 0 && pDiscount < 10;
            if (tier === '10_20') return pDiscount >= 10 && pDiscount < 20;
            if (tier === '20_30') return pDiscount >= 20 && pDiscount < 30;
            if (tier === '30_40') return pDiscount >= 30 && pDiscount < 40;
            if (tier === '40_50') return pDiscount >= 40 && pDiscount < 50;
            if (tier === 'over_50') return pDiscount >= 50;
            return false;
          });

          if (!matchesDiscount) return false;
        }

        // Status filters
        if (inStockOnly && p.totalStock <= 0) return false;
        if (isNewOnly && !p.isFeatured && p.reviewCount > 100) return false;
        if (isMNSOnly && !p.isMNSCertified) return false;
        if (isBestsellerOnly && !p.isBestseller && p.rating < 4.8) return false;

        // Warehouse branch filters
        if (selectedBranches.length > 0) {
          const hasBranchStock = p.stockLocations.some(
            (loc) => selectedBranches.includes(loc.branchId) && loc.qty > 0
          );
          if (!hasBranchStock) return false;
        }

        // Price range filter
        if (minPrice && p.price < Number(minPrice)) return false;
        if (maxPrice && p.price > Number(maxPrice)) return false;

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.mongolianName.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            (p.mnsStandard && p.mnsStandard.toLowerCase().includes(q));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'popular') return b.rating * b.reviewCount - a.rating * a.reviewCount;
        if (sortBy === 'discount') {
          const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discB - discA;
        }
        return a.name.localeCompare(b.name);
      });
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    selectedBrandIds,
    selectedDiscounts,
    inStockOnly,
    isNewOnly,
    isMNSOnly,
    isBestsellerOnly,
    selectedBranches,
    minPrice,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  const resetAllFilters = () => {
    onSelectCategory('all');
    setSelectedSubcategory('all');
    setSelectedBrandIds([]);
    setSelectedDiscounts([]);
    setInStockOnly(false);
    setIsNewOnly(false);
    setIsMNSOnly(false);
    setIsBestsellerOnly(false);
    setSelectedBranches([]);
    setMinPrice('');
    setMaxPrice('');
    onSearchChange('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSubcategory !== 'all' ||
    selectedBrandIds.length > 0 ||
    selectedDiscounts.length > 0 ||
    inStockOnly ||
    isNewOnly ||
    isMNSOnly ||
    isBestsellerOnly ||
    selectedBranches.length > 0 ||
    minPrice !== '' ||
    maxPrice !== '' ||
    searchQuery !== '';

  // Filtered list of brands for sidebar search
  const filteredSidebarBrands = useMemo(() => {
    if (!brandSearchQuery.trim()) return CONSTRUCTION_BRANDS;
    const q = brandSearchQuery.toLowerCase();
    return CONSTRUCTION_BRANDS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.shortCode.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q)
    );
  }, [brandSearchQuery]);

  // Helper to render filter controls (used for both desktop sidebar and mobile drawer)
  const renderFilterContent = () => (
    <>
      {/* Main Category Header & Tree List (Matching Screenshot Style) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
            {selectedCategory === 'all' ? 'Барилгын материал' : displayCategoryTitle}
          </h3>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                onSelectCategory('all');
                setSelectedSubcategory('all');
              }}
              className="text-xs font-semibold text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              Бүгд
            </button>
          )}
        </div>

              {/* Category Tree Navigation Items with icon on left and count on right */}
              <div className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const shortName = cat.name.split(',')[0];

                  return (
                    <div key={cat.id} className="space-y-0.5">
                      <button
                        onClick={() => {
                          if (isSelected) {
                            onSelectCategory('all');
                            setSelectedSubcategory('all');
                          } else {
                            onSelectCategory(cat.id);
                            setSelectedSubcategory('all');
                          }
                        }}
                        className={`w-full text-left py-2 px-2 rounded-lg text-sm flex items-center justify-between transition-colors cursor-pointer group ${
                          isSelected
                            ? 'font-bold text-amber-950 bg-amber-50/80 shadow-2xs'
                            : 'font-normal text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 shadow-2xs'
                                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                            }`}
                          >
                            {getCategoryIcon(cat.iconName, "w-4 h-4")}
                          </div>
                          <span className="truncate text-[13px] sm:text-sm">{shortName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-normal text-slate-400 text-xs">
                            {cat.productCount}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isSelected
                                ? 'rotate-90 text-amber-900'
                                : 'text-slate-300 group-hover:text-slate-500'
                            }`}
                          />
                        </div>
                      </button>

                      {/* Expanded Subcategories if Category is selected */}
                      {isSelected && cat.subcategories && (
                        <div className="pl-9 pr-1 py-1 space-y-1">
                          {cat.subcategories.map((sub, idx) => {
                            const isSubSelected = selectedSubcategory === sub;
                            return (
                              <button
                                key={idx}
                                onClick={() =>
                                  setSelectedSubcategory(isSubSelected ? 'all' : sub)
                                }
                                className={`w-full text-left py-1 px-2 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                  isSubSelected
                                    ? 'bg-amber-100 text-amber-950 font-bold'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                              >
                                <span className="truncate">{sub}</span>
                                {isSubSelected && <Check className="w-3 h-3 text-amber-700 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= FILTER SECTION: Брэндүүд (Multi-select Brand Filter) ================= */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsBrandOpen(!isBrandOpen)}
                className="w-full flex items-center justify-between text-sm font-bold text-slate-900 pb-2 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span>Брэндүүд</span>
                  {selectedBrandIds.length > 0 && (
                    <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950">
                      {selectedBrandIds.length}
                    </span>
                  )}
                </div>
                {isBrandOpen ? (
                  <Minus className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isBrandOpen && (
                <div className="space-y-2 pt-1">
                  {/* Brand quick search input */}
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="Брэнд хайх..."
                      value={brandSearchQuery}
                      onChange={(e) => setBrandSearchQuery(e.target.value)}
                      className="w-full pl-7 pr-6 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 outline-hidden"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                    {brandSearchQuery && (
                      <button
                        onClick={() => setBrandSearchQuery('')}
                        className="text-slate-400 hover:text-slate-700 absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Brand checkboxes list */}
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                    {filteredSidebarBrands.map((brand) => {
                      const isChecked = selectedBrandIds.includes(brand.id);
                      return (
                        <label
                          key={brand.id}
                          className={`flex items-center justify-between py-1 px-1.5 rounded-md cursor-pointer text-xs transition-colors select-none ${
                            isChecked
                              ? 'bg-amber-50 text-slate-950 font-bold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-1">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleBrand(brand.id)}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                            />
                            <span className="truncate">{brand.name}</span>
                          </div>
                          <span
                            className="text-[10px] font-bold px-1 rounded shrink-0"
                            style={{
                              backgroundColor: brand.bgColor,
                              color: brand.textColor,
                            }}
                          >
                            {brand.shortCode}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {selectedBrandIds.length > 0 && (
                    <button
                      onClick={() => setSelectedBrandIds([])}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 pt-1 cursor-pointer"
                    >
                      Брэндүүдийг арилгах ({selectedBrandIds.length})
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ================= FILTER SECTION: Хямдрал (Discounts) ================= */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                className="w-full flex items-center justify-between text-sm font-bold text-slate-900 pb-2 cursor-pointer"
              >
                <span>Хямдрал</span>
                {isDiscountOpen ? (
                  <Minus className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isDiscountOpen && (
                <div className="space-y-2 pt-1 text-sm">
                  {[
                    { key: 'under_10', label: '10% хүртэлх', count: '2,117' },
                    { key: '10_20', label: '10% - 20%', count: '88' },
                    { key: '20_30', label: '20% - 30%', count: '138' },
                    { key: '30_40', label: '30% - 40%', count: '22' },
                    { key: '40_50', label: '40% - 50%', count: '15' },
                    { key: 'over_50', label: '50% - 60%', count: '1' },
                  ].map((tier) => {
                    const checked = selectedDiscounts.includes(tier.key);
                    return (
                      <label
                        key={tier.key}
                        className="flex items-center justify-between cursor-pointer group hover:text-slate-950 select-none text-slate-600 text-xs sm:text-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleDiscount(tier.key)}
                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                          />
                          <span>{tier.label}</span>
                        </div>
                        <span className="text-slate-400 text-xs">{tier.count}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ================= FILTER SECTION: Төлөв (Status) ================= */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="w-full flex items-center justify-between text-sm font-bold text-slate-900 pb-2 cursor-pointer"
              >
                <span>Төлөв</span>
                {isStatusOpen ? (
                  <Minus className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isStatusOpen && (
                <div className="space-y-2 pt-1 text-xs sm:text-sm">
                  <label className="flex items-center justify-between cursor-pointer text-slate-600 hover:text-slate-950">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer"
                      />
                      <span>Агуулахад бэлэн</span>
                    </div>
                    <span className="text-slate-400 text-xs">48</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer text-slate-600 hover:text-slate-950">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isNewOnly}
                        onChange={(e) => setIsNewOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer"
                      />
                      <span>Шинэ ирсэн</span>
                    </div>
                    <span className="text-slate-400 text-xs">16</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer text-slate-600 hover:text-slate-950">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isMNSOnly}
                        onChange={(e) => setIsMNSOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer"
                      />
                      <span>MNS Баталгаажсан</span>
                    </div>
                    <span className="text-slate-400 text-xs">32</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer text-slate-600 hover:text-slate-950">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isBestsellerOnly}
                        onChange={(e) => setIsBestsellerOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer"
                      />
                      <span>Их эрэлттэй бараа</span>
                    </div>
                    <span className="text-slate-400 text-xs">24</span>
                  </label>
                </div>
              )}
            </div>

            {/* ================= FILTER SECTION: Агуулахын байршил ================= */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsWarehouseOpen(!isWarehouseOpen)}
                className="w-full flex items-center justify-between text-sm font-bold text-slate-900 pb-2 cursor-pointer"
              >
                <span>Агуулахын байршил</span>
                {isWarehouseOpen ? (
                  <Minus className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isWarehouseOpen && (
                <div className="space-y-2 pt-1 text-xs sm:text-sm">
                  {WAREHOUSES.map((wh) => {
                    const checked = selectedBranches.includes(wh.branchId);
                    return (
                      <label
                        key={wh.branchId}
                        className="flex items-center justify-between cursor-pointer text-slate-600 hover:text-slate-950"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-1">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleBranch(wh.branchId)}
                            className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer"
                          />
                          <span className="truncate">{wh.branchName.split('(')[0]}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ================= FILTER SECTION: Үнэ (₮) ================= */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsPriceOpen(!isPriceOpen)}
                className="w-full flex items-center justify-between text-sm font-bold text-slate-900 pb-2 cursor-pointer"
              >
                <span>Үнэ (₮)</span>
                {isPriceOpen ? (
                  <Minus className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isPriceOpen && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Доод үнэ"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 outline-hidden"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="Дээд үнэ"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reset Filters Action */}
            {hasActiveFilters && (
              <div className="pt-2">
                <button
                  onClick={resetAllFilters}
                  className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Шүүлтүүрүүдийг цэвэрлэх
                </button>
              </div>
            )}
    </>
  );

  return (
    <section id="catalog-section" className="w-full">
      {/* 2-Column Main Layout: Left Sidebar + Right Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* =========================================================================
            LEFT COLUMN: CATEGORY TREE & COLLAPSIBLE FILTERS (Desktop Only: 3 / 12)
           ========================================================================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl p-4 sm:p-5 space-y-6 lg:sticky lg:top-24 max-h-[90vh] overflow-y-auto border border-slate-100/80 shadow-2xs">
            {renderFilterContent()}
          </div>
        </aside>

        {/* =========================================================================
            MOBILE FILTER DRAWER (Full modal with prominent Header X Close button & Bottom Action Bar)
           ========================================================================= */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity cursor-pointer"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            {/* Slide-in Drawer Container */}
            <div className="relative w-full max-w-sm bg-white shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
              {/* Sticky Drawer Header with prominent X button */}
              <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between shadow-xs shrink-0">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <h3 className="font-extrabold text-sm text-white">Шүүлтүүр</h3>
                </div>
                {/* Big, accessible Close (X) Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all border border-slate-700"
                  aria-label="Хаах"
                >
                  <span>Хаах</span>
                  <X className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              {/* Scrollable Filter Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
                {renderFilterContent()}
              </div>

              {/* Sticky Drawer Footer */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="flex-1 py-2.5 px-3 rounded-xl btn-liquid-glass text-slate-800 font-bold text-xs cursor-pointer"
                  >
                    Цэвэрлэх
                  </button>
                )}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl btn-liquid-dark font-extrabold text-xs cursor-pointer text-center"
                >
                  Үр дүнг харах ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MOBILE CATEGORY SELECTION MODAL (Opened from Mobile 'Цэс ∨' button)
           ========================================================================= */}
        {isMobileCategoryOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity cursor-pointer"
              onClick={() => setIsMobileCategoryOpen(false)}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] z-10 animate-in slide-in-from-bottom duration-200">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl shrink-0">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <h3 className="font-extrabold text-sm text-white">Ангилал сонгох</h3>
                </div>
                <button
                  onClick={() => setIsMobileCategoryOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 overflow-y-auto divide-y divide-slate-100 flex-1">
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    setSelectedSubcategory('all');
                    setIsMobileCategoryOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === 'all' ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>Бүх ангилал</span>
                  <span className="font-mono text-[11px] opacity-70">{products.length}</span>
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setSelectedSubcategory('all');
                      setIsMobileCategoryOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                      selectedCategory === cat.id ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      selectedCategory === cat.id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {getCategoryIcon(cat.iconName, "w-4 h-4")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{cat.name}</div>
                      <div className={`text-[10px] truncate ${selectedCategory === cat.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {cat.subcategories.slice(0, 2).join(', ')}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono opacity-80">{cat.productCount}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            RIGHT COLUMN: HEADER BAR, BRAND BADGES & PRODUCT GRID (9 / 12)
           ========================================================================= */}
        <main className="lg:col-span-9 space-y-3 sm:space-y-5">
          {/* ================= MOBILE QUICK ACTIONS ROW (Exact Match to Screenshot) ================= */}
          <div className="grid grid-cols-2 gap-2 lg:hidden">
            <button
              onClick={() => setIsMobileCategoryOpen(true)}
              className="flex items-center justify-between px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs active:scale-98 transition-all cursor-pointer"
            >
              <span className="truncate">Цэс {selectedCategory !== 'all' ? `(${displayCategoryTitle.slice(0, 8)}...)` : ''}</span>
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
            </button>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center justify-between px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs active:scale-98 transition-all cursor-pointer"
            >
              <span>Шүүлт {hasActiveFilters ? '•' : ''}</span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>
          </div>

          {/* ================= MOBILE NOTICE / ALERT BOX (Exact Match to Screenshot) ================= */}
          <div className="lg:hidden bg-[#fef9ee] border border-[#f9e2af] text-[#4a3419] rounded-2xl p-3 sm:p-4 space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[#5c3e10] font-black text-xs">
              <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                ⓘ
              </div>
              <span>Анхааруулга</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#614522]">
              Барилгын материалын бөөний болон төслийн захиалгыг 5–20тн крантай машинаар 24-48 цагт Odoo ERP салбар агуулахуудаас шууд хүргэнэ. MNS стандартын чанарын паспорт болон НӨАТ-ын баримт олгогдоно.
            </p>
          </div>

          {/* Top Header: Category Title | Count & Sort Dropdown */}
          <div className="flex items-center justify-between gap-2 pb-1.5 sm:pb-2 border-b border-slate-100">
            {/* Title | Count */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
              <h1 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight font-display truncate">
                {selectedCategory === 'all' ? 'Барилгын материал' : displayCategoryTitle}
              </h1>
              <span className="text-slate-300 font-light hidden sm:inline text-xl">|</span>
              <span className="text-xs sm:text-base font-medium sm:font-normal text-slate-400 shrink-0">
                ({filteredProducts.length})
              </span>
            </div>

            {/* Right side: Desktop Sort Dropdown */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Sort Dropdown Button */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-slate-200 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 pr-6 sm:pr-8 text-xs sm:text-sm font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:ring-1 focus:ring-slate-900 outline-hidden cursor-pointer"
                >
                  <option value="newest">Шинэ нь</option>
                  <option value="popular">Эрэлттэй</option>
                  <option value="price_asc">Үнэ: Багаас</option>
                  <option value="price_desc">Үнэ: Ихээс</option>
                  <option value="discount">Хямдралтай</option>
                  <option value="name">Нэрээр</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ================= BRANDS BAR: "Брэндүүд" (Desktop Only to keep Mobile ultra-clean) ================= */}
          <div className="hidden lg:block space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Брэндүүд
                </h3>
                {selectedBrandIds.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-amber-400">
                      {selectedBrandIds.length} сонгосон
                    </span>
                    <button
                      onClick={() => setSelectedBrandIds([])}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      Цэвэрлэх
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <span>{showAllBrands ? 'Хураах' : 'Бүх брэнд харах'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    showAllBrands ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Horizontal Brand Badges Strip (Multi-selectable) */}
            <div
              className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none ${
                showAllBrands ? 'flex-wrap' : 'flex-nowrap'
              }`}
            >
              {CONSTRUCTION_BRANDS.map((brand) => {
                const isSelected = selectedBrandIds.includes(brand.id);

                return (
                  <button
                    key={brand.id}
                    onClick={() => toggleBrand(brand.id)}
                    className={`relative h-16 min-w-[110px] px-2.5 py-1.5 rounded-xl border flex flex-col items-center justify-between transition-all cursor-pointer shrink-0 bg-white ${
                      isSelected
                        ? 'border-slate-950 ring-2 ring-slate-950 shadow-xs bg-amber-50/50'
                        : 'border-slate-200 hover:border-slate-400 hover:shadow-2xs'
                    }`}
                    title={brand.name}
                  >
                    {/* Active Checkmark Pill on Top-Right */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-950 text-amber-400 rounded-full flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <div
                      className="w-full py-0.5 px-1.5 rounded-md text-xs font-black tracking-wider text-center truncate flex items-center justify-center shadow-2xs"
                      style={{
                        backgroundColor: brand.bgColor,
                        color: brand.textColor,
                      }}
                    >
                      <span>{brand.shortCode}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium truncate max-w-full leading-none mb-0.5">
                      {brand.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filters Tag Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-slate-400 font-medium mr-1">Шүүлтүүр:</span>

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-medium">
                  {displayCategoryTitle}
                  <button
                    onClick={() => {
                      onSelectCategory('all');
                      setSelectedSubcategory('all');
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSubcategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium">
                  {selectedSubcategory}
                  <button
                    onClick={() => setSelectedSubcategory('all')}
                    className="hover:text-black cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBrandIds.length > 0 &&
                selectedBrandIds.map((bId) => {
                  const bObj = CONSTRUCTION_BRANDS.find((b) => b.id === bId);
                  if (!bObj) return null;
                  return (
                    <span
                      key={bId}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-medium"
                    >
                      {bObj.shortCode}
                      <button
                        onClick={() => toggleBrand(bId)}
                        className="hover:text-amber-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}

              {selectedDiscounts.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-medium">
                  Хямдрал: {selectedDiscounts.length} сонгосон
                  <button
                    onClick={() => setSelectedDiscounts([])}
                    className="hover:text-rose-950 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                  Агуулахад бэлэн
                  <button
                    onClick={() => setInStockOnly(false)}
                    className="hover:text-emerald-950 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {isMNSOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                  MNS Баталгаатай
                  <button
                    onClick={() => setIsMNSOnly(false)}
                    className="hover:text-blue-950 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">
                  Хайлт: "{searchQuery}"
                  <button
                    onClick={() => onSearchChange('')}
                    className="hover:text-purple-950 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-slate-400 hover:text-slate-900 font-medium ml-2 underline cursor-pointer"
              >
                Бүгдийг арилгах
              </button>
            </div>
          )}

          {/* ================= 4-COLUMN PRODUCT CARDS GRID (Matching Screenshot Layout) ================= */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4.5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                  onAddToRFQ={onAddToRFQ}
                  isFavorite={favoriteIds.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-2xs space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Тохирох бүтээгдэхүүн олдсонгүй
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Та сонгосон шүүлтүүр эсвэл хайлтын үгээ өөрчлөн дахин хайна уу.
                </p>
              </div>
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 rounded-xl btn-liquid-dark font-bold text-xs cursor-pointer inline-flex items-center gap-2"
              >
                Бүх барааг дахин харах
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};
