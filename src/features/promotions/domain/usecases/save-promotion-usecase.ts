import { Result } from "@/core/result/result";
import type { StorePromotion } from "@/core/promotions/promotion";
import type { PromotionsRepository } from "@/features/promotions/domain/repositories/promotions-repository";

export class SavePromotionUseCase {
  constructor(private readonly repository: PromotionsRepository) {}

  call(promotion: StorePromotion) {
    if (!promotion.internalName.trim()) {
      return Promise.resolve(Result.failure<StorePromotion>({ type: "validation", message: "Informe o nome interno da promocao." }));
    }

    if (promotion.kind === "popup" && !promotion.imageUrl) {
      return Promise.resolve(Result.failure<StorePromotion>({ type: "validation", message: "Envie a imagem da campanha." }));
    }

    if (["product_discount", "quantity_discount"].includes(promotion.kind) && !promotion.productRule) {
      return Promise.resolve(Result.failure<StorePromotion>({ type: "validation", message: "Selecione um produto para a oferta." }));
    }

    if (promotion.kind === "coupon" && !promotion.couponRule?.code.trim()) {
      return Promise.resolve(Result.failure<StorePromotion>({ type: "validation", message: "Informe o codigo do cupom." }));
    }

    return this.repository.save(promotion);
  }
}
