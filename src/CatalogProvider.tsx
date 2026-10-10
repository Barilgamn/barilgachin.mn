import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchCatalog, type Catalog } from './lib/catalog';
import type { Category, Product, StockLocation } from './types';

/**
 * Каталогийг нэг удаа татаж, дэлгүүрийн бүх компонентод түгээнэ.
 *
 * Өмнө нь компонент бүр `mockData.ts`-ээс шууд импортолдог байсан. Одоо
 * өгөгдөл баазаас ирдэг тул модулийн тогтмолын оронд context ашиглана —
 * ингэснээр props олон давхар дамжуулах шаардлагагүй.
 */

interface CatalogState extends Catalog {
  loading: boolean;
  error: string | null;
  reload: () => void;
}

const CatalogContext = createContext<CatalogState | null>(null);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [catalog, setCatalog] = useState<Catalog>({
    products: [],
    categories: [],
    warehouses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchCatalog()
      .then((data) => {
        if (!active) return;
        setCatalog(data);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [nonce]);

  return (
    <CatalogContext.Provider
      value={{ ...catalog, loading, error, reload: () => setNonce((n) => n + 1) }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

function useCatalog(): CatalogState {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog нь CatalogProvider дотор байх ёстой');
  return ctx;
}

export const useCatalogState = useCatalog;
export const useProducts = (): Product[] => useCatalog().products;
export const useCategories = (): Category[] => useCatalog().categories;
export const useWarehouses = (): StockLocation[] => useCatalog().warehouses;
