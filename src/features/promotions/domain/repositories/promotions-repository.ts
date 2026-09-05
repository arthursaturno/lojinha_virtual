import type {
  PromotionCartBenefit,
  PromotionCartValidation,
  StorePromotion,
} from "@/core/promotions/promotion";
import type { Result } from "@/core/result/result";

export type PromotionImageUpload = {
  file: File;
};

export interface PromotionsRepository {
  getForAdministration(): Promise<Result<StorePromotion[]>>;
  getActive(): Promise<Result<StorePromotion[]>>;
  save(promotion: StorePromotion): Promise<Result<StorePromotion>>;
  delete(promotion: StorePromotion): Promise<Result<void>>;
  uploadImage(upload: PromotionImageUpload): Promise<Result<string>>;
  listAvailableCartBenefits(input: {
    items: Array<{ variantId: string; quantity: number }>;
  }): Promise<Result<PromotionCartBenefit[]>>;
  validateCartBenefit(input: {
    promotionId?: string;
    items: Array<{ variantId: string; quantity: number }>;
  }): Promise<Result<PromotionCartValidation>>;
}
