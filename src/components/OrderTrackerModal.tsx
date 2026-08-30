import React, { useState, useEffect } from 'react';
import {
  Package,
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Building,
  Database,
  ArrowRight,
} from 'lucide-react';
import { formatMNT } from '../utils/formatters';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [orderQuery, setOrderQuery] = useState('ORD-2026-88421');
  const [hasSearched, setHasSearched] = useState(true);

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

  const mockOrder = {
    orderNumber: 'ORD-2026-88421',
    odooSaleOrder: 'ODOO-SO-2026-4491',
    odooPickingRef: 'ODOO-WH/OUT/2026/0891',
    status: 'on_delivery', // 'confirmed' | 'preparing' | 'on_delivery' | 'delivered'
    customerName: 'Монгол Барилга ХХК (Батбаяр)',
    phone: '9911-2244',
    destination: 'Хан-Уул дүүрэг, 4-р хороо, Яармагийн шинэ хороолол талбай №3',
    dispatchedFrom: 'Төв агуулах (22-ын товчоо, Логистик парк)',
    driverName: 'Г. Болдбаатар',
    driverPhone: '9988-7766',
    vehiclePlate: '4215 УБЧ',
    vehicleType: 'Hyundai Mighty 5т Манипулятор (Крантай тэрэг)',
    estimatedArrival: 'Өнөөдөр 15:30 (Ойролцоогоор 40 минутын дараа)',
    itemsCount: '2 нэр төрөл (100 шуудай цемент, 48ш хийт блок)',
    totalWeight: '4,100 кг (4.1 тн)',
    totalAmount: 3450000,
  };

  const steps = [
    { title: 'Захиалга баталгаажсан', desc: 'Odoo SO үүссэн', done: true, time: '13:00' },
    { title: 'Агуулахын бэлтгэл', desc: 'Палет ачилтад бэлэн болсон', done: true, time: '13:45' },
    { title: 'Тээвэрт ачигдсан', desc: 'Кранаар машинд ачсан', done: true, time: '14:20' },
    { title: 'Хүргэгдэж байна', desc: 'Замд явж байна (Яармаг чиглэл)', done: true, current: true, time: '14:45' },
    { title: 'Хүлээн авсан', desc: 'Талбайд буулгаж гарын үсэг зурах', done: false, time: '15:30' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Захиалга & Тээвэр хянах
              </h3>
              <p className="text-xs text-slate-400">
                Odoo Delivery Picking баримт болон тээврийн хэрэгслийн бодит байршил
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {/* Search Input Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Захиалгын дугаар эсвэл Odoo SO дугаар оруулна уу... (жишээ: ORD-2026-88421)"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="flex-1 text-xs sm:text-sm font-semibold text-slate-900 bg-transparent outline-hidden"
            />
            <button
              onClick={() => setHasSearched(true)}
              className="px-5 py-2 btn-liquid-dark text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Шалгах
            </button>
          </div>

          {hasSearched && (
            <div className="space-y-6">
              {/* Status Header Badge */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 font-display">
                      Захиалга: {mockOrder.orderNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      Хүргэгдэж байна
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-2">
                    <span className="text-purple-700 font-bold">{mockOrder.odooSaleOrder}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{mockOrder.odooPickingRef}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-500">Тооцоолсон хүрэх цаг:</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {mockOrder.estimatedArrival}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Хүргэлтийн үе шат (Odoo Dispatch Status)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border relative transition-all ${
                        step.current
                          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20'
                          : step.done
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {step.time}
                        </span>
                        {step.done ? (
                          <CheckCircle2 className={`w-4 h-4 ${step.current ? 'text-amber-600 animate-bounce' : 'text-emerald-600'}`} />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        {step.title}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{step.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver & Vehicle Dispatch Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Тээврийн хэрэгсэл & Жолооч</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Жолооч:</span>
                      <span className="font-bold text-slate-900">{mockOrder.driverName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Утас:</span>
                      <a href={`tel:${mockOrder.driverPhone}`} className="font-bold text-amber-600 underline">
                        {mockOrder.driverPhone}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Машин:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">{mockOrder.vehicleType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Улсын дугаар:</span>
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 rounded">{mockOrder.vehiclePlate}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Хүргэх хаяг & Ачаа</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ачсан агуулах:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">{mockOrder.dispatchedFrom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Хүргэх байршил:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">{mockOrder.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Нийт жин:</span>
                      <span className="font-bold text-purple-700 font-mono">{mockOrder.totalWeight}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
