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

describe("useCatalogViewModel", () => {
  it("filters products by query", () => {
    const { result } = renderHook(() => useCatalogViewModel(products));

    act(() => result.current.actions.updateCategory("Todos"));
    act(() => result.current.actions.updateQuery("bolsa"));

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bolsa Utility Cross");
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
});
