import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { createAdministrationProductsUseCase } from "@/core/di/administration";
import { createGetStoreSettingsUseCaseWithClient } from "@/core/di/store-settings";
import { createSupabaseServerClient } from "@/core/network/supabase/server-client";
import { AdministrationExperience } from "@/features/administration/presentation/pages/administration-experience";

type AdministrationPageProps = {
  adminEmail: string;
  supabaseConfig: AdminAuthenticationBrowserConfig;
};

export async function AdministrationPage({ adminEmail, supabaseConfig }: AdministrationPageProps) {
  const supabaseClient = await createSupabaseServerClient();
  const [productsResult, storeSettingsResult] = await Promise.all([
    createAdministrationProductsUseCase().call(),
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

  return <AdministrationExperience products={productsResult.data} storeName={storeSettingsResult.data.storeName} adminEmail={adminEmail} supabaseConfig={supabaseConfig} />;
}
