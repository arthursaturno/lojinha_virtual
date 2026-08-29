"use client";

import { createBrowserClient } from "@supabase/ssr";

import { normalizeSupabaseProjectUrl } from "@/core/config/env";

export type SupabaseBrowserConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export function createSupabaseBrowserClient(config: SupabaseBrowserConfig) {
  return createBrowserClient(normalizeSupabaseProjectUrl(config.supabaseUrl), config.supabaseAnonKey);
}
