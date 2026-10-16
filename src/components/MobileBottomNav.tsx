import React from 'react';
import { Home, Layers, Heart, Phone, ShoppingCart } from 'lucide-react';

export type MobileTab = 'home' | 'categories' | 'saved';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  savedCount: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenCategories: () => void;
  onOpenMore: () => void;
}

/** Идэвхтэй таб дээр гарах шар цэг. */
const Dot: React.FC = () => (
  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -top-1" />
);

const itemClass = (active: boolean) =>
  `flex flex-col items-center justify-center py-1 px-2 relative transition-all cursor-pointer ${
    active ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
  }`;

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount,
  cartCount,
  onOpenCart,
  onOpenCategories,
  onOpenMore,
}) => {
  return (
    <nav
      id="mobile-bottom-dock"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-2xl py-1 px-1 flex items-center justify-around safe-area-pb"
    >
      {/* Нүүр */}
      <button
        onClick={() => {
          onTabChange('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={itemClass(activeTab === 'home')}
      >
        {activeTab === 'home' && <Dot />}
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Нүүр</span>
      </button>

      {/* Ангилал — ангиллын жагсаалтыг нээнэ */}
      <button
        onClick={() => {
          onTabChange('categories');
          onOpenCategories();
        }}
        className={itemClass(activeTab === 'categories')}
      >
        {activeTab === 'categories' && <Dot />}
        <Layers className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Ангилал</span>
      </button>

      {/* Сагс — таб биш, сагсны хаалтыг нээнэ тул идэвхтэй төлөвгүй */}
      <button onClick={onOpenCart} className={itemClass(false)}>
        <div className="relative">
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight">Сагс</span>
      </button>

      {/* Хадгалсан */}
      <button
        onClick={() => onTabChange('saved')}
        className={itemClass(activeTab === 'saved')}
      >
        {activeTab === 'saved' && <Dot />}
        <div className="relative">
          <Heart
            className={`w-5 h-5 mb-0.5 ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`}
          />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight">Хадгалсан</span>
      </button>

      {/* Холбоо барих — хуудас биш, доороос нээгддэг хуудас тул идэвхтэй
          төлөвгүй. Өмнө нь энд «Профайл» байсан ч бүртгэл байхгүй учраас
          дарахад юу ч болдоггүй байв. */}
      <button onClick={onOpenMore} className={itemClass(false)}>
        <Phone className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Холбоо</span>
      </button>
    </nav>
  );
};
