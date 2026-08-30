import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { createAdministrationProductsUseCase } from "@/core/di/administration";
import { AdministrationExperience } from "@/features/administration/presentation/pages/administration-experience";

type AdministrationPageProps = {
  adminEmail: string;
  supabaseConfig: AdminAuthenticationBrowserConfig;
};

export async function AdministrationPage({ adminEmail, supabaseConfig }: AdministrationPageProps) {
  const result = await createAdministrationProductsUseCase().call();

  if (!result.ok) {
    return (
      <main className="grid min-h-screen place-items-center bg-white px-6 text-center">
        <p className="text-sm font-semibold">{result.failure.message}</p>
      </main>
    );
  }

  return <AdministrationExperience products={result.data} adminEmail={adminEmail} supabaseConfig={supabaseConfig} />;
}
