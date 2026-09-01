import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import { useCatalogViewModel } from "@/features/catalog/presentation/viewmodels/use-catalog-viewmodel";

const products: CatalogProduct[] = [
  {
    id: "1",
    slug: "camiseta-core",
    name: "Camiseta Core Oversized",
    category: "Camisetas",
    color: "Preto",
    price: 219.9,
    images: ["/assets/camiseta-core.png"],
    stockQuantity: 10,
    variants: [
      {
        id: "1-g-preto-oversized",
        size: "G",
        color: "Preto",
        model: "Oversized",
        price: 219.9,
        stockQuantity: 5,
        isActive: true,
      },
      {
        id: "1-m-preto-oversized",
        size: "M",
        color: "Preto",
        model: "Oversized",
        price: 219.9,
        stockQuantity: 2,
        isActive: true,
      },
    ],
  },
  {
    id: "2",
    slug: "bolsa-utility",
    name: "Bolsa Utility Cross",
    category: "Acessorios",
    color: "Preto",
    price: 189.9,
    images: ["/assets/bolsa-utility.png"],
    stockQuantity: 4,
    variants: [],
  },
];

function makeProduct(index: number): CatalogProduct {
  return {
    id: `${index}`,
    slug: `produto-${index}`,
    name: `Produto ${index}`,
    category: "Camisetas",
    color: "Preto",
    price: 199.9 + index,
    images: [`/assets/produto-${index}.png`],
    stockQuantity: 10,
    variants: [],
  };
}

describe("useCatalogViewModel", () => {
  it("filters products by query", () => {
    const { result } = renderHook(() => useCatalogViewModel(products));

    act(() => result.current.actions.updateQuery("bolsa"));

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bolsa Utility Cross");
  });

  it("uses real product categories and starts with all products selected", () => {
    const { result } = renderHook(() => useCatalogViewModel(products));

    expect(result.current.state.category).toBe("Todos");
    expect(result.current.categories).toEqual(["Camisetas", "Acessorios", "Todos"]);
    expect(result.current.filteredProducts).toHaveLength(2);
  });

  it("enables checkout contact only after required variation selection", () => {
    const { result } = renderHook(() => useCatalogViewModel(products));

    act(() => result.current.actions.openProduct(products[0]));

    expect(result.current.isSelectionReady).toBe(false);

    act(() => result.current.actions.updateSelection({ size: "G" }));
    act(() => result.current.actions.updateSelection({ color: "Preto" }));
    act(() => result.current.actions.updateSelection({ model: "Oversized" }));

    expect(result.current.isSelectionReady).toBe(true);
  });

  it("updates quantity and calculates order total", () => {
    const { result } = renderHook(() => useCatalogViewModel(products));

    act(() => result.current.actions.openProduct(products[0]));
    act(() => result.current.actions.updateSelection({ size: "G" }));
    act(() => result.current.actions.updateSelection({ color: "Preto" }));
    act(() => result.current.actions.updateSelection({ model: "Oversized" }));
    act(() => result.current.actions.updateQuantity(3));

    expect(result.current.state.selection.quantity).toBe(3);
    expect(result.current.orderTotal).toBeCloseTo(659.7);
  });

  it("limits quantity to selected variant stock", () => {
    const { result } = renderHook(() => useCatalogViewModel(products));

    act(() => result.current.actions.openProduct(products[0]));
    act(() => result.current.actions.updateSelection({ size: "G" }));
    act(() => result.current.actions.updateSelection({ color: "Preto" }));
    act(() => result.current.actions.updateSelection({ model: "Oversized" }));
    act(() => result.current.actions.updateQuantity(5));
    act(() => result.current.actions.updateSelection({ size: "M" }));

    expect(result.current.state.selection.quantity).toBe(2);
  });

  it("paginates catalog products with ten items per page", () => {
    const manyProducts = Array.from({ length: 12 }, (_, index) => makeProduct(index + 1));
    const { result } = renderHook(() => useCatalogViewModel(manyProducts));

    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedProducts).toHaveLength(10);

    act(() => result.current.actions.updateCurrentPage(2));

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedProducts).toHaveLength(2);
    expect(result.current.paginatedProducts[0].name).toBe("Produto 11");
  });
});
