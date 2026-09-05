import type { PromotionDiscountType, PromotionKind, PromotionTargetType, StorePromotion } from "@/core/promotions/promotion";

export type PromotionProductOption = { id: string; name: string; category: string; brand?: string };
export type PromotionSaveStatus = "idle" | "loading" | "failure";

export type PromotionDraft = StorePromotion & {
  storageCampaignId?: string;
};

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
  cart_benefit: "BENEFICIO DO CARRINHO",
  coupon: "BENEFICIO LEGADO",
  free_shipping: "FRETE GRATIS",
};

export const promotionTargetTypeLabel: Record<PromotionTargetType, string> = {
  product: "PRODUTO",
  category: "CATEGORIA",
  brand: "MARCA",
};

export const promotionDiscountTypeLabel: Record<PromotionDiscountType, string> = {
  percentage: "PORCENTAGEM",
  fixed_amount: "VALOR EM REAIS",
  fixed_price: "PRECO FIXO",
};
