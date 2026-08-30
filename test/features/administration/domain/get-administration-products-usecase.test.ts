import { describe, expect, it, vi } from "vitest";

import { Result } from "@/core/result/result";
import type { AdministrationProductsRepository } from "@/features/administration/domain/repositories/administration-products-repository";
import { GetAdministrationProductsUseCase } from "@/features/administration/domain/usecases/get-administration-products-usecase";

describe("GetAdministrationProductsUseCase", () => {
  it("returns products from repository", async () => {
    const repository: AdministrationProductsRepository = {
      findAll: vi.fn().mockResolvedValue(
        Result.success([
          {
            id: "1",
            name: "Produto Admin",
            category: "Camisetas",
            colorLabel: "Preto",
            basePrice: 199.9,
            imageUrls: ["/assets/camiseta-core.png", "", ""],
            totalStockQuantity: 10,
            variants: [],
          },
        ]),
      ),
    };
    const useCase = new GetAdministrationProductsUseCase(repository);

    const result = await useCase.call();

    expect(result.ok).toBe(true);
    expect(repository.findAll).toHaveBeenCalledOnce();
  });
});
