import { createCatalogProductsUseCaseWithClient } from "@/core/di/catalog";
import { createGetStoreSettingsUseCaseWithClient } from "@/core/di/store-settings";
import { createSupabaseServerClient } from "@/core/network/supabase/server-client";
import { createDefaultStoreFilterOptions, type StoreFilterOptions, type StoreFilterType } from "@/core/store-filters/store-filter-options";
import { CatalogExperience } from "@/features/catalog/presentation/pages/catalog-experience";

export async function CatalogPage() {
  const supabaseClient = await createSupabaseServerClient();
  const [productsResult, storeSettingsResult, filterOptionsResult] = await Promise.all([
    createCatalogProductsUseCaseWithClient(supabaseClient).call(),
    createGetStoreSettingsUseCaseWithClient(supabaseClient).call(),
    supabaseClient.from("store_filter_options").select("filter_type, value, position").order("position"),
  ]);

  if (!productsResult.ok) {
    return (
      <main className="grid min-h-screen place-items-center bg-white px-6 text-center">
        <p className="text-sm font-semibold">{productsResult.failure.message}</p>
      </main>
    );
  }

  if (!storeSettingsResult.ok) {
    return (
      <main className="grid min-h-screen place-items-center bg-white px-6 text-center">
        <p className="text-sm font-semibold">{storeSettingsResult.failure.message}</p>
      </main>
    );
  }

  const configuredFilters: StoreFilterOptions = createDefaultStoreFilterOptions();
  if (!filterOptionsResult.error && filterOptionsResult.data?.length) {
    (Object.keys(configuredFilters) as StoreFilterType[]).forEach((type) => {
      configuredFilters[type] = filterOptionsResult.data.filter((item) => item.filter_type === type).map((item) => item.value);
    });
  }
  return <CatalogExperience products={productsResult.data} storeName={storeSettingsResult.data.storeName} whatsappPhone={storeSettingsResult.data.whatsappPhone} configuredFilters={configuredFilters} />;
}
