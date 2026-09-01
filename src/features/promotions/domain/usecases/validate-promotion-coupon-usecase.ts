import type { PromotionsRepository } from "@/features/promotions/domain/repositories/promotions-repository";

export class ValidatePromotionCouponUseCase {
  constructor(private readonly repository: PromotionsRepository) {}

  call(input: { code: string; items: Array<{ variantId: string; quantity: number }> }) {
    if (!input.items.length) {
      return Promise.resolve({ ok: false as const, failure: { type: "validation" as const, message: "Adicione produtos ao carrinho." } });
    }

    return this.repository.validateCoupon(input);
  }
}
