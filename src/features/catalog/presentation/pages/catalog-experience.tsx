"use client";

import { storeConfig } from "@/core/theme/tokens";
import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import { CatalogFilters } from "@/features/catalog/presentation/components/catalog-filters";
import { CatalogHeader } from "@/features/catalog/presentation/components/catalog-header";
import { CatalogHero } from "@/features/catalog/presentation/components/catalog-hero";
import { CatalogProductGrid } from "@/features/catalog/presentation/components/catalog-product-grid";
import { ProductDrawer } from "@/features/catalog/presentation/components/product-drawer";
import { WhatsAppLabel } from "@/features/catalog/presentation/components/whatsapp-label";
import { useCatalogViewModel } from "@/features/catalog/presentation/viewmodels/use-catalog-viewmodel";

type CatalogExperienceProps = {
  products: CatalogProduct[];
};

export function CatalogExperience({ products }: CatalogExperienceProps) {
  const viewModel = useCatalogViewModel(products);
  const { state, actions } = viewModel;

  return (
    <div className="min-h-screen bg-white text-[var(--color-foreground)]">
      <CatalogHeader
        query={state.query}
        categories={viewModel.categories}
        activeCategory={state.category}
        onQueryChange={actions.updateQuery}
        onCategoryChange={actions.updateCategory}
      />

      <CatalogHero />

      <main id="catalogo" className="min-h-[600px] md:grid md:grid-cols-[190px_1fr]">
        <CatalogFilters
          categories={viewModel.categories}
          categoryCount={viewModel.categoryCount}
          activeCategory={state.category}
          sizes={viewModel.availableSizes}
          colors={viewModel.availableColors}
          models={viewModel.availableModels}
          sizeFilters={viewModel.sizeFilters}
          colorFilters={viewModel.colorFilters}
          modelFilters={viewModel.modelFilters}
          maxPrice={viewModel.maxPrice}
          formattedMaxPrice={viewModel.formattedMaxPrice}
          onCategoryChange={actions.updateCategory}
          onSizeToggle={actions.toggleSizeFilter}
          onColorToggle={actions.toggleColorFilter}
          onModelToggle={actions.toggleModelFilter}
          onMaxPriceChange={actions.updateMaxPrice}
          onClear={actions.clearFilters}
        />

        <CatalogProductGrid
          products={viewModel.filteredProducts}
          sort={state.sort}
          onSortChange={actions.updateSort}
          onOpenProduct={actions.openProduct}
        />
      </main>

      {state.selectedProduct ? (
        <ProductDrawer
          product={state.selectedProduct}
          selection={state.selection}
          selectedVariant={viewModel.selectedVariant}
          isSelectionReady={viewModel.isSelectionReady}
          onSelectionChange={actions.updateSelection}
          onClose={actions.closeProduct}
        />
      ) : null}

      <button
        className="fixed inset-x-0 bottom-0 z-20 flex h-[58px] items-center justify-center gap-[9px] bg-[var(--color-lime)] text-sm font-black md:hidden"
        onClick={() => window.open(`https://wa.me/${storeConfig.whatsappPhone}`, "_blank", "noopener,noreferrer")}
      >
        <WhatsAppLabel>FALAR NO WHATSAPP</WhatsAppLabel>
      </button>
    </div>
  );
}
