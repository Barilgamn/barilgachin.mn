import React from 'react';
import { Mail, Printer, X } from 'lucide-react';
import { InvoiceDocument, type InvoiceData } from '../components/InvoiceDocument';
import { INVOICE_ISSUER } from '../lib/contact';

interface InvoiceModalProps {
  data: InvoiceData;
  onClose: () => void;
  /** Байхгүй бол и-мэйл товч гарахгүй. */
  onEmail?: () => void;
  emailing?: boolean;
  emailNote?: string | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  data,
  onClose,
  onEmail,
  emailing,
  emailNote,
}) => {
  const missing = [
    !INVOICE_ISSUER.register && 'ТТД',
    !INVOICE_ISSUER.accountNo && 'банкны данс',
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
        <div className="no-print flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-bold text-slate-900">
            {data.invoiceNo ?? data.orderNo}
          </h2>
          <div className="flex items-center gap-2">
            {onEmail && (
              <button
                type="button"
                onClick={onEmail}
                disabled={emailing || !data.buyer.email}
                title={data.buyer.email ?? 'Харилцагчийн и-мэйл бүртгэгдээгүй'}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                И-мэйлээр илгээх
              </button>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-liquid-dark px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Хэвлэх
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 cursor-pointer"
              title="Хаах"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {emailNote && (
          <p className="no-print mx-4 mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-600">
            {emailNote}
          </p>
        )}

        {missing.length > 0 && (
          <p className="no-print mx-4 mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-800">
            Нэхэмжлэх дээр {missing.join(', ')} байхгүй байна. Бодит утгыг нь
            оруулах хүртэл эдгээр мөр хэвлэгдэхгүй.
          </p>
        )}

        <InvoiceDocument data={data} />
      </div>
    </div>
  );
};
