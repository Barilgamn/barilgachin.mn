import React, { useState, useEffect } from 'react';
import {
  FileText,
  X,
  Plus,
  Trash2,
  Building2,
  CheckCircle2,
  Send,
  Download,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Database,
  ArrowRight,
} from 'lucide-react';
import { useProducts } from '../CatalogProvider';
import { Product, UnitOfMeasure } from '../types';

import { formatMNT } from '../utils/formatters';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
}

export const RFQModal: React.FC<RFQModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
}) => {
  const PRODUCTS = useProducts();
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

  const [companyName, setCompanyName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectLocation, setProjectLocation] = useState('Хан-Уул дүүрэг, Яармагийн шинэ суурьшлын бүс');
  const [requiredDate, setRequiredDate] = useState('2026-09-10');
  const [deliveryNeeded, setDeliveryNeeded] = useState(true);
  const [notes, setNotes] = useState('');

  // Items in the RFQ
  const [rfqItems, setRfqItems] = useState<
    { product: Product; quantity: number; notes: string }[]
  >(() => {
    if (initialProduct) {
      return [{ product: initialProduct, quantity: 100, notes: 'Төслийн 1-р ээлжийн татан авалт' }];
    }
    return [
      { product: PRODUCTS[0], quantity: 200, notes: 'Суурийн цутгалт' },
      { product: PRODUCTS[1], quantity: 500, notes: 'Гадна өрлөг' },
    ];
  });

  const [selectedAddProductId, setSelectedAddProductId] = useState<string>(PRODUCTS[2].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const prod = PRODUCTS.find((p) => p.id === selectedAddProductId);
    if (prod && !rfqItems.some((item) => item.product.id === prod.id)) {
      setRfqItems([...rfqItems, { product: prod, quantity: 50, notes: '' }]);
    }
  };

  const handleRemoveItem = (idx: number) => {
    setRfqItems(rfqItems.filter((_, i) => i !== idx));
  };

  const handleUpdateQuantity = (idx: number, qty: number) => {
    const newItems = [...rfqItems];
    newItems[idx].quantity = Math.max(1, qty);
    setRfqItems(newItems);
  };

  const handleUpdateNotes = (idx: number, noteText: string) => {
    const newItems = [...rfqItems];
    newItems[idx].notes = noteText;
    setRfqItems(newItems);
  };

  const totalEstimated = rfqItems.reduce((sum, item) => {
    // calculate bulk price if eligible
    const activeBulkTier = [...item.product.bulkTiers]
      .reverse()
      .find((t) => item.quantity >= t.minQty);
    const unitPrice = activeBulkTier ? activeBulkTier.price : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const handleSubmitToOdoo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !phone) {
      alert('Байгууллагын нэр болон холбоо барих утсыг заавал бөглөнө үү.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedLead = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedLeadId(generatedLead);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">
                  B2B Төслийн үнийн санал авах (RFQ)
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Database className="w-3 h-3" />
                  Борлуулалтын баг
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Барилгын компани, гүйцэтгэгчдэд зориулсан тусгай бөөний үнэ болон албан ёсны үнийн санал
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

        {/* Form Body or Success State */}
        {submittedLeadId ? (
          <div className="p-8 text-center space-y-6 flex-1 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-slate-900 font-display">
                Үнийн саналын хүсэлт амжилттай үүслээ!
              </h4>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Таны хүсэлт бүртгэгдсэн бөгөөд манай B2B төслийн менежер <strong>15-30 минутын дотор</strong> албан ёсны үнийн саналыг илгээнэ.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Хүсэлтийн дугаар:</span>
                <span className="font-mono font-bold text-purple-700">{submittedLeadId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Компани:</span>
                <span className="font-semibold text-slate-900">{companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Барааны тоо төрөл:</span>
                <span className="font-semibold text-slate-900">{rfqItems.length} нэр төрөл</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                <span>Баримжаа дүн:</span>
                <span className="text-amber-600">{formatMNT(totalEstimated)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl btn-liquid-dark text-white font-bold text-xs cursor-pointer"
              >
                Хаах
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitToOdoo} className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Step 1: Company & Project Information */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>1. Байгууллага & Төслийн мэдээлэл</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Компанийн нэр *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Жишээ: Монгол Барилга Констракшн ХХК"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Регистрийн дугаар
                  </label>
                  <input
                    type="text"
                    placeholder="Жишээ: 1234567"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Хариуцах инженер / Менежер
                  </label>
                  <input
                    type="text"
                    placeholder="Нэр"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Холбоо барих утас *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Жишээ: 9911-2233"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    И-мэйл хаяг
                  </label>
                  <input
                    type="email"
                    placeholder="info@company.mn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Төслийн талбайн байршил
                  </label>
                  <input
                    type="text"
                    placeholder="Дүүрэг, хороо, төслийн нэр"
                    value={projectLocation}
                    onChange={(e) => setProjectLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Selected Materials Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>2. Үнийн санал авах барилгын материалын жагсаалт</span>
                </h4>

                {/* Add new product picker */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedAddProductId}
                    onChange={(e) => setSelectedAddProductId(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium outline-hidden"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.brand})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Нэмэх
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 bg-white">
                {rfqItems.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{item.product.name}</div>
                        <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                          <span className="text-purple-600 font-bold">{item.product.sku}</span>
                          <span>•</span>
                          <span>{item.product.brand}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">Тоо:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(idx, parseInt(e.target.value) || 1)}
                          className="w-20 px-2 py-1 text-xs font-bold text-center bg-slate-100 rounded-lg border border-slate-200 outline-hidden"
                        />
                        <span className="text-xs text-slate-600 font-medium">{item.product.uom}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Устгах"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Additional Notes & Submissions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Тусгай хүсэлт, төлбөрийн болон хүргэлтийн нөхцөл
                </label>
                <textarea
                  rows={2}
                  placeholder="Жишээ: Төлбөрийг 50/50 төлөх, Барилгын талбай дээр 5 тоннын крантай буулгах шаардлагатай..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-purple-500 outline-hidden"
                ></textarea>
              </div>

              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-purple-900 font-bold">Урьдчилсан баримжаа төсөв:</div>
                  <div className="text-xl font-black text-purple-950 mt-1 font-display">
                    {formatMNT(totalEstimated)}
                  </div>
                  <p className="text-[11px] text-purple-800 mt-1">
                    * Бөөний их хэмжээний гэрээнд нэмэлт 5-15% хөнгөлөлт тооцогдоно.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl btn-liquid-glass text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Цуцлах
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl btn-liquid-dark font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Database className="w-4 h-4 text-white animate-spin" />
                    <span className="text-white">Илгээж байна...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span className="text-white">Үнийн саналын хүсэлт илгээх</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
