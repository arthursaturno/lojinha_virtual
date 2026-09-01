import { describe, expect, it } from "vitest";

import { getProductPromotion } from "@/core/promotions/get-product-promotion";

describe("getProductPromotion", () => {
  it("calculates the sale price for a percentage campaign", () => {
    const result = getProductPromotion("product-1", 100, [{
      id: "promotion-1",
      internalName: "Semana do cliente",
      kind: "product_discount",
      isActive: true,
      priority: 0,
      productRule: { productId: "product-1", discountType: "percentage", discountValue: 20 },
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
      productRule: { productId: "product-1", discountType: "fixed_amount", discountValue: 0, buyQuantity: 3, payQuantity: 2 },
    }]);

    expect(result).toEqual({ label: "LEVE 3, PAGUE 2" });
  });
});
