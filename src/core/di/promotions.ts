import type { SupabaseClient } from "@supabase/supabase-js";

import { PromotionsSupabaseDataSource } from "@/features/promotions/data/datasources/promotions-supabase-datasource";
import { PromotionsRepositoryImpl } from "@/features/promotions/data/repositories/promotions-repository-impl";
import { DeletePromotionUseCase } from "@/features/promotions/domain/usecases/delete-promotion-usecase";
import { GetActivePromotionsUseCase } from "@/features/promotions/domain/usecases/get-active-promotions-usecase";
import { GetAdministrationPromotionsUseCase } from "@/features/promotions/domain/usecases/get-administration-promotions-usecase";
import { SavePromotionUseCase } from "@/features/promotions/domain/usecases/save-promotion-usecase";
import { UploadPromotionImageUseCase } from "@/features/promotions/domain/usecases/upload-promotion-image-usecase";
import { ValidatePromotionCouponUseCase } from "@/features/promotions/domain/usecases/validate-promotion-coupon-usecase";

function createPromotionsRepository(supabaseClient: SupabaseClient) {
  return new PromotionsRepositoryImpl(new PromotionsSupabaseDataSource(supabaseClient));
}

export function createGetAdministrationPromotionsUseCaseWithClient(supabaseClient: SupabaseClient) {
  return new GetAdministrationPromotionsUseCase(createPromotionsRepository(supabaseClient));
}

export function createGetActivePromotionsUseCaseWithClient(supabaseClient: SupabaseClient) {
  return new GetActivePromotionsUseCase(createPromotionsRepository(supabaseClient));
}

export function createSavePromotionUseCaseWithClient(supabaseClient: SupabaseClient) {
  return new SavePromotionUseCase(createPromotionsRepository(supabaseClient));
}

export function createDeletePromotionUseCaseWithClient(supabaseClient: SupabaseClient) {
  return new DeletePromotionUseCase(createPromotionsRepository(supabaseClient));
}

export function createUploadPromotionImageUseCaseWithClient(supabaseClient: SupabaseClient) {
  return new UploadPromotionImageUseCase(createPromotionsRepository(supabaseClient));
}

export function createValidatePromotionCouponUseCaseWithClient(supabaseClient: SupabaseClient) {
  return new ValidatePromotionCouponUseCase(createPromotionsRepository(supabaseClient));
}
