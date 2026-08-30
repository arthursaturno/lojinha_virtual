import { AdministrationProductsMockDataSource } from "@/features/administration/data/datasources/administration-products-mock-datasource";
import { AdministrationProductsRepositoryImpl } from "@/features/administration/data/repositories/administration-products-repository-impl";
import { GetAdministrationProductsUseCase } from "@/features/administration/domain/usecases/get-administration-products-usecase";

export function createAdministrationProductsUseCase() {
  const dataSource = new AdministrationProductsMockDataSource();
  const repository = new AdministrationProductsRepositoryImpl(dataSource);

  return new GetAdministrationProductsUseCase(repository);
}
