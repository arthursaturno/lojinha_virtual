import { redirect } from "next/navigation";

import { getServerEnv } from "@/core/config/env";
import { createGetCurrentAdminSessionUseCaseWithClient } from "@/core/di/authentication";
import { createSupabaseServerClient } from "@/core/network/supabase/server-client";
import { appRoutes } from "@/core/router/app-routes";
import { createDefaultStoreFilterOptions, type StoreFilterOptions, type StoreFilterType } from "@/core/store-filters/store-filter-options";
import { StoreFiltersExperience } from "@/features/store-filters/presentation/pages/store-filters-experience";

export default async function AdminFiltersRoute() {
  const env = getServerEnv(); const client = await createSupabaseServerClient();
  const session = await createGetCurrentAdminSessionUseCaseWithClient(client, env.adminEmail).call();
  if (!session.ok) redirect(appRoutes.adminLogin);
  const { data } = await client.from("store_filter_options").select("filter_type, value, position").order("position");
  const options: StoreFilterOptions = createDefaultStoreFilterOptions();
  if (data?.length) { (Object.keys(options) as StoreFilterType[]).forEach((type) => { options[type] = data.filter((row) => row.filter_type === type).map((row) => row.value); }); }
  return <StoreFiltersExperience storeName="Ezzion Imports" adminEmail={session.data.email} supabaseConfig={{ supabaseUrl: env.supabaseUrl, supabaseAnonKey: env.supabaseAnonKey }} initialOptions={options} />;
}
