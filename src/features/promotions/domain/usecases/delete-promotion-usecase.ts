import type { StorePromotion } from "@/core/promotions/promotion";
import type { PromotionsRepository } from "@/features/promotions/domain/repositories/promotions-repository";

export class DeletePromotionUseCase {
  constructor(private readonly repository: PromotionsRepository) {}

  call(promotion: StorePromotion) {
    return this.repository.delete(promotion);
  }
}
