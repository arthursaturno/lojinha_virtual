import { Result } from "@/core/result/result";
import type { PromotionsRepository } from "@/features/promotions/domain/repositories/promotions-repository";

export class ValidatePromotionCartBenefitUseCase {
  constructor(private readonly repository: PromotionsRepository) {}

  call(input: { promotionId?: string; items: Array<{ variantId: string; quantity: number }> }) {
    if (!input.items.length) {
      return Promise.resolve(Result.failure({ type: "validation", message: "Adicione produtos ao carrinho." }));
    }

    return this.repository.validateCartBenefit(input);
  }
}
