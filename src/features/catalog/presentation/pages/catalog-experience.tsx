"use client";

import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import type { StoreFilterOptions } from "@/core/store-filters/store-filter-options";
import { CatalogFilters } from "@/features/catalog/presentation/components/catalog-filters";
import { CatalogHeader } from "@/features/catalog/presentation/components/catalog-header";
import { CatalogHero } from "@/features/catalog/presentation/components/catalog-hero";
import { CatalogProductGrid } from "@/features/catalog/presentation/components/catalog-product-grid";
import { ProductDrawer } from "@/features/catalog/presentation/components/product-drawer";
import { WhatsAppLabel } from "@/features/catalog/presentation/components/whatsapp-label";
import { useCatalogViewModel } from "@/features/catalog/presentation/viewmodels/use-catalog-viewmodel";

type CatalogExperienceProps = {
  products: CatalogProduct[];
  storeName: string;
  whatsappPhone: string;
  configuredFilters?: StoreFilterOptions;
};

export function CatalogExperience({ products, storeName, whatsappPhone, configuredFilters }: CatalogExperienceProps) {
  const viewModel = useCatalogViewModel(products, configuredFilters);
  const { state, actions } = viewModel;
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
        query={state.query}
        categories={viewModel.categories}
        activeCategory={state.category}
        onQueryChange={actions.updateQuery}
        onCategoryChange={actions.updateCategory}
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
          whatsappPhone={whatsappPhone}
          product={state.selectedProduct}
          selection={state.selection}
          selectedVariant={viewModel.selectedVariant}
          isSelectionReady={viewModel.isSelectionReady}
          orderTotal={viewModel.orderTotal}
          formattedOrderTotal={viewModel.formattedOrderTotal}
          onSelectionChange={actions.updateSelection}
          onQuantityChange={actions.updateQuantity}
          onClose={actions.closeProduct}
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

      <button
        className="floating-whatsapp fixed bottom-5 right-4 z-30 flex size-14 items-center justify-center rounded-full bg-[var(--color-lime)] text-black shadow-[0_8px_20px_rgba(0,0,0,.22)] md:hidden"
        onClick={() => window.open(`https://wa.me/${whatsappPhone}`, "_blank", "noopener,noreferrer")}
        aria-label="Falar no WhatsApp"
      >
        <WhatsAppLabel>
          <span className="sr-only">FALAR NO WHATSAPP</span>
        </WhatsAppLabel>
      </button>
    </div>
  );
}
