export type PromotionKind =
  | "popup"
  | "product_discount"
  | "quantity_discount"
  | "coupon"
  | "free_shipping";

export type PromotionDiscountType = "percentage" | "fixed_amount" | "fixed_price";

export type PromotionProductRule = {
  id?: string;
  productId: string;
  discountType: PromotionDiscountType;
  discountValue: number;
  buyQuantity?: number;
  payQuantity?: number;
};

export type PromotionCouponRule = {
  id?: string;
  code: string;
  minimumAmount: number;
  discountType: Exclude<PromotionDiscountType, "fixed_price">;
  discountValue: number;
};

export type StorePromotion = {
  id: string;
  internalName: string;
  kind: PromotionKind;
  imageUrl?: string;
  isActive: boolean;
  priority: number;
  startsAt?: string;
  endsAt?: string;
  productRule?: PromotionProductRule;
  couponRule?: PromotionCouponRule;
};

export type PromotionCouponValidation = {
  isValid: boolean;
  message: string;
  couponCode?: string;
  originalTotal: number;
  productDiscount: number;
  couponDiscount: number;
  finalTotal: number;
  hasFreeShipping: boolean;
};
