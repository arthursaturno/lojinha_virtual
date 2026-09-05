export type PromotionKind =
  | "popup"
  | "product_discount"
  | "quantity_discount"
  | "cart_benefit"
  // Mantido para leitura de campanhas antigas criadas antes dos beneficios selecionaveis.
  | "coupon"
  | "free_shipping";

export type PromotionDiscountType = "percentage" | "fixed_amount" | "fixed_price";
export type PromotionTargetType = "product" | "category" | "brand";

export type PromotionProductRule = {
  id?: string;
  targetType: PromotionTargetType;
  productId?: string;
  targetValue?: string;
  discountType: PromotionDiscountType;
  discountValue: number;
  buyQuantity?: number;
  payQuantity?: number;
};

export type PromotionBenefitRule = {
  id?: string;
  kind: Extract<PromotionKind, "cart_benefit" | "free_shipping">;
  title: string;
  description: string;
  minimumAmount: number;
  discountType: Exclude<PromotionDiscountType, "fixed_price">;
  discountValue: number;
};

export type StorePromotion = {
  id: string;
  internalName: string;
  kind: PromotionKind;
  imageUrl?: string;
  imageUrls?: string[];
  isActive: boolean;
  priority: number;
  startsAt?: string;
  endsAt?: string;
  productRule?: PromotionProductRule;
  productRules?: PromotionProductRule[];
  benefitRule?: PromotionBenefitRule;
  benefitRules?: PromotionBenefitRule[];
};

export type PromotionCartBenefit = {
  id: string;
  title: string;
  description: string;
  kind: Extract<PromotionKind, "cart_benefit" | "coupon" | "free_shipping">;
  minimumAmount: number;
};

export type PromotionCartValidation = {
  isValid: boolean;
  message: string;
  benefitTitle?: string;
  originalTotal: number;
  productDiscount: number;
  benefitDiscount: number;
  shippingAmount: number;
  shippingDiscount: number;
  finalTotal: number;
  hasFreeShipping: boolean;
};
