import React from 'react';
import { INVOICE_ISSUER } from '../lib/contact';

export interface InvoiceParty {
  name: string;
  phone?: string | null;
  email?: string | null;
  register?: string | null;
  companyName?: string | null;
  address?: string | null;
}

export interface InvoiceLine {
  name: string;
  sku: string;
  uom: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface InvoiceData {
  invoiceNo: string | null;
  orderNo: string;
  issuedAt: string | null;
  dueDate: string | null;
  paidAt: string | null;
  buyer: InvoiceParty;
  lines: InvoiceLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress?: string | null;
}

const mnt = (n: number) => `${Math.round(n).toLocaleString('mn-MN')}₮`;
const date = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('mn-MN') : '—';

/**
 * Хэвлэхэд зориулсан нэхэмжлэх.
 *
 * `print-sheet` ангиллыг index.css-ийн @media print дүрэм барьж, хэвлэх үед
 * зөвхөн энэ хэсгийг үлдээдэг.
 */
export const InvoiceDocument: React.FC<{ data: InvoiceData }> = ({ data }) => {
  const i = INVOICE_ISSUER;
  // НӨАТ нь үнэд багтсан тул нийт дүнгээс ялгаж харуулна.
  const vat = Math.round((data.total / 11) * 10) / 10;

  return (
    <div className="print-sheet bg-white text-slate-900 p-8 text-[13px] leading-relaxed">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-black font-display">НЭХЭМЖЛЭХ</h1>
          <div className="mt-1 font-mono text-sm font-bold">
            {data.invoiceNo ?? data.orderNo}
          </div>
        </div>
        <table className="text-xs">
          <tbody>
            <tr>
              <td className="pr-3 text-slate-500">Огноо</td>
              <td className="font-semibold">{date(data.issuedAt)}</td>
            </tr>
            {data.dueDate && (
              <tr>
                <td className="pr-3 text-slate-500">Төлөх хугацаа</td>
                <td className="font-semibold">{date(data.dueDate)}</td>
              </tr>
            )}
            <tr>
              <td className="pr-3 text-slate-500">Захиалга</td>
              <td className="font-mono">{data.orderNo}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 py-5 sm:grid-cols-2">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Нийлүүлэгч
          </h2>
          <div className="mt-1.5 space-y-0.5">
            <div className="font-bold">{i.legalName}</div>
            {i.register && <div>ТТД: {i.register}</div>}
            <div className="text-slate-600">{i.address}</div>
            <div className="text-slate-600">
              {i.phone} · {i.email}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Худалдан авагч
          </h2>
          <div className="mt-1.5 space-y-0.5">
            <div className="font-bold">{data.buyer.companyName || data.buyer.name}</div>
            {data.buyer.companyName && <div>Холбоо барих: {data.buyer.name}</div>}
            {data.buyer.register && <div>ТТД: {data.buyer.register}</div>}
            {data.buyer.phone && <div className="text-slate-600">{data.buyer.phone}</div>}
            {data.buyer.email && <div className="text-slate-600">{data.buyer.email}</div>}
            {data.deliveryAddress && (
              <div className="text-slate-600">{data.deliveryAddress}</div>
            )}
          </div>
        </div>
      </div>

      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr className="border-y border-slate-300 bg-slate-50">
            <th className="py-2 pl-2 pr-1 text-left font-semibold w-8">№</th>
            <th className="px-1 py-2 text-left font-semibold">Бараа, ажил үйлчилгээ</th>
            <th className="px-1 py-2 text-right font-semibold">Тоо</th>
            <th className="px-1 py-2 text-left font-semibold">Нэгж</th>
            <th className="px-1 py-2 text-right font-semibold">Нэгж үнэ</th>
            <th className="py-2 pl-1 pr-2 text-right font-semibold">Дүн</th>
          </tr>
        </thead>
        <tbody>
          {data.lines.map((l, n) => (
            <tr key={`${l.sku}-${n}`} className="border-b border-slate-200">
              <td className="py-2 pl-2 pr-1 text-slate-500">{n + 1}</td>
              <td className="px-1 py-2">
                <div>{l.name}</div>
                <div className="font-mono text-[10px] text-slate-400">{l.sku}</div>
              </td>
              <td className="px-1 py-2 text-right tabular-nums">
                {l.qty.toLocaleString('mn-MN')}
              </td>
              <td className="px-1 py-2 text-slate-600">{l.uom}</td>
              <td className="px-1 py-2 text-right tabular-nums">{mnt(l.unitPrice)}</td>
              <td className="py-2 pl-1 pr-2 text-right tabular-nums font-medium">
                {mnt(l.lineTotal)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <table className="text-[12px]">
          <tbody>
            <tr>
              <td className="py-1 pr-6 text-slate-500">Барааны дүн</td>
              <td className="py-1 text-right tabular-nums">{mnt(data.subtotal)}</td>
            </tr>
            <tr>
              <td className="py-1 pr-6 text-slate-500">Хүргэлтийн хөлс</td>
              <td className="py-1 text-right tabular-nums">{mnt(data.deliveryFee)}</td>
            </tr>
            <tr>
              <td className="py-1 pr-6 text-slate-500">Үүнээс НӨАТ</td>
              <td className="py-1 text-right tabular-nums">{mnt(vat)}</td>
            </tr>
            <tr className="border-t-2 border-slate-900">
              <td className="py-2 pr-6 font-bold">Нийт төлөх</td>
              <td className="py-2 text-right text-base font-black tabular-nums">
                {mnt(data.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {(i.bankName || i.accountNo) && (
        <div className="mt-5 border-t border-slate-200 pt-3 text-[12px]">
          <span className="text-slate-500">Шилжүүлэх данс: </span>
          <span className="font-semibold">
            {[i.bankName, i.accountNo, i.accountName].filter(Boolean).join(' · ')}
          </span>
        </div>
      )}

      {data.paidAt && (
        <div className="mt-5 inline-block rounded-lg border-2 border-emerald-600 px-3 py-1 text-sm font-bold text-emerald-700">
          ТӨЛӨГДСӨН · {date(data.paidAt)}
        </div>
      )}

      <p className="mt-6 text-[11px] text-slate-400">
        Төлбөр шилжүүлэхдээ гүйлгээний утган дээр{' '}
        <span className="font-mono">{data.invoiceNo ?? data.orderNo}</span> дугаарыг
        бичнэ үү.
      </p>
    </div>
  );
};
