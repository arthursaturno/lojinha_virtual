import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import { useAdministrationDashboardViewModel } from "@/features/administration/presentation/viewmodels/use-administration-dashboard-viewmodel";

const products: AdministrationProduct[] = [
  {
    id: "1",
    name: "Camiseta Core Oversized",
    description: "Produto de teste 1",
    category: "Camisetas",
    colorLabel: "Preto",
    basePrice: 219.9,
    imageUrls: ["/assets/camiseta-core.png", "/assets/hero-clothing.png", ""],
    isActive: true,
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
    description: "Produto de teste 2",
    category: "Acessorios",
    colorLabel: "Preto",
    basePrice: 189.9,
    imageUrls: ["/assets/bolsa-utility.png", "", ""],
    isActive: false,
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
  it("paginates products in groups of ten and changes page", () => {
    const manyProducts = Array.from({ length: 11 }, (_, index) => ({
      ...products[index % products.length],
      id: `page-${index + 1}`,
      name: `Produto ${index + 1}`,
    }));
    const { result } = renderHook(() => useAdministrationDashboardViewModel(manyProducts));

    expect(result.current.paginatedProducts).toHaveLength(10);
    expect(result.current.totalPages).toBe(2);

    act(() => result.current.actions.setCurrentPage(2));

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedProducts).toHaveLength(1);
  });

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
    expect(result.current.state.draft.description).toBe("Produto de teste 2");
    expect(result.current.state.draft.sizes).toEqual(["UN"]);
    expect(result.current.state.draft.colors).toEqual(["Preto"]);
    expect(result.current.state.draft.models).toEqual(["Utility"]);
    expect(result.current.state.draft.imageCrops[0]).toEqual({ zoom: 1, offsetX: 0, offsetY: 0 });
  });

  it("marks save status after updating an existing product", () => {
    const { result } = renderHook(() => useAdministrationDashboardViewModel(products));

    act(() => {
      result.current.actions.openExistingProduct("1");
      result.current.actions.saveSelections();
    });

    expect(result.current.state.saveStatus).toBe("saved");
    expect(result.current.state.feedbackMessage).toBe("Produto atualizado no MVP local.");
  });

  it("opens empty drawer when creating a new product", () => {
    const { result } = renderHook(() => useAdministrationDashboardViewModel(products));

    act(() => result.current.actions.openNewProductDrawer());

    expect(result.current.state.editorMode).toBe("create");
    expect(result.current.state.isProductDrawerOpen).toBe(true);
    expect(result.current.state.draft.name).toBe("");
    expect(result.current.state.draft.isActive).toBe(true);
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
      result.current.actions.toggleDraftActive();
    });

    expect(result.current.state.draft.basePrice).toBe("100,00");
    expect(result.current.state.draft.totalStockQuantity).toBe(2);
    expect(result.current.state.draft.sizes).toEqual(["M"]);
    expect(result.current.state.draft.colors).toEqual(["Preto"]);
    expect(result.current.state.draft.models).toEqual(["Oversized"]);
    expect(result.current.state.draft.isActive).toBe(false);
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

  it("queues a stored image for deletion when removed from the draft", () => {
    const remoteProducts = [{
      ...products[0],
      imageUrls: ["https://example.supabase.co/storage/v1/object/public/product-images/photo.webp"],
    }];
    const { result } = renderHook(() => useAdministrationDashboardViewModel(remoteProducts));

    act(() => {
      result.current.actions.openExistingProduct("1");
      result.current.actions.updateDraftImage(0, "");
    });

    expect(result.current.state.pendingImageDeletionUrls).toEqual([
      "https://example.supabase.co/storage/v1/object/public/product-images/photo.webp",
    ]);
  });

  it("creates a product in local state from the drawer draft", () => {
    const { result } = renderHook(() => useAdministrationDashboardViewModel(products));

    act(() => {
      result.current.actions.openNewProductDrawer();
      result.current.actions.updateDraftField("name", "Camisa Linho");
      result.current.actions.updateDraftField("description", "Descricao nova");
      result.current.actions.updateDraftField("category", "Camisas");
      result.current.actions.updateDraftPrice("25990");
      result.current.actions.incrementDraftStock();
      result.current.actions.incrementDraftStock();
      result.current.actions.toggleDraftListField("sizes", "M");
      result.current.actions.toggleDraftListField("colors", "Branco");
      result.current.actions.toggleDraftListField("models", "Linho");
      result.current.actions.saveSelections();
    });

    expect(result.current.state.products[0].name).toBe("Camisa Linho");
    expect(result.current.state.products[0].description).toBe("Descricao nova");
    expect(result.current.state.products[0].category).toBe("Camisas");
    expect(result.current.state.feedbackMessage).toBe("Produto criado no MVP local.");
  });

  it("distributes the exact selected stock quantity between variants", () => {
    const { result } = renderHook(() => useAdministrationDashboardViewModel(products));

    act(() => {
      result.current.actions.openNewProductDrawer();
      result.current.actions.updateDraftField("name", "Camisa com variacoes");
      result.current.actions.updateDraftField("category", "Camisas");
      result.current.actions.toggleDraftListField("sizes", "P");
      result.current.actions.toggleDraftListField("sizes", "M");
      result.current.actions.toggleDraftListField("colors", "Preto");
      result.current.actions.toggleDraftListField("models", "Regular");
      result.current.actions.incrementDraftStock();
      result.current.actions.incrementDraftStock();
      result.current.actions.incrementDraftStock();
      result.current.actions.saveSelections();
    });

    expect(result.current.state.products[0].variants.map((variant) => variant.stockQuantity)).toEqual([2, 1]);
    expect(result.current.state.products[0].totalStockQuantity).toBe(3);
  });

  it("deletes the selected product from local state", () => {
    const { result } = renderHook(() => useAdministrationDashboardViewModel(products));

    act(() => {
      result.current.actions.openExistingProduct("2");
      result.current.actions.deleteSelectedProduct();
    });

    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.isProductDrawerOpen).toBe(false);
    expect(result.current.state.feedbackMessage).toBe("Produto removido do MVP local.");
  });
});
