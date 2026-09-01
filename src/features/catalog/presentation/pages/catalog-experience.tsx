"use client";

import { useMemo, useState } from "react";
import { FiMenu, FiShoppingBag, FiX } from "react-icons/fi";

import type { SupabaseBrowserConfig } from "@/core/network/supabase/browser-client";
import { createCatalogCartActions } from "@/core/di/catalog-browser";
import { createPromotionActions } from "@/core/di/promotions-browser";
import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import type { StoreFilterOptions } from "@/core/store-filters/store-filter-options";
import { CatalogFilters } from "@/features/catalog/presentation/components/catalog-filters";
import { CatalogHeader } from "@/features/catalog/presentation/components/catalog-header";
import { CatalogHero } from "@/features/catalog/presentation/components/catalog-hero";
import { CatalogProductGrid } from "@/features/catalog/presentation/components/catalog-product-grid";
import { ProductDrawer } from "@/features/catalog/presentation/components/product-drawer";
import { CatalogCartDrawer } from "@/features/catalog/presentation/components/catalog-cart-drawer";
import { PromotionPopup } from "@/features/catalog/presentation/components/promotion-popup";
import { WhatsAppLabel } from "@/features/catalog/presentation/components/whatsapp-label";
import type { StorePromotion } from "@/core/promotions/promotion";
import type { PromotionCouponValidation } from "@/core/promotions/promotion";
import { useCatalogViewModel } from "@/features/catalog/presentation/viewmodels/use-catalog-viewmodel";
import { createCartWhatsAppMessage, createWhatsAppUrl } from "@/features/catalog/presentation/utils/create-cart-whatsapp-message";

type CatalogExperienceProps = {
  products: CatalogProduct[];
  storeName: string;
  whatsappPhone: string;
  supabaseConfig: SupabaseBrowserConfig;
  configuredFilters?: StoreFilterOptions;
  promotions: StorePromotion[];
};

export function CatalogExperience({ products, storeName, whatsappPhone, configuredFilters, supabaseConfig, promotions }: CatalogExperienceProps) {
  const cartActions = useMemo(() => createCatalogCartActions(), []);
  const promotionActions = useMemo(() => createPromotionActions(supabaseConfig), [supabaseConfig]);
  const viewModel = useCatalogViewModel(products, configuredFilters, cartActions, promotionActions);
  const { state, actions } = viewModel;
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [popupPromotion, setPopupPromotion] = useState<StorePromotion | null>(() => {
    if (typeof window === "undefined") return null;
    const activePopup = promotions.find((promotion) => promotion.kind === "popup" && promotion.imageUrl);
    return activePopup && !window.sessionStorage.getItem(`promotion-popup:${activePopup.id}`) ? activePopup : null;
  });

  function closePromotionPopup() {
    if (popupPromotion) window.sessionStorage.setItem(`promotion-popup:${popupPromotion.id}`, "seen");
    setPopupPromotion(null);
  }

  async function contactSeller() {
    const checkoutWindow = window.open("", "_blank");
    const fallbackPromotion: PromotionCouponValidation = {
      isValid: false,
      message: "Promocao nao validada.",
      originalTotal: viewModel.cartTotal,
      productDiscount: 0,
      couponDiscount: 0,
      finalTotal: viewModel.cartTotal,
      hasFreeShipping: false,
    };
    const calculatedPromotion = await actions.applyCoupon();
    const message = createCartWhatsAppMessage({
      items: state.cartItems,
      promotion: calculatedPromotion ?? fallbackPromotion,
      storeUrl: window.location.href,
    });
    const whatsappUrl = createWhatsAppUrl(whatsappPhone, message);

    if (!whatsappUrl) {
      checkoutWindow?.close();
      return;
    }

    if (checkoutWindow) {
      checkoutWindow.opener = null;
      checkoutWindow.location.replace(whatsappUrl);
      return;
    }

    window.location.assign(whatsappUrl);
  }

  const renderFilters = (className?: string) => (
    <CatalogFilters
      className={className}
      categories={viewModel.categories}
      categoryCount={viewModel.categoryCount}
      activeCategory={state.category}
      sizes={viewModel.availableSizes}
      colors={viewModel.availableColors}
      models={viewModel.availableModels}
      sizeFilters={viewModel.sizeFilters}
      colorFilters={viewModel.colorFilters}
      modelFilters={viewModel.modelFilters}
      onCategoryChange={actions.updateCategory}
      onSizeToggle={actions.toggleSizeFilter}
      onColorToggle={actions.toggleColorFilter}
      onModelToggle={actions.toggleModelFilter}
      onClear={actions.clearFilters}
    />
  );

  return (
    <div className="min-h-screen bg-white pt-12 text-[var(--color-foreground)] md:pt-0">
      <CatalogHeader
        storeName={storeName}
        whatsappPhone={whatsappPhone}
        cartItemCount={state.cartItems.reduce((total, item) => total + item.quantity, 0)}
        query={state.query}
        categories={viewModel.categories}
        activeCategory={state.category}
        onQueryChange={actions.updateQuery}
        onCategoryChange={actions.updateCategory}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CatalogHero />

      <div className="fixed inset-x-0 top-0 z-30 flex h-12 items-center justify-between border-y border-[#242424] bg-[var(--color-foreground)] px-3 text-white md:hidden">
        <button
          className="grid size-9 place-items-center border border-[#414141]"
          onClick={() => setIsMobileFilterOpen(true)}
          aria-label="Abrir filtros"
        >
          <FiMenu aria-hidden="true" className="text-xl" />
        </button>
      </div>

      <main id="catalogo" className="min-h-[600px] md:grid md:grid-cols-[190px_1fr]">
        <div className="hidden md:block">{renderFilters()}</div>

        <CatalogProductGrid
          products={viewModel.paginatedProducts}
          totalProducts={viewModel.filteredProducts.length}
          sort={state.sort}
          currentPage={viewModel.currentPage}
          totalPages={viewModel.totalPages}
          pageSize={viewModel.pageSize}
          onSortChange={actions.updateSort}
          onPageChange={actions.updateCurrentPage}
          onOpenProduct={actions.openProduct}
        />
      </main>

      {state.selectedProduct ? (
        <ProductDrawer
          product={state.selectedProduct}
          selection={state.selection}
          selectedVariant={viewModel.selectedVariant}
          isSelectionReady={viewModel.isSelectionReady}
          formattedOrderTotal={viewModel.formattedOrderTotal}
          onSelectionChange={actions.updateSelection}
          onQuantityChange={actions.updateQuantity}
          onClose={actions.closeProduct}
          onAddToCart={() => {
            actions.addCurrentProductToCart();
            actions.closeProduct();
            setIsCartOpen(true);
          }}
        />
      ) : null}

      {isMobileFilterOpen ? (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onMouseDown={() => setIsMobileFilterOpen(false)}>
          <aside
            className="h-full w-[82vw] max-w-[320px] overflow-auto bg-white"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-[#dedede] bg-white px-6">
              <strong className="text-[10px] font-black">FILTROS</strong>
              <button className="grid size-8 place-items-center" onClick={() => setIsMobileFilterOpen(false)} aria-label="Fechar filtros">
                <FiX aria-hidden="true" className="text-xl" />
              </button>
            </div>
            {renderFilters("border-r-0")}
          </aside>
        </div>
      ) : null}

      <button className="fixed bottom-[84px] right-4 z-30 grid size-14 place-items-center rounded-full border-2 border-[var(--color-foreground)] bg-white text-black shadow-[0_8px_20px_rgba(0,0,0,.22)] md:hidden" onClick={() => setIsCartOpen(true)} aria-label="Abrir carrinho">
        <FiShoppingBag aria-hidden="true" className="text-2xl" />
        {state.cartItems.length ? <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-black text-[10px] font-black text-white">{state.cartItems.reduce((total, item) => total + item.quantity, 0)}</span> : null}
      </button>
      <button className="floating-whatsapp fixed bottom-5 right-4 z-30 flex size-14 items-center justify-center rounded-full bg-[var(--color-lime)] text-black shadow-[0_8px_20px_rgba(0,0,0,.22)] md:hidden" onClick={() => window.open(`https://wa.me/${whatsappPhone}`, "_blank", "noopener,noreferrer")} aria-label="Falar no WhatsApp"><WhatsAppLabel><span className="sr-only">FALAR NO WHATSAPP</span></WhatsAppLabel></button>
      <CatalogCartDrawer isOpen={isCartOpen} items={state.cartItems} couponCode={state.couponCode} couponValidation={state.couponValidation} formattedTotal={viewModel.formattedCartTotal} onClose={() => setIsCartOpen(false)} onCouponChange={actions.updateCouponCode} onApplyCoupon={actions.applyCoupon} onItemQuantityChange={actions.updateCartItemQuantity} onRemoveItem={actions.removeCartItem} onContactSeller={contactSeller} />
      <PromotionPopup promotion={popupPromotion} onClose={closePromotionPopup} />
    </div>
  );
}
