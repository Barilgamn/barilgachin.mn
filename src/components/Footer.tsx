import React from 'react';
import { useWarehouses } from '../CatalogProvider';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Database,
  Calculator,
  FileText,
} from 'lucide-react';

interface FooterProps {
  onOpenCalculator: () => void;
  onOpenRFQ: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCalculator,
  onOpenRFQ,
}) => {
  const WAREHOUSES = useWarehouses();
  return (
    <footer className="bg-slate-100/80 text-slate-600 text-xs border-t border-slate-200">
      {/* Top Warehouse Locations Grid */}
      <div className="border-b border-slate-200/90 py-8 bg-white/70">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Улаанбаатар хот дахь 4 их агуулахын байршил</span>
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold hidden sm:inline">
              ● Бүх агуулахад бэлэн ачилт явагдаж байна
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {WAREHOUSES.map((wh) => (
              <div
                key={wh.branchId}
                className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 hover:border-slate-300 shadow-2xs transition-colors"
              >
                <div className="font-bold text-slate-900 text-xs">{wh.branchName}</div>
                <div className="text-[11px] text-slate-500 leading-snug">{wh.address}</div>
                <div className="text-[10px] font-mono text-slate-500 pt-1 font-semibold">
                  Код: {wh.locationCode}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
              title="Нүүр хуудас"
              aria-label="Нүүр хуудас"
            >
              <img
                src="https://barilgachin.mn/web/image/website/4/logo/Barilgachin?unique=5f8cd8a"
                alt="Barilgachin.mn"
                className="h-9 w-auto object-contain group-hover:opacity-95 transition-opacity"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  const fb = document.getElementById('footer-logo-fallback');
                  if (fb) fb.style.display = 'flex';
                }}
              />
              <div id="footer-logo-fallback" className="hidden items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-slate-950 tracking-tight font-display">
                  BARILGACHIN<span className="text-amber-500">.MN</span>
                </span>
              </div>
            </a>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Монголын хамгийн том барилгын материалын цахим худалдааны нэгдсэн платформ. Агуулахын бодит үлдэгдэл, B2B төслийн үнийн санал, крантай хүргэлтийн нэгдсэн систем.
            </p>
          </div>

          {/* Quick Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Цахим хэрэгслүүд
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenCalculator}
                  className="hover:text-amber-700 transition-colors flex items-center gap-1.5 text-slate-600 font-medium"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-600" />
                  <span>Материалын тооцоолуур</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRFQ}
                  className="hover:text-amber-700 transition-colors flex items-center gap-1.5 text-slate-600 font-medium"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>B2B Үнийн санал авах</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>MNS Стандартын сан</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Түгээмэл бүтээгдэхүүн
            </h4>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li>МАК Евроцемент M-500</li>
              <li>Евроблок AAC D600</li>
              <li>Арматур төмөр Ф10 - Ф32</li>
              <li>KNAUF Эрдэс хөвөн дулаалга</li>
              <li>Tikkurila дотор эко будаг</li>
              <li>Hilti мэргэжлийн өрмийн алх</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Холбоо барих
            </h4>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <a href="tel:77112244" className="font-bold text-slate-900 hover:text-amber-700 hover:underline">
                  7711-2244, 9911-0022
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <a href="mailto:info@barilga.mn" className="font-semibold text-slate-800 hover:underline">
                  info@barilga.mn
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Даваа - Ням: 08:00 - 20:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & certification bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Barilgachin.mn. Бүх эрх хуулиар хамгаалагдсан.
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>MNS ISO 9001:2015</span>
            <span>•</span>
            <span>E-barimt 3.0</span>
            <span>•</span>
            <span>QPay & SocialPay Integrated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
