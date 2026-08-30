"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { CSSProperties } from "react";

import { appRoutes } from "@/core/router/app-routes";
import { createSignOutAdminUseCase, type AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";

type AdministrationSignOutButtonProps = {
  supabaseConfig: AdminAuthenticationBrowserConfig;
  className?: string;
  style?: CSSProperties;
};

export function AdministrationSignOutButton({
  supabaseConfig,
  className = "",
  style,
}: AdministrationSignOutButtonProps) {
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
