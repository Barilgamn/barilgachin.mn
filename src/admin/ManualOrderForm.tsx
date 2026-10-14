import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CustomerRow, ProductRow, WarehouseRow } from '../types/db';
import { formatMNT } from './orderLabels';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Бэлэн мөнгө' },
  { value: 'transfer', label: 'Дансаар шилжүүлэг' },
  { value: 'qpay', label: 'QPay' },
  { value: 'khanbank', label: 'Хаан банк' },
];

interface Line {
  key: string;
  productId: string;
  qty: number;
  /** Хоосон бол баазын үнэ, бөөний шатлалаар тооцно. */
  unitPrice: string;
}

interface ManualOrderFormProps {
  onCreated: (orderNo: string) => void;
  onCancel: () => void;
}

export const ManualOrderForm: React.FC<ManualOrderFormProps> = ({
  onCreated,
  onCancel,
}) => {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('pickup');
  const [address, setAddress] = useState('');
  const [feeOverride, setFeeOverride] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [note, setNote] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [pick, setPick] = useState('');

  useEffect(() => {
    void (async () => {
      const [cs, ps, ws] = await Promise.all([
        supabase.from('customers').select('*').order('name'),
        supabase.from('products').select('*').order('name'),
        supabase.from('warehouses').select('*').eq('is_active', true).order('sort_order'),
      ]);
      setCustomers((cs.data as CustomerRow[]) ?? []);
      setProducts((ps.data as ProductRow[]) ?? []);
      setWarehouses((ws.data as WarehouseRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  const addLine = () => {
    if (!pick || lines.some((l) => l.productId === pick)) return;
    setLines((prev) => [
      ...prev,
      { key: crypto.randomUUID(), productId: pick, qty: 1, unitPrice: '' },
    ]);
    setPick('');
  };

  const patch = (key: string, next: Partial<Line>) =>
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...next } : l)));

  /** Зөвхөн чиглүүлэх дүн — эцсийн тооцоог бааз хийнэ. */
  const preview = lines.reduce((sum, l) => {
    const p = productById.get(l.productId);
    if (!p) return sum;
    const price = l.unitPrice !== '' ? Number(l.unitPrice) : Number(p.price);
    return sum + price * l.qty;
  }, 0);

  const submit = async () => {
    setError(null);

    if (!customerId && (!newName.trim() || !newPhone.trim())) {
      setError('Харилцагчаа сонгох эсвэл шинэ харилцагчийн нэр, утсыг бөглөнө үү.');
      return;
    }
    if (lines.length === 0) {
      setError('Бараа нэмнэ үү.');
      return;
    }
    if (lines.some((l) => !(l.qty > 0))) {
      setError('Барааны тоо хэмжээ 0-ээс их байх ёстой.');
      return;
    }

    setSaving(true);
    const { data, error: err } = await supabase.rpc('create_manual_order', {
      p_customer_id: customerId || null,
      p_customer: customerId
        ? {}
        : { name: newName, phone: newPhone, customer_type: 'individual' },
      p_delivery: {
        delivery_type: deliveryType,
        warehouse_code: deliveryType === 'pickup' ? warehouses[0]?.code ?? '' : '',
        street_address: deliveryType === 'delivery' ? address : '',
      },
      p_vat: { vat_type: 'individual' },
      p_payment_method: paymentMethod,
      p_items: lines.map((l) => ({
        product_id: l.productId,
        qty: l.qty,
        unit_price: l.unitPrice === '' ? null : Number(l.unitPrice),
      })),
      p_delivery_fee:
        deliveryType === 'delivery' && feeOverride !== '' ? Number(feeOverride) : null,
      p_note: note,
    });

    if (err) setError(err.message);
    else onCreated((data as { order_no: string }).order_no);
    setSaving(false);
  };

  const field =
    'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-slate-900';
  const label = 'text-xs font-medium text-slate-600';

  if (loading) {
    return (
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-400">
        Ачаалж байна…
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 space-y-4">
      <h2 className="text-sm font-bold text-slate-900">Утсаар ирсэн захиалга бүртгэх</h2>

      {error && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </p>
      )}

      {/* ─── Харилцагч ─── */}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block sm:col-span-3">
          <span className={label}>Бүртгэлтэй харилцагч</span>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className={field}
          >
            <option value="">— шинэ харилцагч —</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.phone}
                {c.company_name ? ` · ${c.company_name}` : ''}
              </option>
            ))}
          </select>
        </label>

        {!customerId && (
          <>
            <label className="block">
              <span className={label}>Нэр</span>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={field}
              />
            </label>
            <label className="block">
              <span className={label}>Утас</span>
              <input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="9911-2233"
                className={field}
              />
              <span className="mt-1 block text-[11px] text-slate-400">
                Ижил дугаартай харилцагч байвал түүн рүү холбогдоно.
              </span>
            </label>
          </>
        )}
      </div>

      {/* ─── Бараа ─── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <select
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-hidden focus:border-slate-900"
          >
            <option value="">— бараа сонгох —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addLine}
            disabled={!pick}
            className="btn-liquid-dark shrink-0 px-3 py-2 text-xs font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Нэмэх
          </button>
        </div>

        {lines.length > 0 && (
          <table className="w-full text-sm">
            <thead className="text-[11px] text-slate-500">
              <tr>
                <th className="text-left font-medium pb-1">Бараа</th>
                <th className="text-right font-medium pb-1">Тоо</th>
                <th className="text-right font-medium pb-1">Нэгж үнэ</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const p = productById.get(l.productId);
                return (
                  <tr key={l.key}>
                    <td className="pr-2 py-1">
                      <div className="text-slate-900">{p?.name}</div>
                      <div className="font-mono text-[11px] text-slate-400">{p?.sku}</div>
                    </td>
                    <td className="pr-2 py-1 w-28">
                      <input
                        type="number"
                        min={0}
                        step="0.001"
                        value={l.qty}
                        onChange={(e) => patch(l.key, { qty: Number(e.target.value) })}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-right tabular-nums outline-hidden focus:border-slate-900"
                      />
                    </td>
                    <td className="pr-2 py-1 w-32">
                      <input
                        type="number"
                        min={0}
                        value={l.unitPrice}
                        onChange={(e) => patch(l.key, { unitPrice: e.target.value })}
                        placeholder={p ? Number(p.price).toLocaleString('mn-MN') : ''}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-right tabular-nums outline-hidden focus:border-slate-900"
                      />
                    </td>
                    <td className="py-1 text-right">
                      <button
                        type="button"
                        onClick={() => setLines((prev) => prev.filter((x) => x.key !== l.key))}
                        title="Хасах"
                        className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <p className="text-[11px] text-slate-400">
          Нэгж үнийг хоосон орхивол баазын үнэ, тоо хэмжээнд тохирох бөөний шатлалаар
          бодно. Эцсийн дүнг бааз тооцно.
        </p>
      </div>

      {/* ─── Хүргэлт, төлбөр ─── */}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className={label}>Хүргэлт</span>
          <select
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value as 'delivery' | 'pickup')}
            className={field}
          >
            <option value="pickup">Өөрөө ачих</option>
            <option value="delivery">Хаягаар хүргэх</option>
          </select>
        </label>
        <label className="block">
          <span className={label}>Төлбөрийн хэрэгсэл</span>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={field}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        {deliveryType === 'delivery' && (
          <label className="block">
            <span className={label}>Хүргэлтийн хөлс</span>
            <input
              type="number"
              min={0}
              value={feeOverride}
              onChange={(e) => setFeeOverride(e.target.value)}
              placeholder="жингээр бодно"
              className={`${field} tabular-nums`}
            />
          </label>
        )}
      </div>

      {deliveryType === 'delivery' && (
        <label className="block">
          <span className={label}>Хүргэх хаяг</span>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={field}
          />
        </label>
      )}

      <label className="block">
        <span className={label}>Тэмдэглэл</span>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Утсаар авсан, хэн авсан, тусгай нөхцөл…"
          className={field}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">
          Барааны ойролцоо дүн:{' '}
          <span className="font-semibold text-slate-900 tabular-nums">
            {formatMNT(preview)}
          </span>
        </span>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn-liquid-glass px-3 py-2 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            Болих
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving || lines.length === 0}
            className="btn-liquid-dark px-3.5 py-2 text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Захиалга үүсгэх
          </button>
        </div>
      </div>
    </div>
  );
};
