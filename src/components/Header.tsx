import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Calculator,
  FileText,
  Truck,
  Phone,
  MessageSquare,
  Building2,
  ChevronDown,
  ChevronLeft,
  Layers,
  Sparkles,
  X,
  PhoneCall,
  Grid3X3,
  Blocks,
  Home,
  Paintbrush,
  Zap,
  Droplets,
  Wrench,
} from 'lucide-react';
import { POPULAR_SEARCH_TERMS } from '../data/mockData';
import { formatMNT, formatWeight } from '../utils/formatters';
import { useCategories, useProducts } from '../CatalogProvider';
import { Product } from '../types';
import { WAREHOUSE } from '../lib/contact';

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

interface HeaderProps {
  cartCount: number;
  totalCartWeight: number;
  totalCartAmount: number;
  onOpenCart: () => void;
  onOpenCalculator: () => void;
  onOpenRFQ: () => void;
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenOrderTracker: () => void;
  onOpenLiveChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  totalCartWeight,
  totalCartAmount,
  onOpenCart,
  onOpenCalculator,
  onOpenRFQ,
  onSelectCategory,
  selectedCategory,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  onOpenOrderTracker,
  onOpenLiveChat,
}) => {
  const CATEGORIES = useCategories();
  const PRODUCTS = useProducts();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Search results preview
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.mongolianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.mnsStandard && p.mnsStandard.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* =========================================================================
          MOBILE TOP APP BAR & MODERN SEARCH (High-Performance Mobile UX)
         ========================================================================= */}
      <div className="md:hidden bg-white">
        {/* Row 1: Logo, Quick Badges, Cart */}
        <div className="px-3.5 pt-2.5 pb-2 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
              onSearchChange('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-left cursor-pointer shrink-0"
            title="Нүүр хуудас"
          >
            <img
              src="https://barilgachin.mn/web/image/website/4/logo/Barilgachin?unique=5f8cd8a"
              alt="Barilgachin.mn"
              className="h-7 sm:h-8 w-auto object-contain max-w-[140px]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                const fb = document.getElementById('mobile-header-logo-fallback');
                if (fb) fb.style.display = 'flex';
              }}
            />
            <div id="mobile-header-logo-fallback" className="hidden flex-col text-left">
              <div className="text-sm font-black text-slate-900 tracking-tight font-display">
                BARILGACHIN<span className="text-amber-500">.MN</span>
              </div>
            </div>
          </a>

          {/* Quick Actions (Warehouse badge & Cart) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Агуулахын тэмдэг */}
            <a
              href={WAREHOUSE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition-colors"
              title={`${WAREHOUSE.name} — ${WAREHOUSE.address}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{WAREHOUSE.shortAddress}</span>
            </a>

            {/* Quick Live Chat */}
            <button
              onClick={onOpenLiveChat}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              title="Шуурхай чатлах"
            >
              <MessageSquare className="w-4 h-4 text-slate-700" />
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative w-8 h-8 rounded-xl btn-liquid-dark flex items-center justify-center cursor-pointer shadow-xs active:scale-95 transition-transform"
              title="Сагс"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Always-Visible Mobile Search Bar */}
        <div className="px-3.5 pb-2" ref={searchContainerRef}>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Барилгын материал, марк, брэнд хайх..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 focus:bg-white text-slate-900 rounded-xl border border-transparent focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all outline-hidden placeholder:text-slate-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Search Dropdown Results / Suggestions */}
          {isSearchFocused && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-in fade-in max-h-[70vh] overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Хайлтын үр дүн ({searchResults.length})
                  </div>
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod);
                        setIsSearchFocused(false);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {prod.name}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <span>{prod.brand}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">{prod.totalStock > 0 ? 'Бэлэн' : 'Захиалгаар'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <div className="text-xs font-black text-slate-900 font-display">
                          {formatMNT(prod.price)}
                        </div>
                        <div className="text-[9px] text-slate-400">/{prod.uom}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 px-1 py-0.5 uppercase tracking-wider">
                    Эрэлттэй түлхүүр үгс
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {POPULAR_SEARCH_TERMS.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onSearchChange(term);
                          setIsSearchFocused(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 active:bg-slate-200 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Row 3: Horizontal Scrollable Category Quick-Pills for Mobile */}
        <div className="px-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 pt-1.5">
          <button
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ✦ Бүгд
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.name.split(' ')[0]}</span>
                <span className={`text-[10px] opacity-70 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                  {cat.productCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          DESKTOP MAIN NAVBAR (Hidden on Mobile, Clean & Powerful on Desktop)
         ========================================================================= */}
      <div className="hidden md:block max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 lg:gap-6">
          {/* Logo & Category */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('all');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-left cursor-pointer group"
              title="Нүүр хуудас"
            >
              <img
                src="https://barilgachin.mn/web/image/website/4/logo/Barilgachin?unique=5f8cd8a"
                alt="Barilgachin.mn"
                className="h-10 sm:h-11 w-auto object-contain max-w-[200px] transition-transform group-hover:scale-102"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  const fb = document.getElementById('desktop-header-logo-fallback');
                  if (fb) fb.style.display = 'flex';
                }}
              />
              <div id="desktop-header-logo-fallback" className="hidden items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shadow-xs">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-slate-900 font-display leading-tight">
                    BARILGACHIN<span className="text-amber-500">.MN</span>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Барилгын их дэлгүүр
                  </div>
                </div>
              </div>
            </a>

            {/* Desktop Category Trigger Button */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                  isCategoryMenuOpen || selectedCategory !== 'all'
                    ? 'btn-liquid-dark ring-2 ring-white/20'
                    : 'btn-liquid-dark'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0 text-white" />
                <span>Ангилал</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCategoryMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Mega Category Dropdown Menu */}
              {isCategoryMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Барилгын материалын төрлүүд
                    </span>
                    <button
                      onClick={() => {
                        onSelectCategory('all');
                        setIsCategoryMenuOpen(false);
                      }}
                      className="text-xs text-slate-700 hover:text-black hover:underline font-bold cursor-pointer"
                    >
                      Бүгдийг харах
                    </button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.id);
                          setIsCategoryMenuOpen(false);
                        }}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          selectedCategory === cat.id
                            ? 'bg-slate-800 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {getCategoryIcon(cat.iconName, "w-4 h-4")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">
                            {cat.name}
                          </div>
                          <div className={`text-[11px] truncate ${selectedCategory === cat.id ? 'text-slate-300' : 'text-slate-500'}`}>
                            {cat.subcategories.slice(0, 2).join(', ')}
                          </div>
                        </div>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                          selectedCategory === cat.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {cat.productCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-xl relative" ref={searchContainerRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Бараа, марк, SKU код, MNS стандарт хайх... (жишээ: МАК цемент, 16мм арматур)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-slate-900 rounded-xl border border-transparent focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 transition-all outline-hidden placeholder:text-slate-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown / Suggestions */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 p-3 z-50 animate-in fade-in">
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 px-2.5 py-1 uppercase tracking-wider">
                      Хайлтын үр дүн ({searchResults.length})
                    </div>
                    {searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          onSelectProduct(prod);
                          setIsSearchFocused(false);
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="truncate">
                            <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                              {prod.name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <span className="font-mono text-slate-700 font-semibold">{prod.sku}</span>
                              <span>•</span>
                              <span>{prod.brand}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 pl-2">
                          <div className="text-xs sm:text-sm font-bold text-slate-900">
                            {formatMNT(prod.price)}
                          </div>
                          <div className="text-[10px] text-slate-500">/{prod.uom}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 px-2 py-1 uppercase tracking-wider">
                      Эрэлттэй хайлтууд
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5 p-1">
                      {POPULAR_SEARCH_TERMS.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            onSearchChange(term);
                            setIsSearchFocused(false);
                          }}
                          className="px-2.5 py-1 rounded-lg btn-liquid-glass text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Right Action Tools */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Calculator Button */}
            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl btn-liquid-glass text-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
              title="Барилгын материалын орц тооцоолуур"
            >
              <Calculator className="w-4 h-4 text-slate-700" />
              <span>Тооцоолуур</span>
            </button>

            {/* B2B RFQ Quote Button */}
            <button
              onClick={onOpenRFQ}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl btn-liquid-glass text-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
              title="B2B Төслийн үнийн санал авах"
            >
              <FileText className="w-4 h-4 text-slate-700" />
              <span>B2B Үнийн санал</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl btn-liquid-dark font-bold text-sm cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              <div className="flex flex-col text-left leading-tight hidden lg:flex">
                <span className="text-[11px] font-medium text-slate-300">
                  {cartCount > 0 ? `${formatWeight(totalCartWeight)}` : 'Сагс'}
                </span>
                <span className="text-xs font-black text-white">
                  {cartCount > 0 ? formatMNT(totalCartAmount) : '0 ₮'}
                </span>
              </div>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-slate-950 text-xs font-black flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
