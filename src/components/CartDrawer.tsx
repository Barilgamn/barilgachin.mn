import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  AlertTriangle,
  Sparkles,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { CartItem, UnitOfMeasure } from '../types';
import { formatMNT, formatWeight, getRecommendedVehicle } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onOpenRFQ: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onOpenRFQ,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

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

  if (!isOpen) return null;

  const totalWeight = items.reduce((sum, item) => sum + item.itemWeightTotal, 0);
  const rawSubtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const discountAmount = promoApplied ? rawSubtotal * 0.05 : 0;
  const subtotal = rawSubtotal - discountAmount;
  const recommendedVehicle = getRecommendedVehicle(totalWeight);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    if (promoCode.trim().toUpperCase() === 'BARILGA5' || promoCode.trim().toUpperCase() === 'ODOO2026') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Хүчингүй код байна (Турших код: BARILGA5)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md sm:max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display flex items-center gap-2">
                  <span>Сагсалсан бараа</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 text-xs font-mono">
                    {items.length} төрөл / {totalItemCount} ширхэг
                  </span>
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-mono mt-0.5">
                  <span>Нийт жин:</span>
                  <span className="text-amber-400 font-bold">{formatWeight(totalWeight)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                  title="Сагс цэвэрлэх"
                >
                  Цэвэрлэх
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Items Content Body */}
          {items.length === 0 ? (
            <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-slate-900 font-display">Таны сагс хоосон байна</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Каталогоос хүссэн барилгын материалаа сагсандаа нэмэн хөнгөлөлт, бөөний үнэ болон шуурхай хүргэлтээ тооцоолоорой.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer hover:shadow-lg"
              >
                Барилгын материал үзэх
              </button>
            </div>
          ) : (
            <div className="p-5 overflow-y-auto flex-1 space-y-4 divide-y divide-slate-100">
              {/* Freight Logistics & Vehicle Recommendation Bar */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Тохирох тээврийн хэрэгсэл:</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-900 font-mono text-[11px] font-bold">
                    {recommendedVehicle.capacity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>{recommendedVehicle.name}</span>
                  <span className="text-amber-700 font-mono">
                    Тээвэр: ~{formatMNT(recommendedVehicle.estimatedFee)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {recommendedVehicle.description}
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-4">
                {items.map((item) => {
                  const product = item.product;
                  const nextTier = product.bulkTiers.find((t) => t.minQty > item.quantity);
                  const activeTier = [...product.bulkTiers].reverse().find((t) => item.quantity >= t.minQty);
                  const isDiscounted = activeTier && activeTier.discountPercent > 0;

                  return (
                    <div
                      key={product.id}
                      className="p-3.5 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200 flex flex-col gap-3 transition-colors shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-200 shrink-0 border border-slate-200"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                {product.brand}
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                                {product.name}
                              </h4>
                            </div>
                            <button
                              onClick={() => onRemoveItem(product.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Устгах"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-1">
                            <span className="bg-white px-1.5 py-0.5 rounded-md border border-slate-200 text-purple-800 font-bold">
                              {product.sku}
                            </span>
                            <span>• {formatWeight(item.itemWeightTotal)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bulk Tier Progression Notice */}
                      {nextTier && (
                        <div className="px-2.5 py-1.5 rounded-lg bg-purple-50/80 border border-purple-200/60 text-[11px] text-purple-900 flex items-center justify-between">
                          <span className="flex items-center gap-1 font-medium">
                            <Tag className="w-3 h-3 text-purple-600" />
                            <span>+{nextTier.minQty - item.quantity} {item.selectedUom} нэмбэл:</span>
                          </span>
                          <span className="font-bold font-mono text-purple-700">
                            -{nextTier.discountPercent}% хямдарна
                          </span>
                        </div>
                      )}

                      {/* Quantity Selector & Price Breakdown */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        {/* Stepper + Quick Bulk Add */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-300 shadow-2xs">
                            <button
                              onClick={() => onUpdateQuantity(product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-950 disabled:opacity-30 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                onUpdateQuantity(product.id, Math.max(1, val));
                              }}
                              className="w-10 text-center text-xs font-black text-slate-900 bg-transparent outline-hidden"
                            />
                            <button
                              onClick={() => onUpdateQuantity(product.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-950 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Quick Bulk Presets */}
                          <button
                            onClick={() => onUpdateQuantity(product.id, item.quantity + 10)}
                            className="px-2 py-1 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-[10px] font-bold text-slate-700 cursor-pointer"
                            title="+10 ширхэг нэмэх"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => onUpdateQuantity(product.id, item.quantity + 50)}
                            className="px-2 py-1 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-[10px] font-bold text-slate-700 cursor-pointer"
                            title="+50 ширхэг нэмэх"
                          >
                            +50
                          </button>
                        </div>

                        {/* Price Display */}
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-900">
                            {formatMNT(item.itemTotal)}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {formatMNT(item.itemTotal / item.quantity)} / {item.selectedUom}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo / Coupon Box */}
              <div className="pt-4">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Урамшууллын код (BARILGA5)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-amber-500 outline-hidden font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 btn-liquid-dark text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Ашиглах
                  </button>
                </form>
                {promoApplied && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>5% урамшууллын хөнгөлөлт тооцогдлоо!</span>
                  </div>
                )}
                {promoError && (
                  <div className="text-xs text-rose-600 mt-1">{promoError}</div>
                )}
              </div>
            </div>
          )}

          {/* Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-slate-200 space-y-4 shadow-xl">
              {/* Financial Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Барааны нийт дүн:</span>
                  <span className="font-semibold text-slate-900">{formatMNT(rawSubtotal)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Урамшууллын хөнгөлөлт (5%):</span>
                    <span>-{formatMNT(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>НӨАТ (10% орсон):</span>
                  <span className="font-semibold text-slate-900">{formatMNT(subtotal * 0.1)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-100 pt-2">
                  <span>Нийт төлөх дүн:</span>
                  <span className="text-xl font-black text-slate-950 font-display">
                    {formatMNT(subtotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Checkout & B2B RFQ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onClose();
                    onOpenRFQ();
                  }}
                  className="py-3.5 px-4 rounded-xl btn-liquid-glass text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-700" />
                  <span>B2B Үнийн санал (RFQ)</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="py-3.5 px-4 rounded-xl btn-liquid-dark font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="text-white">Захиалга баталгаажуулах</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
