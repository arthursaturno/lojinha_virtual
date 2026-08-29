import { Result } from "@/core/result/result";
import type { CatalogProductsDataSource } from "@/features/catalog/data/datasources/catalog-products-mock-datasource";
import { catalogProductToDomain } from "@/features/catalog/data/dtos/catalog-product-dto";
import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import type { CatalogProductsRepository } from "@/features/catalog/domain/repositories/catalog-products-repository";

export class CatalogProductsRepositoryImpl implements CatalogProductsRepository {
  constructor(private readonly dataSource: CatalogProductsDataSource) {}

  async findAll() {
    try {
      const products = await this.dataSource.findAll();

      return Result.success<CatalogProduct[]>(products.map(catalogProductToDomain));
    } catch {
      return Result.failure<CatalogProduct[]>({
        type: "unknown",
        message: "Nao foi possivel carregar os produtos.",
      });
    }
  }
}
