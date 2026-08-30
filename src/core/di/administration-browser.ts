"use client";

import type { SupabaseBrowserConfig } from "@/core/network/supabase/browser-client";
import { createSupabaseBrowserClient } from "@/core/network/supabase/browser-client";
import {
  createCreateAdministrationProductUseCaseWithClient,
  createDeleteAdministrationProductUseCaseWithClient,
  createDeleteAdministrationProductImagesUseCaseWithClient,
  createUploadAdministrationProductImageUseCaseWithClient,
  createUpdateAdministrationProductUseCaseWithClient,
} from "@/core/di/administration";

export function createAdministrationProductActions(config: SupabaseBrowserConfig) {
  const client = createSupabaseBrowserClient(config);

  return {
    create: createCreateAdministrationProductUseCaseWithClient(client),
    update: createUpdateAdministrationProductUseCaseWithClient(client),
    delete: createDeleteAdministrationProductUseCaseWithClient(client),
    deleteImages: createDeleteAdministrationProductImagesUseCaseWithClient(client),
    uploadImage: createUploadAdministrationProductImageUseCaseWithClient(client),
  };
}
