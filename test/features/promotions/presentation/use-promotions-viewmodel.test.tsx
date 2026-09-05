import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { StorePromotion } from "@/core/promotions/promotion";
import { usePromotionsViewModel } from "@/features/promotions/presentation/viewmodels/use-promotions-viewmodel";

const promotions: StorePromotion[] = [{
  id: "promotion-1",
  internalName: "Descontos nos produtos",
  kind: "product_discount",
  imageUrls: [],
  isActive: true,
  priority: 0,
  productRules: [{ targetType: "product", productId: "product-1", discountType: "percentage", discountValue: 10 }],
}];

const actions = {
  save: { call: vi.fn() },
  delete: { call: vi.fn() },
  uploadImage: { call: vi.fn() },
};

describe("usePromotionsViewModel", () => {
  it("opens the existing campaign instead of creating another campaign of the same kind", () => {
    const { result } = renderHook(() => usePromotionsViewModel(promotions, actions));

    act(() => result.current.actions.openCampaign("product_discount"));

    expect(result.current.state.draft?.id).toBe("promotion-1");
    expect(result.current.state.draft?.productRules).toHaveLength(1);
  });

  it("keeps every product rule in the campaign draft", () => {
    const { result } = renderHook(() => usePromotionsViewModel(promotions, actions));

    act(() => result.current.actions.openCampaign("product_discount"));
    act(() => result.current.actions.updateProductRules([
      { targetType: "product", productId: "product-1", discountType: "percentage", discountValue: 10 },
      { targetType: "category", targetValue: "Camisas", discountType: "fixed_amount", discountValue: 20 },
    ]));

    expect(result.current.state.draft?.productRules).toHaveLength(2);
  });

  it("opens an existing free shipping campaign from the cart benefits entry point", () => {
    const { result } = renderHook(() => usePromotionsViewModel([{
      id: "promotion-shipping",
      internalName: "Frete gratis",
      kind: "free_shipping",
      imageUrls: [],
      isActive: true,
      priority: 0,
      benefitRule: { kind: "free_shipping", title: "Frete gratis", description: "Acima de R$ 150", minimumAmount: 150, discountType: "fixed_amount", discountValue: 0 },
    }], actions));

    act(() => result.current.actions.openCartBenefitsCampaign());

    expect(result.current.state.draft?.id).toBe("promotion-shipping");
  });

  it("creates an editable benefit rule for legacy free shipping campaigns", () => {
    const { result } = renderHook(() => usePromotionsViewModel([{
      id: "promotion-legacy-shipping",
      internalName: "Frete gratis",
      kind: "free_shipping",
      imageUrls: [],
      isActive: true,
      priority: 0,
    }], actions));

    act(() => result.current.actions.openCartBenefitsCampaign());

    expect(result.current.state.draft?.benefitRule?.title).toBe("Frete gratis");
  });
});
