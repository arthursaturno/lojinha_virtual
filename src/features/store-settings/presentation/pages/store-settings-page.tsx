import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { createGetStoreSettingsUseCase } from "@/core/di/store-settings";
import { StoreSettingsExperience } from "@/features/store-settings/presentation/pages/store-settings-experience";

type StoreSettingsPageProps = {
  adminEmail: string;
  supabaseConfig: AdminAuthenticationBrowserConfig;
};

export async function StoreSettingsPage({ adminEmail, supabaseConfig }: StoreSettingsPageProps) {
  const result = await createGetStoreSettingsUseCase().call();

  if (!result.ok) {
    return <main className="grid min-h-screen place-items-center bg-white px-6 text-center"><p className="text-sm font-semibold">{result.failure.message}</p></main>;
  }

  return <StoreSettingsExperience settings={result.data} adminEmail={adminEmail} supabaseConfig={supabaseConfig} />;
}
