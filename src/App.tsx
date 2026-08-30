import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromoShowcaseSection } from './components/PromoShowcaseSection';
import { ProductGrid } from './components/ProductGrid';
import { B2BSection } from './components/B2BSection';
import { Footer } from './components/Footer';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MaterialCalculatorModal } from './components/MaterialCalculatorModal';
import { RFQModal } from './components/RFQModal';
import { OdooSyncModal } from './components/OdooSyncModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { LiveChatModal } from './components/LiveChatModal';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { PRODUCTS } from './data/mockData';
import { Product, CartItem, UnitOfMeasure } from './types';
import { MessageSquare, Phone } from 'lucide-react';

export default function App() {
  // Navigation & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('home');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['prod-1']);

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((prev) => {
      const isFav = prev.includes(productId);
      const next = isFav ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(isFav ? 'Хадгалсан бүтээгдэхүүнээс хасагдлаа' : 'Хадгалсан бүтээгдэхүүнд нэмэгдлээ');
      return next;
    });
  };

  // Cart State (Pre-populated with 2 construction items so users immediately see freight weight & bulk math)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // MAK Eurocement
      quantity: 50,
      selectedUom: 'шуудай 50кг',
      itemTotal: 50 * 18500, // 50+ tier: 18,500
      itemWeightTotal: 50 * 50, // 2500 kg
    },
    {
      product: PRODUCTS[1], // MAK Euroblock AAC
      quantity: 20,
      selectedUom: 'ширхэг',
      itemTotal: 20 * 13500, // 270,000
      itemWeightTotal: 20 * 22, // 440 kg
    },
  ]);

  // Modals visibility state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isRfqOpen, setIsRfqOpen] = useState<boolean>(false);
  const [isOdooModalOpen, setIsOdooModalOpen] = useState<boolean>(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState<boolean>(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState<boolean>(false);

  // Selected product for technical datasheet modal / single RFQ
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rfqTargetProduct, setRfqTargetProduct] = useState<Product | null>(null);

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

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
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
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenRFQ={() => {
          setRfqTargetProduct(null);
          setIsRfqOpen(true);
        }}
        onOpenOdooModal={() => setIsOdooModalOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenLiveChat={() => setIsLiveChatOpen(true)}
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
          <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-4 py-2 sm:py-6 space-y-4 sm:space-y-8 pb-20 sm:pb-8">
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
              onOpenOdooModal={() => setIsOdooModalOpen(true)}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
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
          </main>

          {/* B2B Partnership & Enterprise Section */}
          <B2BSection
            onOpenRFQ={() => {
              setRfqTargetProduct(null);
              setIsRfqOpen(true);
            }}
            onOpenOdooModal={() => setIsOdooModalOpen(true)}
          />
        </>
      )}

      {/* Subtle Floating Call & Live Chat Side Dock (Shifted up on mobile to avoid bottom bar collision) */}
      <div className="fixed right-3 sm:right-5 bottom-20 sm:bottom-6 z-40 flex flex-col items-end gap-2">
        {/* Subtle Call Button */}
        <a
          href="tel:77112244"
          className="group flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-200/80 hover:border-slate-300 shadow-md hover:shadow-lg backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95"
          title="Лавлах утас: 7711-2244"
        >
          <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-amber-100 text-slate-700 group-hover:text-amber-600 flex items-center justify-center transition-colors">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[10px] text-slate-600 font-medium">Лавлах</span>
            <span className="text-xs font-mono font-bold text-slate-900">7711-2244</span>
          </div>
        </a>

        {/* Subtle Live Chat Button */}
        <button
          onClick={() => setIsLiveChatOpen(true)}
          className="group flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white border border-slate-700/60 hover:border-slate-600 shadow-md hover:shadow-lg backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95"
          title="Инженер, борлуулалтын зөвлөхтэй чатлах"
        >
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 animate-pulse"></span>
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[10px] text-amber-400 font-medium">Шуурхай</span>
            <span className="text-xs font-bold text-white">Чатлах</span>
          </div>
        </button>
      </div>

      {/* Footer */}
      <Footer
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenRFQ={() => {
          setRfqTargetProduct(null);
          setIsRfqOpen(true);
        }}
        onOpenOdooModal={() => setIsOdooModalOpen(true)}
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
          } else if (tab === 'categories' || tab === 'brands' || tab === 'featured') {
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        savedCount={favoriteIds.length}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOdooModal={() => setIsOdooModalOpen(true)}
        onOpenCategories={() => {
          setSelectedProduct(null);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenBrands={() => {
          setSelectedProduct(null);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenFeatured={() => {
          setSelectedProduct(null);
          setSelectedCategory('all');
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
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

      <OdooSyncModal
        isOpen={isOdooModalOpen}
        onClose={() => setIsOdooModalOpen(false)}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
      />
    </div>
  );
}
