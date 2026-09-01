import { redirect } from "next/navigation";

import { getPublicEnv } from "@/core/config/env";
import { createGetCurrentAdminSessionUseCaseWithClient } from "@/core/di/authentication";
import { createAdministrationProductsUseCaseWithClient } from "@/core/di/administration";
import { createGetAdministrationPromotionsUseCaseWithClient } from "@/core/di/promotions";
import { createGetStoreSettingsUseCaseWithClient } from "@/core/di/store-settings";
import { createSupabaseServerClient } from "@/core/network/supabase/server-client";
import { appRoutes } from "@/core/router/app-routes";
import { PromotionsPage } from "@/features/promotions/presentation/pages/promotions-page";

export default async function AdminPromotionsRoute() {
  const env = getPublicEnv();
  const supabaseClient = await createSupabaseServerClient();
  const sessionResult = await createGetCurrentAdminSessionUseCaseWithClient(supabaseClient, env.adminEmail).call();
  if (!sessionResult.ok) redirect(appRoutes.adminLogin);

  const [promotionsResult, productsResult, storeSettingsResult] = await Promise.all([
    createGetAdministrationPromotionsUseCaseWithClient(supabaseClient).call(),
    createAdministrationProductsUseCaseWithClient(supabaseClient).call(),
    createGetStoreSettingsUseCaseWithClient(supabaseClient).call(),
  ]);

  if (!promotionsResult.ok || !productsResult.ok || !storeSettingsResult.ok) {
    return <main className="grid min-h-screen place-items-center bg-white px-6 text-center"><p className="text-sm font-semibold">Nao foi possivel carregar as promocoes.</p></main>;
  }

  return <PromotionsPage storeName={storeSettingsResult.data.storeName} adminEmail={sessionResult.data.email} supabaseConfig={{ supabaseUrl: env.supabaseUrl, supabaseAnonKey: env.supabaseAnonKey, adminEmail: env.adminEmail }} promotions={promotionsResult.data} products={productsResult.data.map((product) => ({ id: product.id, name: product.name }))} />;
}
