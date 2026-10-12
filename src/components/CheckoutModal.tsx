import React, { useState, useEffect } from 'react';
import { useWarehouses } from '../CatalogProvider';
import {
  X,
  CheckCircle2,
  Truck,
  Building2,
  QrCode,
  CreditCard,
  FileText,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  ArrowRight,
  ArrowLeft,
  Database,
  Check,
  Copy,
  Printer,
  Sparkles,
  Download,
  Clock,
  Warehouse,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';
import { formatMNT, formatWeight, getRecommendedVehicle } from '../utils/formatters';
import { placeOrder } from '../lib/orders';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (orderRef: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const WAREHOUSES = useWarehouses();
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

  // Step Wizard State (1: Customer -> 2: Shipping/Pickup -> 3: VAT/E-barimt -> 4: Payment)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Customer Info
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [customerType, setCustomerType] = useState<'individual' | 'corporate'>('individual');

  // Step 2: Delivery vs Pickup
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedPickupBranch, setSelectedPickupBranch] = useState(WAREHOUSES[0].branchId);
  const [district, setDistrict] = useState('');
  const [khoroo, setKhoroo] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Step 3: VAT / E-barimt 3.0
  const [vatType, setVatType] = useState<'individual' | 'company'>('individual');
  const [companyRegister, setCompanyRegister] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [vatEmail, setVatEmail] = useState('');

  // Step 4: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'qpay' | 'socialpay' | 'khanbank' | 'storepay' | 'invoice_odoo'>('qpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Completed Order State
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderCompleted, setOrderCompleted] = useState<{
    orderNumber: string;
    total: number;
    deliveryFee: number;
    weightKg: number;
    timestamp: string;
  } | null>(null);

  if (!isOpen) return null;

  const totalWeight = items.reduce((sum, item) => sum + item.itemWeightTotal, 0);
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const recommendedVehicle = getRecommendedVehicle(totalWeight);

  const deliveryFee = deliveryType === 'delivery' ? recommendedVehicle.estimatedFee : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return customerName.trim().length > 1 && phone.trim().length >= 6;
    }
    if (step === 2) {
      if (deliveryType === 'delivery') {
        return streetAddress.trim().length > 3;
      }
      return true;
    }
    if (step === 3) {
      if (vatType === 'company') {
        return companyRegister.trim().length >= 5;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as any);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setOrderError(null);

    try {
      const placed = await placeOrder(
        {
          name: customerName,
          phone,
          email,
          customerType,
          companyName: vatType === 'company' ? companyName : undefined,
          companyRegister: vatType === 'company' ? companyRegister : undefined,
        },
        {
          deliveryType,
          warehouseCode: deliveryType === 'pickup' ? selectedPickupBranch : undefined,
          district,
          khoroo,
          streetAddress,
          notes: deliveryNotes,
        },
        { vatType, companyRegister, companyName, vatEmail },
        paymentMethod,
        items,
      );

      setOrderCompleted({
        orderNumber: placed.orderNo,
        total: placed.total,
        deliveryFee: placed.deliveryFee,
        weightKg: placed.weightKg,
        timestamp: new Date().toLocaleString('mn-MN'),
      });

      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch {
        // Баярын эффект бүтэхгүй бол захиалгад хамаагүй.
      }

      onOrderSuccess(placed.orderNo);
    } catch (err) {
      setOrderError(
        err instanceof Error ? err.message : 'Захиалга илгээхэд алдаа гарлаа.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Захиалагч' },
    { num: 2, label: 'Хүргэлт & Салбар' },
    { num: 3, label: 'НӨАТ 3.0' },
    { num: 4, label: 'Төлбөр' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-display">
                  Захиалга баталгаажуулах & Төлбөр
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800 text-[10px] font-mono">
                  <Database className="w-3 h-3 text-purple-400" />
                  Баталгаат захиалга
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Захиалгын мэдээлэл манай системд бүртгэгдэж, борлуулалтын менежер холбогдоно
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Wizard Bar */}
        {!orderCompleted && (
          <div className="bg-slate-100/80 px-6 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-300 w-full z-0"></div>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-amber-500 transition-all duration-300 z-0"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>

              {stepsList.map((step) => {
                const isPassed = currentStep > step.num;
                const isCurrent = currentStep === step.num;

                return (
                  <div key={step.num} className="relative z-10 flex flex-col items-center">
                    <button
                      onClick={() => {
                        if (step.num < currentStep || validateStep(currentStep)) {
                          setCurrentStep(step.num as any);
                        }
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/30 font-black shadow-md'
                          : 'bg-white text-slate-500 border border-slate-300'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : step.num}
                    </button>
                    <span
                      className={`text-[10px] font-bold mt-1 whitespace-nowrap hidden sm:block ${
                        isCurrent ? 'text-amber-800' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Main Body */}
        {orderCompleted ? (
          <div className="p-8 text-center space-y-6 flex-1 overflow-y-auto">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-black text-slate-900 font-display">
                Захиалга амжилттай баталгаажлаа!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Баярлалаа! Таны барилгын материалын захиалга бүртгэгдэж, агуулахын ачилтын дараалалд орлоо.
              </p>
            </div>

            {/* Захиалгын хураангуй — дүнг бааз өөрөө тооцсон. */}
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Цахим захиалгын дугаар:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-900">{orderCompleted.orderNumber}</span>
                  <button
                    onClick={() => handleCopy(orderCompleted.orderNumber, 'order')}
                    className="p-1 text-slate-400 hover:text-slate-900"
                    title="Хуулах"
                  >
                    {copiedField === 'order' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Хүлээн авагч:</span>
                <span className="font-semibold text-slate-900">{customerName} ({phone})</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Хүргэлтийн хаяг / Агуулах:</span>
                <span className="font-semibold text-slate-900 text-right max-w-xs truncate">
                  {deliveryType === 'delivery'
                    ? [district, khoroo, streetAddress].filter(Boolean).join(', ')
                    : 'Агуулахаас өөрөө ачих'}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Нийт жин & Тээврийн ангилал:</span>
                <span className="font-semibold text-slate-900">
                  {formatWeight(orderCompleted.weightKg)} •{' '}
                  {getRecommendedVehicle(orderCompleted.weightKg).name}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Хүргэлтийн төлбөр:</span>
                <span className="font-semibold text-slate-900">
                  {orderCompleted.deliveryFee > 0
                    ? formatMNT(orderCompleted.deliveryFee)
                    : 'Өөрөө ачих'}
                </span>
              </div>

              <div className="flex justify-between font-bold text-sm pt-1 text-slate-900">
                <span>Нийт төлбөрийн дүн:</span>
                <span className="text-amber-600 font-black font-display text-base">
                  {formatMNT(orderCompleted.total)}
                </span>
              </div>
            </div>

            {/* Print & Return Actions */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a
                href={`/zahialga?order=${encodeURIComponent(orderCompleted.orderNumber)}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Захиалга, нэхэмжлэх харах</span>
              </a>

              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                Дэлгүүр рүү буцах
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCompleteOrder} className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/60">
            {/* Left Column: Multi-Step Interactive Form (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* STEP 1: Customer Contact & Project Info */}
              {currentStep === 1 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-600" />
                      <span>1. Захиалагчийн мэдээлэл</span>
                    </h4>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setCustomerType('individual')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          customerType === 'individual'
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Хувь хүн
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomerType('corporate')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          customerType === 'corporate'
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Компани / Төсөл
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Хүлээн авагчийн нэр *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Овог нэр"
                        className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Холбогдох утасны дугаар *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9911-XXXX"
                        className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden font-medium font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        И-мэйл хаяг (Нэхэмжлэх очих)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@domain.mn"
                        className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Барилгын төслийн нэр / Объект
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Жишээ: Шинэ зуун мод хотхон"
                        className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Delivery vs Pickup */}
              {currentStep === 2 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs animate-in fade-in">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-600" />
                      <span>2. Хүргэлтийн хэлбэр ба Байршил</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-3.5 rounded-2xl border font-bold text-left transition-all cursor-pointer ${
                        deliveryType === 'delivery'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm ring-2 ring-amber-400/30'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-sm">🚚 Барилгын талбайд хүргүүлэх</div>
                      <div className="text-[11px] font-normal mt-1 opacity-90">
                        УБ хот даяар 2-4 цагт шуурхай
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-3.5 rounded-2xl border font-bold text-left transition-all cursor-pointer ${
                        deliveryType === 'pickup'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm ring-2 ring-amber-400/30'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-sm">🏬 4 агуулахаас өөрөө ачих</div>
                      <div className="text-[11px] font-normal mt-1 opacity-90">
                        Тээврийн төлбөргүй шууд ачилт
                      </div>
                    </button>
                  </div>

                  {deliveryType === 'delivery' ? (
                    <div className="space-y-3 pt-1 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Дүүрэг *</label>
                          <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                          >
                            <option value="Хан-Уул дүүрэг">Хан-Уул дүүрэг</option>
                            <option value="Баянзүрх дүүрэг">Баянзүрх дүүрэг</option>
                            <option value="Сонгинохайрхан дүүрэг">Сонгинохайрхан дүүрэг</option>
                            <option value="Баянгол дүүрэг">Баянгол дүүрэг</option>
                            <option value="Сүхбаатар дүүрэг">Сүхбаатар дүүрэг</option>
                            <option value="Чингэлтэй дүүрэг">Чингэлтэй дүүрэг</option>
                            <option value="Налайх дүүрэг">Налайх дүүрэг</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Хороо / Бүс *</label>
                          <input
                            type="text"
                            value={khoroo}
                            onChange={(e) => setKhoroo(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Дэлгэрэнгүй хаяг, төслийн талбайн орц гарц *
                        </label>
                        <input
                          type="text"
                          required
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder="Гудамж, хороолол, байшингийн дугаар"
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Жолоочид өгөх тусгай заавар (Кран, буулгах нөхцөл)
                        </label>
                        <input
                          type="text"
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="Жишээ: Арын хаалгаар орно, манипулятор хэрэгтэй"
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 text-xs space-y-3">
                      <label className="block font-bold text-slate-700">
                        Ачих салбар агуулах сонгох:
                      </label>
                      <div className="space-y-2">
                        {WAREHOUSES.map((w) => (
                          <label
                            key={w.branchId}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              selectedPickupBranch === w.branchId
                                ? 'bg-amber-50/80 border-amber-500 ring-1 ring-amber-400'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="pickupBranch"
                              value={w.branchId}
                              checked={selectedPickupBranch === w.branchId}
                              onChange={() => setSelectedPickupBranch(w.branchId)}
                              className="mt-0.5 text-amber-500"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{w.branchName}</div>
                              <div className="text-[11px] text-slate-500">{w.address}</div>
                              <div className="text-[10px] text-purple-700 font-mono mt-0.5 font-bold">
                                {w.locationCode}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: VAT / E-barimt 3.0 */}
              {currentStep === 3 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>3. НӨАТ баримт (E-barimt 3.0)</span>
                    </h4>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setVatType('company')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          vatType === 'company'
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Байгууллага (ТТД)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVatType('individual')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          vatType === 'individual'
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Хувь хүн (Сугалаа)
                      </button>
                    </div>
                  </div>

                  {vatType === 'company' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Байгууллагын ТТД регистр *
                        </label>
                        <input
                          type="text"
                          required
                          value={companyRegister}
                          onChange={(e) => setCompanyRegister(e.target.value)}
                          placeholder="Жишээ: 1234567"
                          className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:bg-white focus:border-amber-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Байгууллагын нэр (Авто таталт)
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="ХХК, ХК"
                          className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Санхүүгийн цахим нэхэмжлэх илгээх и-мэйл
                        </label>
                        <input
                          type="email"
                          value={vatEmail}
                          onChange={(e) => setVatEmail(e.target.value)}
                          placeholder="accounting@company.mn"
                          className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-1.5">
                      <div className="font-bold text-slate-900">Хувь хүний E-barimt баримт</div>
                      <p className="text-slate-600">
                        Төлбөр төлөгдсөний дараа таны бүртгэлтэй утасны дугаарт сугалааны дугаар болон QR холбоос SMS-ээр илгээгдэнэ.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Payment Methods & Order Creation */}
              {currentStep === 4 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs animate-in fade-in">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>4. Төлбөрийн хэрэгсэл сонгох</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {[
                      { id: 'qpay', label: 'QPay QR', desc: 'Бүх банкны апп', icon: QrCode },
                      { id: 'socialpay', label: 'SocialPay', desc: 'Голомт банк', icon: CreditCard },
                      { id: 'khanbank', label: 'Хаан Банк', desc: 'Корпорэйт гүйлгээ', icon: Building2 },
                      { id: 'invoice_odoo', label: 'Нэхэмжлэхээр', desc: 'Гэрээт B2B нэхэмжлэх', icon: Database },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-slate-950 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                          <div className="font-bold">{method.label}</div>
                          <div className="text-[10px] text-slate-500">{method.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive QPay preview */}
                  {paymentMethod === 'qpay' && (
                    <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                        <QrCode className="w-20 h-20 text-slate-950" />
                      </div>
                      <div className="text-xs space-y-1.5 text-center sm:text-left">
                        <div className="font-extrabold text-white text-sm">
                          QPay Шуурхай төлөлт идэвхтэй
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          Хаан банк, Голомт, Хас, Төрийн банк, Most Money, MBank аппликейшнээр шууд уншуулан баталгаажуулна.
                        </p>
                        <span className="inline-block font-mono text-amber-400 font-bold text-xs">
                          Дүн: {formatMNT(grandTotal)}
                        </span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'invoice_odoo' && (
                    <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs space-y-2">
                      <div className="font-bold text-purple-950 flex items-center gap-2">
                        <Database className="w-4 h-4 text-purple-700" />
                        <span>B2B цахим нэхэмжлэх үүснэ</span>
                      </div>
                      <p className="text-purple-900 leading-relaxed text-[11px]">
                        Захиалга батлагдмагц байгууллагын ТТД <strong>{companyRegister || '6784912'}</strong> дээр албан ёсны цахим нэхэмжлэх (Invoice) үүсэж таны и-мэйл хаягаар илгээгдэнэ.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Буцах</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer ml-auto"
                  >
                    <span>Дараах алхам</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout Trigger (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Захиалгын хураангуй ({items.length} бараа)
                  </h4>
                  <span className="text-[11px] font-mono text-amber-700 font-bold">
                    {formatWeight(totalWeight)}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.product.id} className="pt-2 flex justify-between text-xs">
                      <div className="truncate pr-2">
                        <div className="font-bold text-slate-900 truncate">
                          {item.product.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.quantity} {item.selectedUom} x {formatMNT(item.itemTotal / item.quantity)}
                        </div>
                      </div>
                      <div className="font-extrabold text-slate-900 shrink-0">
                        {formatMNT(item.itemTotal)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Freight summary */}
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="flex justify-between text-amber-950 font-bold">
                    <span>Тээвэрлэлтийн ангилал:</span>
                    <span className="font-mono">{recommendedVehicle.name}</span>
                  </div>
                  <div className="text-[11px] text-amber-900">
                    {deliveryType === 'delivery' ? 'Хаягаар хүргэлттэй' : 'Салбараас өөрөө ачих'}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Барааны дүн:</span>
                    <span className="font-semibold text-slate-900">{formatMNT(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Хүргэлтийн хөлс:</span>
                    <span className="font-semibold text-slate-900">{formatMNT(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>НӨАТ (10% багтсан):</span>
                    <span className="font-semibold text-slate-900">{formatMNT(grandTotal * 0.1)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                    <span>Нийт төлөх дүн:</span>
                    <span className="text-xl font-black text-amber-600 font-display">
                      {formatMNT(grandTotal)}
                    </span>
                  </div>
                </div>

                {orderError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"
                  >
                    {orderError}
                  </p>
                )}

                {/* Submit button when on final step */}
                {currentStep === 4 ? (
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-4 rounded-xl btn-liquid-dark font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Database className="w-4 h-4 text-white animate-spin" />
                        <span className="text-white">Захиалга бүртгэж байна...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-white">Төлбөр төлж захиалга үүсгэх</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                ) : null}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
