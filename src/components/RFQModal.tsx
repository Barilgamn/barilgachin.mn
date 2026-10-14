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
import { submitRfq } from '../lib/rfq';
import { PHONE } from '../lib/contact';

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
  const [projectLocation, setProjectLocation] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [deliveryNeeded, setDeliveryNeeded] = useState(true);
  const [notes, setNotes] = useState('');

  // Items in the RFQ
  const [rfqItems, setRfqItems] = useState<
    { product: Product; quantity: number; notes: string }[]
  >(() => (initialProduct ? [{ product: initialProduct, quantity: 100, notes: '' }] : []));

  const [selectedAddProductId, setSelectedAddProductId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handleSubmitRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!companyName.trim() || !phone.trim()) {
      setSubmitError('Байгууллагын нэр болон холбоо барих утсыг бөглөнө үү.');
      return;
    }
    if (rfqItems.length === 0) {
      setSubmitError('Үнийн санал авах материалаа нэмнэ үү.');
      return;
    }

    setIsSubmitting(true);
    try {
      const sent = await submitRfq(
        {
          companyName,
          companyRegister: registerNumber,
          contactPerson,
          phone,
          email,
        },
        {
          location: projectLocation,
          requiredDate: requiredDate,
          deliveryNeeded,
          notes,
        },
        rfqItems.map((item) => ({
          productId: item.product.id,
          qty: item.quantity,
          note: item.notes,
        })),
      );
      setSubmittedLeadId(sent.rfqNo);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Хүсэлт илгээхэд алдаа гарлаа.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Үнийн санал авах
              </h3>
              <p className="text-xs text-slate-400">Бөөний худалдан авалтад</p>
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
                Таны хүсэлт бүртгэгдлээ. Борлуулалтын менежер жагсаалтыг тань
                шалгаад холбогдож, үнийн санал гаргана. Яаралтай бол{' '}
                <a href={PHONE.href} className="font-semibold text-amber-700 hover:underline">
                  {PHONE.display}
                </a>{' '}
                дугаар руу залгаарай.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Хүсэлтийн дугаар:</span>
                <span className="font-mono font-bold text-amber-700">{submittedLeadId}</span>
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
          <form onSubmit={handleSubmitRfq} className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Step 1: Company & Project Information */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>1. Байгууллагын мэдээлэл</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Компанийн нэр *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Байгууллагын нэр"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Регистрийн дугаар
                  </label>
                  <input
                    type="text"
                    placeholder="1234567"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden font-mono"
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
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Холбоо барих утас *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9911-2233"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden font-medium"
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
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden font-medium"
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
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:border-amber-500 outline-hidden font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Selected Materials Table */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>2. Материалын жагсаалт</span>
              </h4>

              {/* Бараа нэмэх — гарчигтай нэг мөрөнд багтахгүй тул доор нь */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedAddProductId}
                  onChange={(e) => setSelectedAddProductId(e.target.value)}
                  aria-label="Нэмэх бараа"
                  className="min-w-0 flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-medium outline-hidden focus:border-slate-900"
                >
                  <option value="">— бараа сонгох —</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Нэмэх
                </button>
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
                          <span className="text-amber-600 font-bold">{item.product.sku}</span>
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
                  placeholder="Төлбөр, хүргэлтийн нөхцөл"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-500 outline-hidden"
                ></textarea>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500">Урьдчилсан дүн</div>
                <div className="mt-1 text-xl font-bold text-slate-900 font-display tabular-nums">
                  {formatMNT(totalEstimated)}
                </div>
              </div>
            </div>

            {submitError && (
              <p
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"
              >
                {submitError}
              </p>
            )}

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
                disabled={isSubmitting || rfqItems.length === 0}
                className="px-6 py-3 rounded-xl btn-liquid-dark font-bold text-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
