import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Package,
  Layers,
  Award,
  Newspaper,
  Tag,
  Users,
  Receipt,
  FileText,
  BookOpen,
  LogOut,
  Store,
} from 'lucide-react';
import { useAuth } from './useAuth';

/** Админ цэс. Хараахан хийгдээгүй хэсгүүдийг `soon` гэж тэмдэглэв. */
const nav = [
  { to: '/admin/products', label: 'Бараа', Icon: Package },
  { to: '/admin/categories', label: 'Ангилал', Icon: Layers },
  { to: '/admin/brands', label: 'Брэнд', Icon: Award },
  { to: '/admin/posts', label: 'Мэдээ', Icon: Newspaper },
  { to: '/admin/promotions', label: 'Хямдрал', Icon: Tag },
  { to: '/admin/customers', label: 'Харилцагч', Icon: Users },
  { to: '/admin/orders', label: 'Захиалга', Icon: Receipt },
  { to: '/admin/rfq', label: 'Үнийн санал', Icon: FileText },
  { to: '/admin/accounting', label: 'Нягтлан бодолт', Icon: BookOpen, soon: true },
];

export const AdminLayout: React.FC = () => {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="px-4 py-4 border-b border-slate-200">
          <p className="font-bold font-display leading-tight">Барилгачин</p>
          <p className="text-[11px] text-slate-400">Удирдлагын хэсэг</p>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, label, Icon, soon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              {soon && (
                <span className="text-[9px] uppercase tracking-wide text-slate-400">
                  удахгүй
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-2 space-y-0.5">
          <a
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            <Store className="w-4 h-4" />
            Дэлгүүр харах
          </a>
          <button
            type="button"
            onClick={signOut}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Гарах
          </button>
          <p className="px-3 pt-1 pb-0.5 text-[11px] text-slate-400 truncate">
            {profile?.email}
          </p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};
