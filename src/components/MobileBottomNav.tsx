import React from 'react';
import {
  Home,
  Layers,
  Star,
  Tag,
  Heart,
  User,
  ShoppingCart,
} from 'lucide-react';

export type MobileTab = 'home' | 'categories' | 'featured' | 'brands' | 'saved' | 'profile';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  savedCount: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenCategories: () => void;
  onOpenBrands: () => void;
  onOpenFeatured: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount,
  cartCount,
  onOpenCart,
  onOpenCategories,
  onOpenBrands,
  onOpenFeatured,
}) => {
  return (
    <nav
      id="mobile-bottom-dock"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-2xl py-1 px-1 flex items-center justify-around safe-area-pb"
    >
      {/* 1. Нүүр (Home) */}
      <button
        onClick={() => {
          onTabChange('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center py-1 px-2 relative transition-all cursor-pointer ${
          activeTab === 'home' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {activeTab === 'home' && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -top-1"></span>
        )}
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Нүүр</span>
      </button>

      {/* 2. Ангилал (Categories) */}
      <button
        onClick={() => {
          onTabChange('categories');
          onOpenCategories();
        }}
        className={`flex flex-col items-center justify-center py-1 px-2 relative transition-all cursor-pointer ${
          activeTab === 'categories' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {activeTab === 'categories' && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -top-1"></span>
        )}
        <Layers className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Ангилал</span>
      </button>

      {/* 3. Онцлох (Featured) */}
      <button
        onClick={() => {
          onTabChange('featured');
          onOpenFeatured();
        }}
        className={`flex flex-col items-center justify-center py-1 px-2 relative transition-all cursor-pointer ${
          activeTab === 'featured' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {activeTab === 'featured' && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -top-1"></span>
        )}
        <Star className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Онцлох</span>
      </button>

      {/* 4. Брэндүүд (Brands) */}
      <button
        onClick={() => {
          onTabChange('brands');
          onOpenBrands();
        }}
        className={`flex flex-col items-center justify-center py-1 px-2 relative transition-all cursor-pointer ${
          activeTab === 'brands' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {activeTab === 'brands' && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -top-1"></span>
        )}
        <Tag className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Брэндүүд</span>
      </button>

      {/* 5. Хадгалсан (Saved) */}
      <button
        onClick={() => {
          onTabChange('saved');
        }}
        className={`flex flex-col items-center justify-center py-1 px-2 relative transition-all cursor-pointer ${
          activeTab === 'saved' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {activeTab === 'saved' && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -top-1"></span>
        )}
        <div className="relative">
          <Heart className={`w-5 h-5 mb-0.5 ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight">Хадгалсан</span>
      </button>

      {/* 6. Профайл */}
      <button
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center justify-center py-1 px-2 relative transition-all cursor-pointer ${
          activeTab === 'profile' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {activeTab === 'profile' && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -top-1"></span>
        )}
        <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center mb-0.5 border border-slate-300">
          <User className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] tracking-tight">Профайл</span>
      </button>
    </nav>
  );
};
