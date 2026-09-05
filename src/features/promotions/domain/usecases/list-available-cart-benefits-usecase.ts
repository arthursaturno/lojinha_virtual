import { Result } from "@/core/result/result";
import type { PromotionsRepository } from "@/features/promotions/domain/repositories/promotions-repository";

export class ListAvailableCartBenefitsUseCase {
  constructor(private readonly repository: PromotionsRepository) {}

  call(input: { items: Array<{ variantId: string; quantity: number }> }) {
    if (!input.items.length) return Promise.resolve(Result.success([]));

    return this.repository.listAvailableCartBenefits(input);
  }
}
