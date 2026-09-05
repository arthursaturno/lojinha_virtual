import { redirect } from "next/navigation";

import { getServerEnv } from "@/core/config/env";
import { createGetCurrentAdminSessionUseCaseWithClient } from "@/core/di/authentication";
import { createSupabaseServerClient } from "@/core/network/supabase/server-client";
import { appRoutes } from "@/core/router/app-routes";
import { StoreSettingsPage } from "@/features/store-settings/presentation/pages/store-settings-page";

export default async function AdminSettingsRoute() {
  const env = getServerEnv();
  const supabaseClient = await createSupabaseServerClient();
  const result = await createGetCurrentAdminSessionUseCaseWithClient(supabaseClient, env.adminEmail).call();

  if (!result.ok) {
    redirect(appRoutes.adminLogin);
  }

  return <StoreSettingsPage adminEmail={result.data.email} supabaseConfig={{ supabaseUrl: env.supabaseUrl, supabaseAnonKey: env.supabaseAnonKey }} />;
}
