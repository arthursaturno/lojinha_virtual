import { redirect } from "next/navigation";

import { getPublicEnv } from "@/core/config/env";
import { appRoutes } from "@/core/router/app-routes";
import { createGetCurrentAdminSessionUseCaseWithClient } from "@/core/di/authentication";
import { createSupabaseServerClient } from "@/core/network/supabase/server-client";
import { AdministrationPage } from "@/features/administration/presentation/pages/administration-page";

export default async function AdminProductsRoute() {
  const env = getPublicEnv();
  const supabaseClient = await createSupabaseServerClient();
  const getCurrentAdminSessionUseCase = createGetCurrentAdminSessionUseCaseWithClient(supabaseClient, env.adminEmail);
  const result = await getCurrentAdminSessionUseCase.call();

  if (!result.ok) {
    redirect(appRoutes.adminLogin);
  }

  return (
    <AdministrationPage
      adminEmail={result.data.email}
      supabaseConfig={{
        supabaseUrl: env.supabaseUrl,
        supabaseAnonKey: env.supabaseAnonKey,
        adminEmail: env.adminEmail,
      }}
    />
  );
}
