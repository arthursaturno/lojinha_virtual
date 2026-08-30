"use client";

import type { SupabaseBrowserConfig } from "@/core/network/supabase/browser-client";
import { createSupabaseBrowserClient } from "@/core/network/supabase/browser-client";
import { createUpdateStoreSettingsUseCaseWithClient } from "@/core/di/store-settings";

export function createUpdateStoreSettingsUseCase(config: SupabaseBrowserConfig) {
  return createUpdateStoreSettingsUseCaseWithClient(createSupabaseBrowserClient(config));
}
