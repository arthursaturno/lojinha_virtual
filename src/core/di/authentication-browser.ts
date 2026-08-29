"use client";

import { createSupabaseBrowserClient } from "@/core/network/supabase/browser-client";
import type { SupabaseBrowserConfig } from "@/core/network/supabase/browser-client";
import { createSignInAdminUseCaseWithClient, createSignOutAdminUseCaseWithClient } from "@/core/di/authentication";

export type AdminAuthenticationBrowserConfig = SupabaseBrowserConfig & {
  adminEmail: string;
};

export function createSignInAdminUseCase(config: AdminAuthenticationBrowserConfig) {
  return createSignInAdminUseCaseWithClient(createSupabaseBrowserClient(config), config.adminEmail);
}

export function createSignOutAdminUseCase(config: AdminAuthenticationBrowserConfig) {
  return createSignOutAdminUseCaseWithClient(createSupabaseBrowserClient(config), config.adminEmail);
}
