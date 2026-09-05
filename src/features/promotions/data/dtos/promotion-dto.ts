import type {
  PromotionBenefitRule,
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
  promotion_images?: Array<{
    image_url: string;
    position: number;
  }>;
  is_active: boolean;
  priority: number;
  starts_at: string | null;
  ends_at: string | null;
  promotion_products?: Array<{
    id: string;
    target_type: "product" | "category" | "brand";
    product_id: string | null;
    target_value: string | null;
    discount_type: PromotionDiscountType;
    discount_value: number;
    buy_quantity: number | null;
    pay_quantity: number | null;
  }>;
  promotion_benefits?: Array<{
    id: string;
    kind?: Extract<PromotionKind, "cart_benefit" | "free_shipping">;
    title: string;
    description: string;
    minimum_amount: number;
    discount_type: Exclude<PromotionDiscountType, "fixed_price">;
    discount_value: number;
  }>;
};

export function promotionDtoToDomain(dto: PromotionDto): StorePromotion {
  const product = dto.promotion_products?.[0];
  const benefit = dto.promotion_benefits?.[0];
  const productRule: PromotionProductRule | undefined = product
    ? {
        id: product.id,
        targetType: product.target_type,
        productId: product.product_id ?? undefined,
        targetValue: product.target_value ?? undefined,
        discountType: product.discount_type,
        discountValue: Number(product.discount_value),
        buyQuantity: product.buy_quantity ?? undefined,
        payQuantity: product.pay_quantity ?? undefined,
      }
    : undefined;
  const productRules = (dto.promotion_products ?? []).map((rule) => ({
    id: rule.id,
    targetType: rule.target_type,
    productId: rule.product_id ?? undefined,
    targetValue: rule.target_value ?? undefined,
    discountType: rule.discount_type,
    discountValue: Number(rule.discount_value),
    buyQuantity: rule.buy_quantity ?? undefined,
    payQuantity: rule.pay_quantity ?? undefined,
  }));
  const benefitRule: PromotionBenefitRule | undefined = benefit
    ? {
        id: benefit.id,
        kind: benefit.kind ?? (dto.kind === "free_shipping" ? "free_shipping" : "cart_benefit"),
        title: benefit.title,
        description: benefit.description,
        minimumAmount: Number(benefit.minimum_amount),
        discountType: benefit.discount_type,
        discountValue: Number(benefit.discount_value),
      }
    : undefined;
  const benefitRules = (dto.promotion_benefits ?? []).map((item) => ({
    id: item.id,
    kind: item.kind ?? (dto.kind === "free_shipping" ? "free_shipping" : "cart_benefit"),
    title: item.title,
    description: item.description,
    minimumAmount: Number(item.minimum_amount),
    discountType: item.discount_type,
    discountValue: Number(item.discount_value),
  }));

  return {
    id: dto.id,
    internalName: dto.internal_name,
    kind: dto.kind,
    imageUrl: dto.image_url ?? undefined,
    imageUrls: [...(dto.promotion_images ?? [])]
      .sort((left, right) => left.position - right.position)
      .map((image) => image.image_url)
      .concat(dto.promotion_images?.length ? [] : dto.image_url ? [dto.image_url] : []),
    isActive: dto.is_active,
    priority: dto.priority,
    startsAt: dto.starts_at ?? undefined,
    endsAt: dto.ends_at ?? undefined,
    productRule,
    productRules,
    benefitRule,
    benefitRules,
  };
}
