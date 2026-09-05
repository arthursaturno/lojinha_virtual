import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Result } from "@/core/result/result";
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

  it("prioritizes regular shirts and shorts while leaving team shirts at the end", () => {
    const catalog = [
      { ...products[1], id: "watch", name: "Relogio classico", category: "Acessorios" },
      { ...products[0], id: "team", name: "Camisa de time PSG", category: "Camisas" },
      { ...products[0], id: "shirt", name: "Camisa social", category: "Camisas" },
      { ...products[0], id: "shorts", name: "Shorts de linho", category: "Shorts" },
    ];
    const { result } = renderHook(() => useCatalogViewModel(catalog));

    expect(result.current.filteredProducts.map((product) => product.id)).toEqual(["shirt", "shorts", "watch", "team"]);
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

  it("keeps the selected quantity when changing product details", () => {
    const { result } = renderHook(() => useCatalogViewModel(products));

    act(() => result.current.actions.openProduct(products[0]));
    act(() => result.current.actions.updateSelection({ size: "G" }));
    act(() => result.current.actions.updateSelection({ color: "Preto" }));
    act(() => result.current.actions.updateSelection({ model: "Oversized" }));
    act(() => result.current.actions.updateQuantity(5));
    act(() => result.current.actions.updateSelection({ size: "M" }));

    expect(result.current.state.selection.quantity).toBe(5);
  });

  it("keeps colors and sizes selectable when stock is managed for the whole product", () => {
    const productWithDistributedStock: CatalogProduct = {
      ...products[0],
      stockQuantity: 5,
      variants: [
        { ...products[0].variants[0], color: "Azul", stockQuantity: 0 },
        { ...products[0].variants[1], color: "Preto", stockQuantity: 5 },
      ],
    };
    const { result } = renderHook(() => useCatalogViewModel([productWithDistributedStock]));

    act(() => result.current.actions.openProduct(productWithDistributedStock));
    act(() => result.current.actions.updateSelection({ size: "G", color: "Azul", model: "Oversized" }));

    expect(result.current.isSelectionReady).toBe(true);
    act(() => result.current.actions.updateQuantity(5));
    expect(result.current.state.selection.quantity).toBe(5);
  });

  it("adds the selected variation to the persisted cart", async () => {
    const save = vi.fn(() => Promise.resolve(Result.success(undefined)));
    const { result } = renderHook(() => useCatalogViewModel(products, undefined, {
      get: { call: () => Promise.resolve(Result.success([])) },
      save: { call: save },
    }));

    act(() => result.current.actions.openProduct(products[0]));
    act(() => result.current.actions.updateSelection({ size: "G", color: "Preto", model: "Oversized" }));
    act(() => result.current.actions.updateQuantity(2));
    act(() => result.current.actions.addCurrentProductToCart());

    expect(result.current.state.cartItems).toMatchObject([{ variantId: "1-g-preto-oversized", quantity: 2 }]);
    expect(save).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ quantity: 2 })]));
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
