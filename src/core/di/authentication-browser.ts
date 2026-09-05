"use client";

import { createSupabaseBrowserClient } from "@/core/network/supabase/browser-client";
import type { SupabaseBrowserConfig } from "@/core/network/supabase/browser-client";
import { createSignInAdminUseCaseWithClient, createSignOutAdminUseCaseWithClient } from "@/core/di/authentication";

export type AdminAuthenticationBrowserConfig = SupabaseBrowserConfig;

export function createSignInAdminUseCase(config: AdminAuthenticationBrowserConfig) {
  return createSignInAdminUseCaseWithClient(createSupabaseBrowserClient(config));
}

export function createSignOutAdminUseCase(config: AdminAuthenticationBrowserConfig) {
  return createSignOutAdminUseCaseWithClient(createSupabaseBrowserClient(config));
}
