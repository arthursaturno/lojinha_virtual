import type {
  PromotionCouponRule,
  PromotionDiscountType,
  PromotionKind,
  PromotionProductRule,
  StorePromotion,
} from "@/core/promotions/promotion";

export type PromotionDto = {
  id: string;
  internal_name: string;
  kind: PromotionKind;
  image_url: string | null;
  is_active: boolean;
  priority: number;
  starts_at: string | null;
  ends_at: string | null;
  promotion_products?: Array<{
    id: string;
    product_id: string;
    discount_type: PromotionDiscountType;
    discount_value: number;
    buy_quantity: number | null;
    pay_quantity: number | null;
  }>;
  promotion_coupons?: Array<{
    id: string;
    code: string;
    minimum_amount: number;
    discount_type: Exclude<PromotionDiscountType, "fixed_price">;
    discount_value: number;
  }>;
};

export function promotionDtoToDomain(dto: PromotionDto): StorePromotion {
  const product = dto.promotion_products?.[0];
  const coupon = dto.promotion_coupons?.[0];
  const productRule: PromotionProductRule | undefined = product
    ? {
        id: product.id,
        productId: product.product_id,
        discountType: product.discount_type,
        discountValue: Number(product.discount_value),
        buyQuantity: product.buy_quantity ?? undefined,
        payQuantity: product.pay_quantity ?? undefined,
      }
    : undefined;
  const couponRule: PromotionCouponRule | undefined = coupon
    ? {
        id: coupon.id,
        code: coupon.code,
        minimumAmount: Number(coupon.minimum_amount),
        discountType: coupon.discount_type,
        discountValue: Number(coupon.discount_value),
      }
    : undefined;

  return {
    id: dto.id,
    internalName: dto.internal_name,
    kind: dto.kind,
    imageUrl: dto.image_url ?? undefined,
    isActive: dto.is_active,
    priority: dto.priority,
    startsAt: dto.starts_at ?? undefined,
    endsAt: dto.ends_at ?? undefined,
    productRule,
    couponRule,
  };
}
