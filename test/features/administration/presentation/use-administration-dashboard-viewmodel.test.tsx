import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import { useAdministrationDashboardViewModel } from "@/features/administration/presentation/viewmodels/use-administration-dashboard-viewmodel";

const products: AdministrationProduct[] = [
  {
    id: "1",
    name: "Camiseta Core Oversized",
    category: "Camisetas",
    colorLabel: "Preto",
    basePrice: 219.9,
    imageUrls: ["/assets/camiseta-core.png", "/assets/hero-clothing.png", ""],
    totalStockQuantity: 10,
    variants: [
      {
        id: "1-a",
        size: "G",
        color: "Preto",
        model: "Oversized",
        price: 219.9,
        stockQuantity: 4,
        status: "in-stock",
      },
      {
        id: "1-b",
        size: "M",
        color: "Branco",
        model: "Street",
        price: 219.9,
        stockQuantity: 2,
        status: "low-stock",
      },
    ],
  },
  {
    id: "2",
    name: "Bolsa Utility Cross",
    category: "Acessorios",
    colorLabel: "Preto",
    basePrice: 189.9,
    imageUrls: ["/assets/bolsa-utility.png", "", ""],
    totalStockQuantity: 8,
    variants: [
      {
        id: "2-a",
        size: "UN",
        color: "Preto",
        model: "Utility",
        price: 189.9,
        stockQuantity: 8,
        status: "in-stock",
      },
    ],
  },
];

describe("useAdministrationDashboardViewModel", () => {
  it("filters products by query", () => {
    const { result } = renderHook(() => useAdministrationDashboardViewModel(products));

    act(() => result.current.actions.updateQuery("bolsa"));

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bolsa Utility Cross");
  });

  it("opens existing product drawer with draft hydrated from product", () => {
    const { result } = renderHook(() => useAdministrationDashboardViewModel(products));

    act(() => result.current.actions.openExistingProduct("2"));

    expect(result.current.selectedProduct?.id).toBe("2");
    expect(result.current.state.isProductDrawerOpen).toBe(true);
    expect(result.current.state.draft.name).toBe("Bolsa Utility Cross");
    expect(result.current.state.draft.sizes).toEqual(["UN"]);
    expect(result.current.state.draft.colors).toEqual(["Preto"]);
    expect(result.current.state.draft.models).toEqual(["Utility"]);
    expect(result.current.state.draft.imageCrops[0]).toEqual({ zoom: 1, offsetX: 0, offsetY: 0 });
  });

  it("marks save status after saving selections", () => {
    const { result } = renderHook(() => useAdministrationDashboardViewModel(products));

    act(() => result.current.actions.saveSelections());

    expect(result.current.state.saveStatus).toBe("saved");
  });

  it("opens empty drawer when creating a new product", () => {
    const { result } = renderHook(() => useAdministrationDashboardViewModel(products));

    act(() => result.current.actions.openNewProductDrawer());

    expect(result.current.state.editorMode).toBe("create");
    expect(result.current.state.isProductDrawerOpen).toBe(true);
    expect(result.current.state.draft.name).toBe("");
  });

  it("formats price while typing and toggles structured product options", () => {
    const { result } = renderHook(() => useAdministrationDashboardViewModel(products));

    act(() => {
      result.current.actions.openNewProductDrawer();
      result.current.actions.updateDraftPrice("10000");
      result.current.actions.incrementDraftStock();
      result.current.actions.incrementDraftStock();
      result.current.actions.toggleDraftListField("sizes", "M");
      result.current.actions.toggleDraftListField("colors", "Preto");
      result.current.actions.toggleDraftListField("models", "Oversized");
    });

    expect(result.current.state.draft.basePrice).toBe("100,00");
    expect(result.current.state.draft.totalStockQuantity).toBe(2);
    expect(result.current.state.draft.sizes).toEqual(["M"]);
    expect(result.current.state.draft.colors).toEqual(["Preto"]);
    expect(result.current.state.draft.models).toEqual(["Oversized"]);
  });

  it("resets crop on image change and updates crop controls", () => {
    const { result } = renderHook(() => useAdministrationDashboardViewModel(products));

    act(() => {
      result.current.actions.openNewProductDrawer();
      result.current.actions.updateDraftImage(0, "blob:test");
      result.current.actions.updateDraftImageCrop(0, { zoom: 1.8, offsetY: -12 });
    });

    expect(result.current.state.draft.imageUrls[0]).toBe("blob:test");
    expect(result.current.state.draft.imageCrops[0]).toEqual({ zoom: 1.8, offsetX: 0, offsetY: -12 });
  });
});
