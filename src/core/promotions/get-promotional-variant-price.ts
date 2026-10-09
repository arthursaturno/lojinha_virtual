export type PromotionalVariantPriceInput = {
  productPrice: number;
  productOriginalPrice?: number;
  variantPrice?: number;
};

export type PromotionalVariantPrice = {
  originalPrice?: number;
  price: number;
};

export function getPromotionalVariantPrice({
  productPrice,
  productOriginalPrice,
  variantPrice,
}: PromotionalVariantPriceInput): PromotionalVariantPrice {
  const baseVariantPrice = variantPrice ?? productPrice;

  if (!productOriginalPrice || productOriginalPrice <= 0) {
    return { price: baseVariantPrice };
  }

  if (baseVariantPrice <= productPrice) {
    return {
      originalPrice: productOriginalPrice,
      price: baseVariantPrice,
    };
  }

  const promotionRatio = productPrice / productOriginalPrice;

  return {
    originalPrice: baseVariantPrice,
    price: baseVariantPrice * promotionRatio,
  };
}
