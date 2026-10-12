import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './useAuth';
import { LoginPage } from './LoginPage';
import { AdminLayout } from './AdminLayout';
import { ProductsPage } from './ProductsPage';
import { CategoriesPage } from './CategoriesPage';
import { BrandsPage } from './BrandsPage';
import { OrdersPage } from './OrdersPage';
import { CustomersPage } from './CustomersPage';
import { PostsPage } from './PostsPage';
import { PromotionsPage } from './PromotionsPage';

/** Хараахан хийгдээгүй хэсгүүдийн түр орлуулагч. */
const Placeholder: React.FC<{ title: string; note: string }> = ({ title, note }) => (
  <div className="p-6">
    <h1 className="text-xl font-bold font-display">{title}</h1>
    <p className="mt-2 max-w-md text-sm text-slate-500">{note}</p>
  </div>
);

const Guard: React.FC = () => {
  const { session, profile, loading, canEdit } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-slate-400">
        Ачаалж байна…
      </div>
    );
  }

  if (!session) return <LoginPage />;

  // Нэвтэрсэн ч эрхгүй бол: RLS бичихийг зөвшөөрөхгүй тул UI-г ч нээхгүй.
  if (profile && !canEdit) {
    return (
      <div className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <p className="font-semibold text-slate-900">Танд энэ хэсгийн эрх алга</p>
          <p className="mt-1 text-sm text-slate-500">
            {profile.email} хаягт удирдлагын эрх олгогдоогүй байна.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route
          path="accounting"
          element={
            <Placeholder
              title="Нягтлан бодолт"
              note="Дансны төлөвлөгөө, журнал, баланс удахгүй нэмэгдэнэ."
            />
          }
        />
        <Route path="*" element={<Navigate to="/admin/products" replace />} />
      </Route>
    </Routes>
  );
};

export const AdminApp: React.FC = () => (
  <AuthProvider>
    <Guard />
  </AuthProvider>
);
