import { createCatalogProductsUseCaseWithClient } from "@/core/di/catalog";
import { createGetActivePromotionsUseCaseWithClient } from "@/core/di/promotions";
import { getProductPromotion } from "@/core/promotions/get-product-promotion";
import { createGetStoreSettingsUseCaseWithClient } from "@/core/di/store-settings";
import { createSupabaseServerClient } from "@/core/network/supabase/server-client";
import { getPublicEnv } from "@/core/config/env";
import { createDefaultStoreFilterOptions, type StoreFilterOptions, type StoreFilterType } from "@/core/store-filters/store-filter-options";
import { CatalogExperience } from "@/features/catalog/presentation/pages/catalog-experience";

export async function CatalogPage() {
  const env = getPublicEnv();
  const supabaseClient = await createSupabaseServerClient();
  const [productsResult, storeSettingsResult, filterOptionsResult, promotionsResult] = await Promise.all([
    createCatalogProductsUseCaseWithClient(supabaseClient).call(),
    createGetStoreSettingsUseCaseWithClient(supabaseClient).call(),
    supabaseClient.from("store_filter_options").select("filter_type, value, position").order("position"),
    createGetActivePromotionsUseCaseWithClient(supabaseClient).call(),
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
  const promotions = promotionsResult.ok ? promotionsResult.data : [];
  const products = productsResult.data.map((product) => {
    const promotion = getProductPromotion(product.id, product.price, promotions);
    return promotion.promotionalPrice ? { ...product, originalPrice: product.price, price: promotion.promotionalPrice, promotionLabel: promotion.label } : { ...product, promotionLabel: promotion.label };
  });
  return <CatalogExperience products={products} storeName={storeSettingsResult.data.storeName} whatsappPhone={storeSettingsResult.data.whatsappPhone} configuredFilters={configuredFilters} promotions={promotions} supabaseConfig={{ supabaseUrl: env.supabaseUrl, supabaseAnonKey: env.supabaseAnonKey }} />;
}
