import type { Result } from "@/core/result/result";
import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import type { AdministrationProductsRepository } from "@/features/administration/domain/repositories/administration-products-repository";

export class GetAdministrationProductsUseCase {
  constructor(private readonly repository: AdministrationProductsRepository) {}

  call(): Promise<Result<AdministrationProduct[]>> {
    return this.repository.findAll();
  }
}
