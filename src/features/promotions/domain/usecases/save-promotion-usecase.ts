import { Result } from "@/core/result/result";
import type { StorePromotion } from "@/core/promotions/promotion";
import type { PromotionsRepository } from "@/features/promotions/domain/repositories/promotions-repository";

export class SavePromotionUseCase {
  constructor(private readonly repository: PromotionsRepository) {}

  call(promotion: StorePromotion) {
    if (!promotion.internalName.trim()) {
      return Promise.resolve(Result.failure<StorePromotion>({ type: "validation", message: "Informe o nome interno da promocao." }));
    }

    if (promotion.kind === "popup" && !(promotion.imageUrls?.length ?? 0) && !promotion.imageUrl) {
      return Promise.resolve(Result.failure<StorePromotion>({ type: "validation", message: "Envie a imagem da campanha." }));
    }

    const productRules = promotion.productRules ?? (promotion.productRule ? [promotion.productRule] : []);
    if (
      ["product_discount", "quantity_discount"].includes(promotion.kind)
      && (!productRules.length || productRules.some((rule) => !rule.productId && !rule.targetValue))
    ) {
      return Promise.resolve(Result.failure<StorePromotion>({ type: "validation", message: "Defina o alvo da oferta." }));
    }

    if (["cart_benefit", "free_shipping"].includes(promotion.kind) && !promotion.benefitRule?.title.trim()) {
      return Promise.resolve(Result.failure<StorePromotion>({ type: "validation", message: "Informe o titulo do beneficio." }));
    }

    return this.repository.save(promotion);
  }
}
