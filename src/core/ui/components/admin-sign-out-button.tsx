"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import { createSignOutAdminUseCase, type AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { appRoutes } from "@/core/router/app-routes";
import { AppConfirmationDialog } from "@/core/ui/components/app-confirmation-dialog";
import { AppToast } from "@/core/ui/components/app-toast";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage(null);
    const result = await signOutAdminUseCase.call();

    if (!result.ok) {
      setIsSigningOut(false);
      setErrorMessage(result.failure.message);
      return;
    }

    router.replace(appRoutes.adminLogin);
    router.refresh();
  }

  return (
    <>
      <button className={className} onClick={() => setIsDialogOpen(true)} style={style}>
        SAIR
      </button>
      <AppConfirmationDialog
        isOpen={isDialogOpen}
        title="Sair do painel?"
        message="Voce precisara informar seu e-mail e senha para acessar novamente."
        confirmLabel="SAIR"
        isConfirming={isSigningOut}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={handleSignOut}
      />
      {errorMessage ? (
        <AppToast tone="error" message={errorMessage} onDismiss={() => setErrorMessage(null)} />
      ) : null}
    </>
  );
}
