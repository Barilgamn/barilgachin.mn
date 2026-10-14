import React, { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CustomerRow } from '../types/db';

type Draft = Pick<
  CustomerRow,
  'name' | 'phone' | 'email' | 'customer_type' | 'company_name' | 'company_register' | 'note'
>;

const emptyDraft: Draft = {
  name: '',
  phone: '',
  email: '',
  customer_type: 'individual',
  company_name: '',
  company_register: '',
  note: '',
};

const toDraft = (row: CustomerRow): Draft => ({
  name: row.name,
  phone: row.phone,
  email: row.email ?? '',
  customer_type: row.customer_type,
  company_name: row.company_name ?? '',
  company_register: row.company_register ?? '',
  note: row.note ?? '',
});

interface CustomerFormProps {
  /** null бол шинээр үүсгэнэ. */
  editing: CustomerRow | null;
  onSaved: () => void;
  onCancel: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  editing,
  onSaved,
  onCancel,
}) => {
  const [draft, setDraft] = useState<Draft>(editing ? toDraft(editing) : emptyDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!draft.name.trim() || !draft.phone.trim()) return;
    setSaving(true);
    setError(null);

    const payload = {
      ...draft,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      email: draft.email || null,
      company_name: draft.company_name || null,
      company_register: draft.company_register || null,
      note: draft.note || null,
    };

    const { error: err } = editing
      ? await supabase.from('customers').update(payload).eq('id', editing.id)
      : await supabase.from('customers').insert(payload);

    if (err) {
      // Утас нь unique — ижил дугаартай харилцагч давхар орохоос сэргийлнэ.
      setError(
        err.code === '23505'
          ? 'Энэ утасны дугаартай харилцагч бүртгэлтэй байна.'
          : err.message,
      );
    } else {
      onSaved();
    }
    setSaving(false);
  };

  const field =
    'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-hidden focus:border-slate-900';
  const label = 'text-xs font-medium text-slate-600';
  const isCompany = draft.customer_type === 'corporate';

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex gap-1.5">
        {([
          ['individual', 'Хувь хүн'],
          ['corporate', 'Байгууллага'],
        ] as const).map(([value, text]) => (
          <button
            key={value}
            type="button"
            onClick={() => setDraft({ ...draft, customer_type: value })}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer ${
              draft.customer_type === value
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className={label}>Нэр</span>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Овог нэр"
            className={field}
          />
        </label>
        <label className="block">
          <span className={label}>Утас</span>
          <input
            value={draft.phone}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            placeholder="9911-2233"
            className={field}
          />
          <span className="mt-1 block text-[11px] text-slate-400">
            Харилцагчийг таних түлхүүр. Давхардахгүй.
          </span>
        </label>
        <label className="block">
          <span className={label}>И-мэйл</span>
          <input
            type="email"
            value={draft.email ?? ''}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            className={field}
          />
        </label>
      </div>

      {isCompany && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Байгууллагын нэр</span>
            <input
              value={draft.company_name ?? ''}
              onChange={(e) => setDraft({ ...draft, company_name: e.target.value })}
              className={field}
            />
          </label>
          <label className="block">
            <span className={label}>ТТД</span>
            <input
              value={draft.company_register ?? ''}
              onChange={(e) => setDraft({ ...draft, company_register: e.target.value })}
              placeholder="1234567"
              className={field}
            />
          </label>
        </div>
      )}

      <label className="block">
        <span className={label}>Тэмдэглэл</span>
        <textarea
          rows={2}
          value={draft.note ?? ''}
          onChange={(e) => setDraft({ ...draft, note: e.target.value })}
          className={field}
        />
      </label>

      <div className="flex justify-end gap-2">
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
          onClick={save}
          disabled={saving || !draft.name.trim() || !draft.phone.trim()}
          className="btn-liquid-dark px-3.5 py-2 text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Хадгалах
        </button>
      </div>
    </div>
  );
};
