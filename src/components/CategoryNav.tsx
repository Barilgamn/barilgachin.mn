import React from 'react';
import { useCategories } from '../CatalogProvider';

import {
  Truck,
  Grid3X3,
  Blocks,
  Home,
  Paintbrush,
  Zap,
  Droplets,
  Wrench,
  Layers,
  ArrowRight,
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

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const CATEGORIES = useCategories();
  return (
    <section className="py-8 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Барилгын үндсэн ангиллууд
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Барилга угсралт, инженерийн шугам сүлжээ, дотор ба гадна заслын төрлүүд
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1"
            >
              Бүх бараа харах ➜
            </button>
          )}
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative overflow-hidden rounded-2xl p-4 transition-all cursor-pointer border flex flex-col justify-between h-36 sm:h-40 ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40 shadow-md'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Background image preview with soft overlay */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-2xs'
                          : 'bg-white border border-slate-200 text-amber-600 shadow-2xs'
                      }`}
                    >
                      {getCategoryIcon(cat.iconName, "w-3.5 h-3.5")}
                    </div>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-bold ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {cat.productCount} нэр төрөл
                    </span>
                  </div>
                  <h3
                    className={`text-sm sm:text-base font-bold leading-snug line-clamp-2 transition-colors ${
                      isSelected
                        ? 'text-amber-950'
                        : 'text-slate-900 group-hover:text-amber-600'
                    }`}
                  >
                    {cat.name}
                  </h3>
                </div>

                <div className="relative z-10 pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate text-[11px]">{cat.featuredBrand}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-600 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
