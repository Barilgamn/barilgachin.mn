import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';

// Админ багцыг дэлгүүрийн багцаас тусгаарлана — худалдан авагч үүнийг татахгүй.
const AdminApp = lazy(() =>
  import('./admin/AdminApp').then((m) => ({ default: m.AdminApp })),
);

export const Root: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen grid place-items-center text-sm text-slate-400">
                Ачаалж байна…
              </div>
            }
          >
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
