"use client";

import { useState } from "react";

import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { administrationLayout } from "@/core/theme/tokens";
import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import { AdministrationHeader } from "@/features/administration/presentation/components/administration-header";
import { AdministrationProductDrawer } from "@/features/administration/presentation/components/administration-product-drawer";
import { AdministrationProductsTable } from "@/features/administration/presentation/components/administration-products-table";
import { AdministrationSearchBar } from "@/features/administration/presentation/components/administration-search-bar";
import { AdministrationSidebar } from "@/features/administration/presentation/components/administration-sidebar";
import { useAdministrationDashboardViewModel } from "@/features/administration/presentation/viewmodels/use-administration-dashboard-viewmodel";

type AdministrationExperienceProps = {
  products: AdministrationProduct[];
  adminEmail: string;
  supabaseConfig: AdminAuthenticationBrowserConfig;
};

export function AdministrationExperience({
  products,
  adminEmail,
  supabaseConfig,
}: AdministrationExperienceProps) {
  const viewModel = useAdministrationDashboardViewModel(products);
  const { state, actions } = viewModel;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-[#f7f7f5] md:grid"
      style={{ gridTemplateColumns: `minmax(${administrationLayout.sidebarDesktopWidth}, ${administrationLayout.sidebarDesktopWidth}) minmax(0, 1fr)` }}
    >
      <AdministrationSidebar
        adminEmail={adminEmail}
        supabaseConfig={supabaseConfig}
        isMobileOpen={isMobileSidebarOpen}
        onOpenMobile={() => setIsMobileSidebarOpen(true)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <main className="px-4 pb-8 pt-[72px] md:px-8 md:py-8">
        <AdministrationHeader totalProducts={viewModel.filteredProducts.length} onCreateProduct={actions.openNewProductDrawer} />
        <AdministrationSearchBar query={state.query} onQueryChange={actions.updateQuery} />
        <AdministrationProductsTable
          products={viewModel.filteredProducts}
          selectedProductId={state.selectedProductId}
          onOpenProduct={actions.openExistingProduct}
        />
        <AdministrationProductDrawer
          isOpen={state.isProductDrawerOpen}
          mode={state.editorMode}
          saveStatus={state.saveStatus}
          draft={state.draft}
          onClose={actions.closeProductDrawer}
          onFieldChange={actions.updateDraftField}
          onPriceChange={actions.updateDraftPrice}
          onIncrementStock={actions.incrementDraftStock}
          onDecrementStock={actions.decrementDraftStock}
          onToggleOption={actions.toggleDraftListField}
          onImageChange={actions.updateDraftImage}
          onImageCropChange={actions.updateDraftImageCrop}
          onSave={actions.saveSelections}
        />
      </main>
    </div>
  );
}
