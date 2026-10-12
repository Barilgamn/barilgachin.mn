import type { OrderStatus } from '../types/db';

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'Шинэ',
  confirmed: 'Баталгаажсан',
  packed: 'Цуглуулсан',
  shipped: 'Илгээсэн',
  delivered: 'Хүргэсэн',
  cancelled: 'Цуцалсан',
};

export const STATUS_CLASS: Record<OrderStatus, string> = {
  new: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  packed: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-violet-50 text-violet-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-500',
};

/** Баталгаажсаны дараа явах дараалал. Цуцлах нь хаанаас ч боломжтой. */
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  confirmed: 'packed',
  packed: 'shipped',
  shipped: 'delivered',
};

export const PAYMENT_LABEL: Record<string, string> = {
  qpay: 'QPay',
  socialpay: 'SocialPay',
  khanbank: 'Хаан банк',
  storepay: 'Storepay',
  invoice_odoo: 'Нэхэмжлэх',
  cash: 'Бэлэн мөнгө',
  transfer: 'Дансаар шилжүүлэг',
};

export const paymentLabel = (method: string): string =>
  PAYMENT_LABEL[method] ?? method;

export const formatMNT = (value: number): string =>
  `${Math.round(value).toLocaleString('mn-MN')}₮`;

export const formatDate = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleDateString('mn-MN') : '—';

export const formatDateTime = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleString('mn-MN') : '—';
