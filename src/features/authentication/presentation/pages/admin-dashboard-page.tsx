import { redirect } from "next/navigation";

import { getPublicEnv } from "@/core/config/env";
import { createGetCurrentAdminSessionUseCaseWithClient } from "@/core/di/authentication";
import { createSupabaseServerClient } from "@/core/network/supabase/server-client";
import { AdminSignOutButton } from "@/features/authentication/presentation/components/admin-sign-out-button";
import { authenticationRoutes } from "@/features/authentication/router/authentication-routes";

export async function AdminDashboardPage() {
  const env = getPublicEnv();
  const supabaseClient = await createSupabaseServerClient();
  const getCurrentAdminSessionUseCase = createGetCurrentAdminSessionUseCaseWithClient(supabaseClient, env.adminEmail);
  const result = await getCurrentAdminSessionUseCase.call();

  if (!result.ok) {
    redirect(authenticationRoutes.login);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 text-center text-[var(--color-foreground)]">
      <section className="w-full max-w-[520px] border border-[var(--color-border)] px-6 py-8">
        <strong className="font-display text-[42px] font-normal leading-none">EZZION IMPORTS</strong>
        <p className="mt-3 text-sm text-[var(--color-muted)]">Painel administrativo inicial.</p>
        <p className="mt-2 text-[11px] font-semibold text-[var(--color-muted)]">{result.data.email}</p>
        <p className="mt-6 text-[12px] font-semibold">
          Aqui vamos conectar produtos, fotos, estoque e configuracoes da loja.
        </p>
        <AdminSignOutButton
          supabaseConfig={{
            supabaseUrl: env.supabaseUrl,
            supabaseAnonKey: env.supabaseAnonKey,
            adminEmail: env.adminEmail,
          }}
        />
      </section>
    </main>
  );
}
