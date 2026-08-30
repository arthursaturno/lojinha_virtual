import { createCatalogProductsUseCase } from "@/core/di/catalog";
import { createGetStoreSettingsUseCaseWithClient } from "@/core/di/store-settings";
import { createSupabaseServerClient } from "@/core/network/supabase/server-client";
import { CatalogExperience } from "@/features/catalog/presentation/pages/catalog-experience";

export async function CatalogPage() {
  const supabaseClient = await createSupabaseServerClient();
  const [productsResult, storeSettingsResult] = await Promise.all([
    createCatalogProductsUseCase().call(),
    createGetStoreSettingsUseCaseWithClient(supabaseClient).call(),
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

  return <CatalogExperience products={productsResult.data} storeName={storeSettingsResult.data.storeName} whatsappPhone={storeSettingsResult.data.whatsappPhone} />;
}
