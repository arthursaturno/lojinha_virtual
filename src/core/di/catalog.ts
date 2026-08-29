import { CatalogProductsMockDataSource } from "@/features/catalog/data/datasources/catalog-products-mock-datasource";
import { CatalogProductsRepositoryImpl } from "@/features/catalog/data/repositories/catalog-products-repository-impl";
import { GetCatalogProductsUseCase } from "@/features/catalog/domain/usecases/get-catalog-products-usecase";

export function createCatalogProductsUseCase() {
  const dataSource = new CatalogProductsMockDataSource();
  const repository = new CatalogProductsRepositoryImpl(dataSource);

  return new GetCatalogProductsUseCase(repository);
}
