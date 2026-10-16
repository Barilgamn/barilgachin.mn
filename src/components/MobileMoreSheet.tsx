import React from 'react';
import { ArrowRight, Mail, MapPin, MessageSquare, Phone, Truck, X } from 'lucide-react';
import { COMPANY, EMAIL, PHONE, WAREHOUSE } from '../lib/contact';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLiveChat: () => void;
  onOpenOrderTracker: () => void;
}

const rowClass =
  'flex items-center gap-3 w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-left active:scale-[0.99] transition-transform';

/**
 * Гар утсан дээрх холбоо барих хуудас.
 *
 * Байршил, утас, чат гурав нь толгойн нарийхан мөрөнд багтаж ядаж байсан
 * тул эндээс нээгдэнэ. Доод цэсний сүүлийн таб үүнийг дууддаг.
 */
export const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({
  isOpen,
  onClose,
  onOpenLiveChat,
  onOpenOrderTracker,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex items-end">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full rounded-t-3xl bg-slate-50 p-4 pb-8 space-y-3 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              {COMPANY.legalName}
            </h2>
            <p className="text-xs text-slate-500">Холбоо барих</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 cursor-pointer"
            aria-label="Хаах"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <a href={PHONE.href} className={rowClass}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
            <Phone className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-900">
              {PHONE.display}
            </span>
            <span className="block text-[11px] text-slate-500">Лавлах утас</span>
          </span>
        </a>

        <button type="button" onClick={onOpenLiveChat} className={`${rowClass} cursor-pointer`}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-white">
            <MessageSquare className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-900">
              Зөвлөхтэй чатлах
            </span>
            <span className="block text-[11px] text-slate-500">
              Түгээмэл асуултад автоматаар хариулна
            </span>
          </span>
        </button>

        <a
          href={WAREHOUSE.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className={rowClass}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <MapPin className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-900">
              {WAREHOUSE.name}
            </span>
            <span className="block text-[11px] text-slate-500 leading-snug">
              {WAREHOUSE.address}
            </span>
          </span>
          <ArrowRight className="ml-auto w-4 h-4 shrink-0 text-slate-400" />
        </a>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenOrderTracker();
          }}
          className={`${rowClass} cursor-pointer`}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
            <Truck className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-900">
              Захиалга, нэхэмжлэх хянах
            </span>
            <span className="block text-[11px] text-slate-500">
              Дугаар, утсаараа хайна
            </span>
          </span>
          <ArrowRight className="ml-auto w-4 h-4 shrink-0 text-slate-400" />
        </button>

        <a href={EMAIL.salesHref} className={rowClass}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
            <Mail className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-900 truncate">
              {EMAIL.sales}
            </span>
            <span className="block text-[11px] text-slate-500">
              Бөөний худалдан авалт
            </span>
          </span>
        </a>
      </div>
    </div>
  );
};
