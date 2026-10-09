import { describe, expect, it } from "vitest";

import { getPromotionalVariantPrice } from "@/core/promotions/get-promotional-variant-price";

describe("getPromotionalVariantPrice", () => {
  it("keeps the variant price when it already has the product discount applied", () => {
    expect(getPromotionalVariantPrice({
      productOriginalPrice: 49.9,
      productPrice: 39.92,
      variantPrice: 39.92,
    })).toEqual({
      originalPrice: 49.9,
      price: 39.92,
    });
  });

  it("applies the product discount ratio once to a full-price variant", () => {
    expect(getPromotionalVariantPrice({
      productOriginalPrice: 49.9,
      productPrice: 39.92,
      variantPrice: 49.9,
    })).toEqual({
      originalPrice: 49.9,
      price: 39.92,
    });
  });
});
