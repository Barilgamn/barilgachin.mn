import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from './components/Header';
import { PromoShowcaseSection } from './components/PromoShowcaseSection';
import { NewsSection } from './components/NewsSection';
import { TopBanner } from './components/TopBanner';
import { MobileMoreSheet } from './components/MobileMoreSheet';
import { ProductGrid } from './components/ProductGrid';
import { B2BSection } from './components/B2BSection';
import { Footer } from './components/Footer';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MaterialCalculatorModal } from './components/MaterialCalculatorModal';
import { RFQModal } from './components/RFQModal';
import { LiveChatModal } from './components/LiveChatModal';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { loadFavorites, saveFavorites } from './lib/favorites';
import { isSupabaseConfigured } from './lib/supabase';
import { useCatalogState } from './CatalogProvider';
import { Product, CartItem, UnitOfMeasure } from './types';
import { MessageSquare, Phone } from 'lucide-react';

export default function App() {
  const { products: PRODUCTS, loading, error } = useCatalogState();

  // Navigation & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('home');
  // Доод цэсийн «Ангилал» дарахад ProductGrid доторх ангиллын жагсаалт
  // нээгдэнэ. Тоолуур өөрчлөгдөхөд л нээгддэг тул дахин дарж болно.
  const [openCategoryMenu, setOpenCategoryMenu] = useState(0);
  const [openFilterMenu, setOpenFilterMenu] = useState(0);
  const [filtersActive, setFiltersActive] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  // Хөтчөөс уншиж эхэлнэ — хуудас дахин ачаалахад хадгалсан нь үлдэнэ.
  const [favoriteIds, setFavoriteIds] = useState<string[]>(loadFavorites);

  useEffect(() => {
    saveFavorites(favoriteIds);
  }, [favoriteIds]);

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((prev) => {
      const isFav = prev.includes(productId);
      const next = isFav ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(isFav ? 'Хадгалсан бүтээгдэхүүнээс хасагдлаа' : 'Хадгалсан бүтээгдэхүүнд нэмэгдлээ');
      return next;
    });
  };

  // Тэмдэг дээр каталогт байгаа барааг л тоолно. Хадгалсан бараа хожим
  // нийтлэгдэхээ больсон бол жагсаалтад гарахгүй — тоонд нь ч орохгүй.
  const savedCount = PRODUCTS.filter((p) => favoriteIds.includes(p.id)).length;

  // Сагс хоосноос эхэлнэ. Өмнө нь жишээ 2 бараагаар дүүргэсэн байсан нь
  // статик каталогт тулгуурладаг байсан бөгөөд жинхэнэ дэлгүүрт буруу.
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Modals visibility state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isRfqOpen, setIsRfqOpen] = useState<boolean>(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState<boolean>(false);

  // Selected product for technical datasheet modal / single RFQ
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rfqTargetProduct, setRfqTargetProduct] = useState<Product | null>(null);

  // Мэдээн доторх зар бараа, ангилал руу шууд хөтөлдөг.
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const sku = searchParams.get('product');
    const category = searchParams.get('category');
    if (!sku && !category) return;

    // Каталог ачаалахаас өмнө ирвэл бараа олдохгүй — ачаалмагц дахин оролдоно.
    if (sku) {
      const hit = PRODUCTS.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
      if (!hit) return;
      setSelectedProduct(hit);
    } else if (category) {
      setSelectedCategory(category);
    }
    setSearchParams({}, { replace: true });
  }, [searchParams, PRODUCTS, setSearchParams]);

  // Success notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add single item to cart
  const handleAddToCart = (product: Product, quantity: number, uom: UnitOfMeasure) => {
    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex((item) => item.product.id === product.id);

      if (existingIdx > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIdx].quantity + quantity;

        // compute tiered bulk unit price
        const activeBulkTier = [...product.bulkTiers]
          .reverse()
          .find((t) => newQty >= t.minQty);
        const unitPrice = activeBulkTier ? activeBulkTier.price : product.price;

        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          itemTotal: unitPrice * newQty,
          itemWeightTotal: product.weightKg * newQty,
        };
        return updated;
      } else {
        const activeBulkTier = [...product.bulkTiers]
          .reverse()
          .find((t) => quantity >= t.minQty);
        const unitPrice = activeBulkTier ? activeBulkTier.price : product.price;

        return [
          ...prevItems,
          {
            product,
            quantity,
            selectedUom: uom,
            itemTotal: unitPrice * quantity,
            itemWeightTotal: product.weightKg * quantity,
          },
        ];
      }
    });

    showToast(`"${product.name}" (${quantity} ${uom}) сагсанд амжилттай нэмэгдлээ.`);
  };

  // Batch add from Material Calculator
  const handleBatchAddToCart = (items: { product: Product; quantity: number; uom: UnitOfMeasure }[]) => {
    items.forEach((item) => {
      handleAddToCart(item.product, item.quantity, item.uom);
    });
    setIsCartOpen(true);
    showToast(`Тооцоолсон ${items.length} нэр төрлийн материал сагсанд нэмэгдлээ.`);
  };

  // Cart quantity update
  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const activeBulkTier = [...item.product.bulkTiers]
            .reverse()
            .find((t) => quantity >= t.minQty);
          const unitPrice = activeBulkTier ? activeBulkTier.price : item.product.price;
          return {
            ...item,
            quantity,
            itemTotal: unitPrice * quantity,
            itemWeightTotal: item.product.weightKg * quantity,
          };
        }
        return item;
      })
    );
  };

  // Remove from cart
  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Quick RFQ
  const handleOpenRFQForProduct = (product: Product) => {
    setRfqTargetProduct(product);
    setIsRfqOpen(true);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartWeight = cartItems.reduce((sum, item) => sum + item.itemWeightTotal, 0);
  const totalCartAmount = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  // Каталог баазаас ирэх хүртэл, эсвэл алдаа гарвал юу болсныг шууд хэлнэ.
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-white">
        <p className="text-sm text-slate-400">Каталог ачаалж байна…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-white px-6 text-center">
        <div className="max-w-sm">
          <p className="font-semibold text-slate-900">Каталог ачаалж чадсангүй</p>
          {isSupabaseConfigured ? (
            <p className="mt-1 text-sm text-slate-500">{error}</p>
          ) : (
            /* Тохируулаагүй үед client нь localhost руу ханддаг тул хөтөч
               зүгээр «Failed to fetch» гэдэг — шалтгааныг нь шууд хэлнэ. */
            <p className="mt-1 text-sm text-slate-500">
              Өгөгдлийн сангийн холболт тохируулаагүй байна. Байршуулсан орчинд{' '}
              <span className="font-mono text-slate-700">VITE_SUPABASE_URL</span> ба{' '}
              <span className="font-mono text-slate-700">VITE_SUPABASE_ANON_KEY</span>{' '}
              хувьсагчийг тайлбар, нэмэлт тэмдэггүйгээр оруулаад дахин deploy
              хийнэ үү.
            </p>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-liquid-dark mt-5 px-4 py-2 text-sm font-semibold cursor-pointer"
          >
            Дахин оролдох
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        cartCount={cartCount}
        totalCartWeight={totalCartWeight}
        totalCartAmount={totalCartAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrderTracker={() => navigate('/zahialga')}
        onOpenFilter={() => setOpenFilterMenu((n) => n + 1)}
        hasActiveFilters={filtersActive}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setSelectedProduct(null);
        }}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) {
            setSelectedProduct(null);
          }
        }}
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      {/* Сурталчилгааны баннер — зөвхөн каталог дээр, барааны дэлгэрэнгүй
          хуудсан дээр гарахгүй. */}
      {!selectedProduct && <TopBanner />}

      {/* Main Content Area: Dedicated Product Detail Page OR Main Product Catalog */}
      {selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          allProducts={PRODUCTS}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onAddToRFQ={handleOpenRFQForProduct}
          onSelectProduct={(p) => setSelectedProduct(p)}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            setSelectedProduct(null);
          }}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
        />
      ) : (
        <>
          <main id="catalog-section" className="flex-1 max-w-6xl w-full mx-auto px-2.5 sm:px-4 py-2 sm:py-6 space-y-4 sm:space-y-8 pb-20 sm:pb-8">
            <ProductGrid
              products={activeMobileTab === 'saved' ? PRODUCTS.filter((p) => favoriteIds.includes(p.id)) : PRODUCTS}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setSelectedProduct(p)}
              onAddToRFQ={handleOpenRFQForProduct}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
              onOpenRFQModal={() => {
                setRfqTargetProduct(null);
                setIsRfqOpen(true);
              }}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              openCategoryMenu={openCategoryMenu}
              openFilterMenu={openFilterMenu}
              onFiltersActiveChange={setFiltersActive}
            />

            {/* Promo / Foundation Materials Curated Showcase when on All category (matching user design) */}
            {selectedCategory === 'all' && !searchQuery && activeMobileTab !== 'saved' && (
              <PromoShowcaseSection
                products={PRODUCTS}
                onAddToCart={handleAddToCart}
                onQuickView={(p) => setSelectedProduct(p)}
                onSelectCategory={setSelectedCategory}
              />
            )}

            {selectedCategory === 'all' && !searchQuery && activeMobileTab !== 'saved' && (
              <NewsSection />
            )}
          </main>

          {/* B2B Partnership & Enterprise Section */}
          <B2BSection
            onOpenRFQ={() => {
              setRfqTargetProduct(null);
              setIsRfqOpen(true);
            }}
          />
        </>
      )}

      {/* Subtle Floating Call & Live Chat Side Dock (Shifted up on mobile to avoid bottom bar collision) */}
      {/* Холбоо барих — контент халхлахгүйн тулд зөвхөн дүрс */}
      <div className="hidden sm:flex fixed right-5 bottom-6 z-40 flex-col items-end gap-2">
        <a
          href="tel:+97677662277"
          title="Лавлах: 7766-2277"
          aria-label="Лавлах утас 7766-2277"
          className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 shadow-md hover:shadow-lg hover:text-slate-950 flex items-center justify-center transition-all active:scale-95"
        >
          <Phone className="w-4 h-4" />
        </a>

        <button
          onClick={() => setIsLiveChatOpen(true)}
          title="Зөвлөхтэй чатлах"
          aria-label="Зөвлөхтэй чатлах"
          className="relative w-11 h-11 rounded-full bg-slate-900 text-white shadow-md hover:shadow-lg hover:bg-slate-800 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900"></span>
        </button>
      </div>

      {/* Footer */}
      <Footer
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenRFQ={() => {
          setRfqTargetProduct(null);
          setIsRfqOpen(true);
        }}
      />

      {/* Mobile Bottom Navigation Dock (Apple Liquid Glass Design) */}
      <MobileBottomNav
        activeTab={activeMobileTab}
        onTabChange={(tab) => {
          setActiveMobileTab(tab);
          setSelectedProduct(null);
          if (tab === 'home') {
            setSelectedCategory('all');
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        savedCount={savedCount}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCategories={() => {
          setSelectedProduct(null);
          setOpenCategoryMenu((n) => n + 1);
        }}
        onOpenMore={() => setIsMoreOpen(true)}
      />

      <MobileMoreSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        onOpenLiveChat={() => {
          setIsMoreOpen(false);
          setIsLiveChatOpen(true);
        }}
        onOpenOrderTracker={() => navigate('/zahialga')}
      />

      {/* Modals & Slide-overs */}
      <LiveChatModal
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
        onOpenRFQ={() => {
          setRfqTargetProduct(null);
          setIsRfqOpen(true);
        }}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onOpenRFQ={() => {
          setRfqTargetProduct(null);
          setIsRfqOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={(ref) => {
          setCartItems([]);
          showToast(`Захиалга ${ref} амжилттай бүртгэгдлээ!`);
        }}
      />

      <MaterialCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onBatchAddToCart={handleBatchAddToCart}
      />

      <RFQModal
        isOpen={isRfqOpen}
        onClose={() => {
          setIsRfqOpen(false);
          setRfqTargetProduct(null);
        }}
        initialProduct={rfqTargetProduct}
      />


    </div>
  );
}
