import React, { useState, useEffect } from 'react';
import {
  Calculator,
  X,
  Plus,
  ArrowRight,
  CheckCircle2,
  Boxes,
  ShieldCheck,
  Building,
  Paintbrush,
  Sparkles,
  Truck,
  ShoppingCart,
} from 'lucide-react';
import {
  calculateWallBlocks,
  calculateConcreteMix,
  calculateInsulation,
  calculateTiling,
  calculatePaint,
} from '../utils/calculators';
import { formatMNT, formatWeight, getRecommendedVehicle } from '../utils/formatters';
import { useProducts } from '../CatalogProvider';
import { CalculationResult, Product, UnitOfMeasure } from '../types';

interface MaterialCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchAddToCart: (items: { product: Product; quantity: number; uom: UnitOfMeasure }[]) => void;
}

export const MaterialCalculatorModal: React.FC<MaterialCalculatorModalProps> = ({
  isOpen,
  onClose,
  onBatchAddToCart,
}) => {
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

  const [activeTab, setActiveTab] = useState<'wall' | 'concrete' | 'insulation' | 'tiling' | 'paint'>('wall');

  // 1. Wall inputs
  const [wallLength, setWallLength] = useState<number>(12); // meters
  const [wallHeight, setWallHeight] = useState<number>(3); // meters
  const [wallOpenings, setWallOpenings] = useState<number>(4); // m2 (windows, doors)
  const [blockThickness, setBlockThickness] = useState<number>(200); // mm

  // 2. Concrete inputs
  const [concreteVolume, setConcreteVolume] = useState<number>(15); // m3
  const [concreteGrade, setConcreteGrade] = useState<'M200' | 'M250' | 'M300'>('M250');

  // 3. Insulation inputs
  const [insulationArea, setInsulationArea] = useState<number>(120); // m2
  const [insulationThickness, setInsulationThickness] = useState<number>(100); // mm

  // 4. Tiling inputs
  const [tilingArea, setTilingArea] = useState<number>(45); // m2

  // 5. Paint inputs
  const [paintArea, setPaintArea] = useState<number>(90); // m2
  const [paintCoats, setPaintCoats] = useState<number>(2);

  const [addedBatchSuccess, setAddedBatchSuccess] = useState<boolean>(false);

  const products = useProducts();

  if (!isOpen) return null;

  // Compute active calculation
  let currentResult: CalculationResult;
  switch (activeTab) {
    case 'wall':
      currentResult = calculateWallBlocks(products, wallLength, wallHeight, wallOpenings, blockThickness);
      break;
    case 'concrete':
      currentResult = calculateConcreteMix(products, concreteVolume, concreteGrade);
      break;
    case 'insulation':
      currentResult = calculateInsulation(products, insulationArea, insulationThickness);
      break;
    case 'tiling':
      currentResult = calculateTiling(products, tilingArea);
      break;
    case 'paint':
      currentResult = calculatePaint(products, paintArea, paintCoats);
      break;
    default:
      currentResult = calculateWallBlocks(products, wallLength, wallHeight, wallOpenings);
  }

  const recommendedVehicle = getRecommendedVehicle(currentResult.totalWeight);

  const handleAddAllToCart = () => {
    const items = currentResult.requiredMaterials.map((m) => ({
      product: m.product,
      quantity: m.quantity,
      uom: m.product.uom,
    }));
    onBatchAddToCart(items);
    setAddedBatchSuccess(true);
    setTimeout(() => {
      setAddedBatchSuccess(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Барилгын материалын ухаалаг тооцоолуур
              </h3>
              <p className="text-xs text-slate-400">
                Хэмжээгээ оруулж шаардлагатай материал, бодит төсөв болон тээврийн жингээ нэг дороос тооцоол
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          {[
            { id: 'wall', label: '1. Хана, блок', icon: Building },
            { id: 'concrete', label: '2. Бетон, цемент', icon: Boxes },
            { id: 'insulation', label: '3. Дулаалга', icon: ShieldCheck },
            { id: 'tiling', label: '4. Плита цавуу', icon: Boxes },
            { id: 'paint', label: '5. Дотор будаг', icon: Paintbrush },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 flex items-center justify-center gap-1.5 transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-slate-900 text-slate-950 bg-white font-bold shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body: Inputs on Left, Result on Right */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50">
          {/* Left Column: Form Inputs */}
          <div className="md:col-span-6 space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Хэмжээ ба параметрүүд
            </h4>

            {activeTab === 'wall' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ханын нийт урт (метр)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={wallLength}
                    onChange={(e) => setWallLength(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ханын өндөр (метр)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={wallHeight}
                    onChange={(e) => setWallHeight(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Хаалга, цонхны хасагдах талбай (м²)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={wallOpenings}
                    onChange={(e) => setWallOpenings(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Блокийн зузаан (Евроблок AAC D600)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBlockThickness(200)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        blockThickness === 200
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      200 мм (Хуваалт / Гадна хана)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlockThickness(300)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        blockThickness === 300
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      300 мм (Өвлийн даацын бус хана)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'concrete' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Цутгалт хийх бетоны эзлэхүүн (м³)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={concreteVolume}
                    onChange={(e) => setConcreteVolume(Math.max(0.5, parseFloat(e.target.value) || 1))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden font-bold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Суурийн хавтан, багана, дам нуруу, шалны тэгшилгээний нийт эзлэхүүн
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Бетоны марк (Бат бэхийн зэрэг)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['M200', 'M250', 'M300'] as const).map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setConcreteGrade(grade)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          concreteGrade === grade
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {grade} (B{grade === 'M200' ? '15' : grade === 'M250' ? '20' : '22.5'})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insulation' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Дулаалах хана, дээврийн талбай (м²)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={insulationArea}
                    onChange={(e) => setInsulationArea(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Эрдэс хөвөнгийн зузаан (KNAUF Insulation)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setInsulationThickness(50)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        insulationThickness === 50
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      50 мм (Дотор хуваалт, 2 давхар)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInsulationThickness(100)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        insulationThickness === 100
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      100 мм (Гадна хана, Дээвэр)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tiling' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Плита наах шал болон ханын нийт талбай (м²)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={tilingArea}
                    onChange={(e) => setTilingArea(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden font-bold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    KNAUF Fliesen 25кг цавууны зарцуулалт 4кг/м² тооцно.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'paint' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Будах ханын нийт талбай (м²)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={paintArea}
                    onChange={(e) => setPaintArea(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Будах үеийн тоо (Давхарга)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((coat) => (
                      <button
                        key={coat}
                        type="button"
                        onClick={() => setPaintCoats(coat)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          paintCoats === coat
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {coat} үе будах
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Calculated Results & Batch Cart Action */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                    Тооцооллын үр дүн
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {currentResult.title}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                  {currentResult.category}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100 font-medium">
                {currentResult.summary}
              </div>

              {/* Material breakdown items */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Шаардагдах баталгаат материалууд:
                </div>
                {currentResult.requiredMaterials.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          {item.product.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.note}</div>
                        <div className="text-[11px] text-purple-700 font-mono font-semibold">
                          Тоо хэмжээ: {item.quantity} {item.unit}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <div className="text-xs font-black text-slate-900">
                        {formatMNT(item.estimatedCost)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Logistics Summary */}
              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">Нийт ачааны жин</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {formatWeight(currentResult.totalWeight)}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[11px] text-amber-800 font-medium">Нийт баримжаа дүн</span>
                  <div className="text-sm font-black text-amber-950 mt-0.5">
                    {formatMNT(currentResult.totalEstimatedCost)}
                  </div>
                </div>
              </div>

              {/* Vehicle logistics recommendation */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-white text-xs">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="flex-1 truncate">
                  <span className="text-slate-400">Тээвэр: </span>
                  <span className="font-semibold text-white">{recommendedVehicle.name}</span>
                </div>
              </div>
            </div>

            {/* Batch Add to Cart CTA */}
            <button
              onClick={handleAddAllToCart}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                addedBatchSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'btn-liquid-dark'
              }`}
            >
              {addedBatchSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span className="text-white">Сагсанд амжилттай нэмэгдлээ!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <span className="text-white">Бүх тооцоолсон материалыг сагсанд нэмэх</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
