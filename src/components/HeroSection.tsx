import React from 'react';
import {
  Calculator,
  FileText,
  Truck,
  CheckCircle2,
  Database,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  Zap,
} from 'lucide-react';
import { formatMNT } from '../utils/formatters';

interface HeroSectionProps {
  onOpenCalculator: () => void;
  onOpenRFQ: () => void;
  onOpenOdooModal: () => void;
  onSelectCategory: (catId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCalculator,
  onOpenRFQ,
  onOpenOdooModal,
  onSelectCategory,
}) => {
  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50 to-amber-50/20 text-slate-900 border-b border-slate-200/80 overflow-hidden py-9 lg:py-14">
      {/* Subtle light architectural grid background */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* Decorative gradient soft accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-bold text-amber-900 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Монголын №1 Барилгын материалын их дэлгүүр</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight font-display">
              Барилгын сууриас дээвэр хүртэлх бүх материал <br className="hidden sm:inline" />
              <span className="text-amber-600">
                Агуулахын бодит үлдэгдэлтэй
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
              МАК, Монцемент, КНАУФ, Hilti зэрэг тэргүүлэгч үйлдвэрүүдийн MNS чанарын гэрчилгээтэй материалыг бөөний болон жижиглэнгийн үнээр 4 том агуулахаас шуурхай татан авалт хийнэ үү.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenCalculator}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Calculator className="w-5 h-5" />
                <span>Материалын тооцоолуур</span>
              </button>

              <button
                onClick={onOpenRFQ}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-sm font-bold shadow-xs hover:border-slate-400 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-purple-600" />
                <span>B2B Төслийн үнийн санал</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-slate-200/90">
              <div>
                <div className="text-2xl font-black text-slate-900 font-display">10,840+</div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">Баталгаат бүтээгдэхүүн</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-600 font-display">4 Агуулах</div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">УБ хотод бодит үлдэгдэл</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 font-display">2-4 Цаг</div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">Шуурхай крантай хүргэлт</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600 font-display">100% MNS</div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">Чанарын гэрчилгээтэй</div>
              </div>
            </div>
          </div>

          {/* Hero Feature Cards / Interactive Widgets */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Inventory Preview Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg shadow-slate-200/50 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Агуулахын шууд үлдэгдэл</h2>
                    <span className="text-[11px] text-slate-500">Төв ба салбар агуулахууд</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                  ШУУД ҮЛДЭГДЭЛ
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'МАК Евроцемент PC 42.5', stock: '7,190 шуудай', code: 'CEM-MAK-PC425', price: '18,500 ₮', branch: '4 салбар бэлэн' },
                  { name: 'МАК Евроблок AAC D600', stock: '10,550 ширхэг', code: 'BLK-MAK-AAC600', price: '9,800 ₮', branch: '3 салбар бэлэн' },
                  { name: 'Арматур Ф16мм A500C', stock: '3,850 ширхэг (73 тн)', code: 'STL-REB-D16', price: '44,200 ₮', branch: '2 салбар бэлэн' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between text-xs hover:border-slate-300 hover:bg-slate-50 transition-all">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                        <span className="text-purple-600 font-semibold">{item.code}</span>
                        <span>•</span>
                        <span className="text-slate-500">{item.branch}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-amber-700">{item.price}</div>
                      <div className="text-[11px] text-emerald-600 font-semibold">{item.stock}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Үлдэгдэл 100% баталгаатай
                </span>
                <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                  ● Шууд ачилтын бэлэн байдал
                </span>
              </div>
            </div>

            {/* Quick Material Calculator Promo Card */}
            <div
              onClick={onOpenCalculator}
              className="bg-gradient-to-r from-amber-50 via-amber-50/60 to-white border border-amber-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-amber-400 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    Материалын орц, төсөв тооцоолох
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Хана өрлөг, бетон цутгалт, дулаалгын эрдэс хөвөнгөө шууд тооцоолж сагслаарай
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
