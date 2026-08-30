import { Result } from "@/core/result/result";
import type { AdministrationProductsDataSource } from "@/features/administration/data/datasources/administration-products-mock-datasource";
import { administrationProductToDomain } from "@/features/administration/data/dtos/administration-product-dto";
import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import type { AdministrationProductsRepository } from "@/features/administration/domain/repositories/administration-products-repository";

export class AdministrationProductsRepositoryImpl implements AdministrationProductsRepository {
  constructor(private readonly dataSource: AdministrationProductsDataSource) {}

  async findAll() {
    try {
      const products = await this.dataSource.findAll();

      return Result.success<AdministrationProduct[]>(products.map(administrationProductToDomain));
    } catch {
      return Result.failure<AdministrationProduct[]>({
        type: "unknown",
        message: "Nao foi possivel carregar o painel administrativo.",
      });
    }
  }
}
