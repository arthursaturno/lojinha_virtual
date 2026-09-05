"use client";

import type { SupabaseBrowserConfig } from "@/core/network/supabase/browser-client";
import { createSupabaseBrowserClient } from "@/core/network/supabase/browser-client";
import {
  createDeletePromotionUseCaseWithClient,
  createSavePromotionUseCaseWithClient,
  createUploadPromotionImageUseCaseWithClient,
  createListAvailableCartBenefitsUseCaseWithClient,
  createValidatePromotionCartBenefitUseCaseWithClient,
} from "@/core/di/promotions";

export function createPromotionActions(config: SupabaseBrowserConfig) {
  const client = createSupabaseBrowserClient(config);

  return {
    save: createSavePromotionUseCaseWithClient(client),
    delete: createDeletePromotionUseCaseWithClient(client),
    uploadImage: createUploadPromotionImageUseCaseWithClient(client),
    listAvailableCartBenefits: createListAvailableCartBenefitsUseCaseWithClient(client),
    validateCartBenefit: createValidatePromotionCartBenefitUseCaseWithClient(client),
  };
}
