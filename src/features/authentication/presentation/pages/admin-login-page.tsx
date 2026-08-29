"use client";

import { useEffect } from "react";

import { createSignInAdminUseCase } from "@/core/di/authentication-browser";
import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { authenticationRoutes } from "@/features/authentication/router/authentication-routes";
import { AdminLoginForm } from "@/features/authentication/presentation/components/admin-login-form";
import { useAdminLoginViewModel } from "@/features/authentication/presentation/viewmodels/use-admin-login-viewmodel";

type AdminLoginPageProps = {
  supabaseConfig: AdminAuthenticationBrowserConfig;
};

export function AdminLoginPage({ supabaseConfig }: AdminLoginPageProps) {
  const viewModel = useAdminLoginViewModel(() => createSignInAdminUseCase(supabaseConfig));
  const { state, actions } = viewModel;

  useEffect(() => {
    if (state.effect?.type !== "signed-in") {
      return;
    }

    actions.clearEffect();
    window.location.assign(authenticationRoutes.dashboard);
  }, [actions, state.effect]);

  return (
    <AdminLoginForm
      email={state.email}
      password={state.password}
      status={state.status}
      errorMessage={state.errorMessage}
      isSubmitDisabled={viewModel.isSubmitDisabled}
      onEmailChange={actions.updateEmail}
      onPasswordChange={actions.updatePassword}
      onSubmit={actions.submit}
    />
  );
}
