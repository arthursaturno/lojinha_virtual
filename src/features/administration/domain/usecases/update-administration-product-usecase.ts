import { Result } from "@/core/result/result";
import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import type { AdministrationProductsRepository } from "@/features/administration/domain/repositories/administration-products-repository";

export class UpdateAdministrationProductUseCase {
  constructor(private readonly repository: AdministrationProductsRepository) {}

  call(product: AdministrationProduct): Promise<Result<AdministrationProduct>> {
    if (!product.id || !product.name.trim() || !product.category.trim()) {
      return Promise.resolve(Result.failure({ type: "validation", message: "Produto invalido para atualizacao." }));
    }

    return this.repository.update(product);
  }
}
