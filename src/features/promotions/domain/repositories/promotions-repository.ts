import type {
  PromotionCouponValidation,
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
  validateCoupon(input: {
    code: string;
    items: Array<{ variantId: string; quantity: number }>;
  }): Promise<Result<PromotionCouponValidation>>;
}
