import { describe, expect, it } from "vitest";

import { getProductPromotion } from "@/core/promotions/get-product-promotion";

describe("getProductPromotion", () => {
  it("finds a matching rule after the first rule in the same campaign", () => {
    const result = getProductPromotion("product-2", 100, [{
      id: "promotion-1",
      internalName: "Descontos nos produtos",
      kind: "product_discount",
      imageUrls: [],
      isActive: true,
      priority: 0,
      productRules: [
        { targetType: "product", productId: "product-1", discountType: "percentage", discountValue: 10 },
        { targetType: "product", productId: "product-2", discountType: "percentage", discountValue: 20 },
      ],
    }]);

    expect(result.promotionalPrice).toBe(80);
  });

  it("calculates the sale price for a percentage campaign", () => {
    const result = getProductPromotion("product-1", 100, [{
      id: "promotion-1",
      internalName: "Semana do cliente",
      kind: "product_discount",
      isActive: true,
      priority: 0,
      productRule: { targetType: "product", productId: "product-1", discountType: "percentage", discountValue: 20 },
    }]);

    expect(result).toEqual({ promotionalPrice: 80, label: "PROMOCAO" });
  });

  it("shows the quantity offer without changing the unit price", () => {
    const result = getProductPromotion("product-1", 100, [{
      id: "promotion-1",
      internalName: "Leve tres",
      kind: "quantity_discount",
      isActive: true,
      priority: 0,
      productRule: { targetType: "product", productId: "product-1", discountType: "fixed_amount", discountValue: 0, buyQuantity: 3, payQuantity: 2 },
    }]);

    expect(result).toEqual({ label: "LEVE 3, PAGUE 2" });
  });

  it("matches campaigns configured for a category or brand", () => {
    const result = getProductPromotion("product-2", 200, [{
      id: "promotion-2",
      internalName: "Polos selecionadas",
      kind: "product_discount",
      isActive: true,
      priority: 0,
      productRule: { targetType: "brand", targetValue: "Marca X", discountType: "percentage", discountValue: 15 },
    }], { category: "Polos", brand: "Marca X" });

    expect(result).toEqual({ promotionalPrice: 170, label: "PROMOCAO" });
  });
});
