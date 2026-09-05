import type { StorePromotion } from "@/core/promotions/promotion";

export type ProductPromotionPresentation = {
  promotionalPrice?: number;
  label?: string;
};

export function getProductPromotion(
  productId: string,
  basePrice: number,
  promotions: StorePromotion[],
  product?: { category: string; brand?: string },
): ProductPromotionPresentation {
  const matchingPromotion = promotions.flatMap((promotion) =>
    (promotion.productRules ?? (promotion.productRule ? [promotion.productRule] : [])).map((rule) => ({ promotion, rule })),
  ).find(({ rule }) => (
    (rule.targetType === "product" && rule.productId === productId)
    || (rule.targetType === "category" && rule.targetValue === product?.category)
    || (rule.targetType === "brand" && rule.targetValue === product?.brand)
  ));
  if (!matchingPromotion) return {};

  if (matchingPromotion.promotion.kind === "quantity_discount") {
    return { label: `LEVE ${matchingPromotion.rule.buyQuantity}, PAGUE ${matchingPromotion.rule.payQuantity}` };
  }

  const { discountType, discountValue } = matchingPromotion.rule;
  const promotionalPrice = discountType === "percentage"
    ? basePrice * (1 - discountValue / 100)
    : discountType === "fixed_amount"
      ? Math.max(0, basePrice - discountValue)
      : discountValue;

  return promotionalPrice < basePrice
    ? { promotionalPrice, label: "PROMOCAO" }
    : {};
}
