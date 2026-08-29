"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { createSignOutAdminUseCase } from "@/core/di/authentication-browser";
import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { authenticationRoutes } from "@/features/authentication/router/authentication-routes";

type AdminSignOutButtonProps = {
  supabaseConfig: AdminAuthenticationBrowserConfig;
};

export function AdminSignOutButton({ supabaseConfig }: AdminSignOutButtonProps) {
  const router = useRouter();
  const signOutAdminUseCase = useMemo(() => createSignOutAdminUseCase(supabaseConfig), [supabaseConfig]);

  async function handleSignOut() {
    await signOutAdminUseCase.call();
    router.replace(authenticationRoutes.login);
    router.refresh();
  }

  return (
    <button className="mt-6 h-10 bg-[var(--color-foreground)] px-5 text-[11px] font-black text-white" onClick={handleSignOut}>
      SAIR
    </button>
  );
}
