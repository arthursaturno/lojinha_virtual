import type { PromotionDiscountType, PromotionKind, StorePromotion } from "@/core/promotions/promotion";

export type PromotionProductOption = { id: string; name: string };
export type PromotionSaveStatus = "idle" | "loading" | "failure";

export type PromotionDraft = StorePromotion;

export type PromotionsViewState = {
  promotions: StorePromotion[];
  draft: PromotionDraft | null;
  saveStatus: PromotionSaveStatus;
  feedbackMessage?: string;
};

export const promotionKindLabel: Record<PromotionKind, string> = {
  popup: "POPUP COM FOTO",
  product_discount: "DESCONTO NO PRODUTO",
  quantity_discount: "LEVE X, PAGUE Y",
  coupon: "CUPOM",
  free_shipping: "FRETE GRATIS",
};

export const promotionDiscountTypeLabel: Record<PromotionDiscountType, string> = {
  percentage: "PORCENTAGEM",
  fixed_amount: "VALOR EM REAIS",
  fixed_price: "PRECO FIXO",
};
