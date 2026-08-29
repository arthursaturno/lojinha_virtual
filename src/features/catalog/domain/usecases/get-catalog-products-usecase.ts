import type { Result } from "@/core/result/result";
import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import type { CatalogProductsRepository } from "@/features/catalog/domain/repositories/catalog-products-repository";

export class GetCatalogProductsUseCase {
  constructor(private readonly repository: CatalogProductsRepository) {}

  call(): Promise<Result<CatalogProduct[]>> {
    return this.repository.findAll();
  }
}
