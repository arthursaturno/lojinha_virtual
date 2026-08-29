import { describe, expect, it } from "vitest";

import { Result } from "@/core/result/result";
import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import { GetCatalogProductsUseCase } from "@/features/catalog/domain/usecases/get-catalog-products-usecase";

const products: CatalogProduct[] = [
  {
    id: "1",
    slug: "camiseta-core",
    name: "Camiseta Core",
    category: "Camisetas",
    color: "Preto",
    price: 199.9,
    images: ["/assets/camiseta-core.png"],
    stockQuantity: 10,
    variants: [],
  },
];

describe("GetCatalogProductsUseCase", () => {
  it("returns products from repository", async () => {
    const useCase = new GetCatalogProductsUseCase({
      findAll: async () => Result.success(products),
    });

    const result = await useCase.call();

    expect(result).toEqual(Result.success(products));
  });

  it("returns repository failure", async () => {
    const failure = {
      type: "unknown" as const,
      message: "Nao foi possivel carregar os produtos.",
    };
    const useCase = new GetCatalogProductsUseCase({
      findAll: async () => Result.failure(failure),
    });

    const result = await useCase.call();

    expect(result).toEqual(Result.failure(failure));
  });
});
