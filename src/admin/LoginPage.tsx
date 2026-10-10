import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(
        signInError.message === 'Invalid login credentials'
          ? 'И-мэйл эсвэл нууц үг буруу байна.'
          : signInError.message,
      );
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Барилгачин удирдлага
          </h1>
          <p className="mt-1 text-sm text-slate-500">Үргэлжлүүлэхийн тулд нэвтэрнэ үү</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Supabase тохируулаагүй байна. <code>.env</code> дотор
              <code> VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code>-г бөглөнө үү.
            </span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <label className="block">
            <span className="text-xs font-medium text-slate-600">И-мэйл</span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-hidden focus:border-slate-900"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-600">Нууц үг</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-hidden focus:border-slate-900"
            />
          </label>

          {error && (
            <p role="alert" className="text-xs font-medium text-rose-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-liquid-dark w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            {busy ? 'Нэвтэрч байна…' : 'Нэвтрэх'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          <a href="/" className="hover:text-slate-600">
            ← Дэлгүүр рүү буцах
          </a>
        </p>
      </div>
    </div>
  );
};
