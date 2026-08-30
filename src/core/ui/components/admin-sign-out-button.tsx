"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { CSSProperties } from "react";

import { createSignOutAdminUseCase, type AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { appRoutes } from "@/core/router/app-routes";

type AdminSignOutButtonProps = {
  supabaseConfig: AdminAuthenticationBrowserConfig;
  className?: string;
  style?: CSSProperties;
};

export function AdminSignOutButton({
  supabaseConfig,
  className = "",
  style,
}: AdminSignOutButtonProps) {
  const router = useRouter();
  const signOutAdminUseCase = useMemo(() => createSignOutAdminUseCase(supabaseConfig), [supabaseConfig]);

  async function handleSignOut() {
    await signOutAdminUseCase.call();
    router.replace(appRoutes.adminLogin);
    router.refresh();
  }

  return (
    <button className={className} onClick={handleSignOut} style={style}>
      SAIR
    </button>
  );
}
