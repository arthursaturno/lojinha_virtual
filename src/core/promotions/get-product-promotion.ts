import type { StorePromotion } from "@/core/promotions/promotion";

export type ProductPromotionPresentation = {
  promotionalPrice?: number;
  label?: string;
};

export function getProductPromotion(
  productId: string,
  basePrice: number,
  promotions: StorePromotion[],
): ProductPromotionPresentation {
  const promotion = promotions.find((item) => item.productRule?.productId === productId);
  if (!promotion?.productRule) return {};

  if (promotion.kind === "quantity_discount") {
    return { label: `LEVE ${promotion.productRule.buyQuantity}, PAGUE ${promotion.productRule.payQuantity}` };
  }

  const { discountType, discountValue } = promotion.productRule;
  const promotionalPrice = discountType === "percentage"
    ? basePrice * (1 - discountValue / 100)
    : discountType === "fixed_amount"
      ? Math.max(0, basePrice - discountValue)
      : discountValue;

  return promotionalPrice < basePrice
    ? { promotionalPrice, label: "PROMOCAO" }
    : {};
}
