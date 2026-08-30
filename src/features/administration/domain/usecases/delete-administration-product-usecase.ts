import { Result } from "@/core/result/result";
import type { AdministrationProductsRepository } from "@/features/administration/domain/repositories/administration-products-repository";

export class DeleteAdministrationProductUseCase {
  constructor(private readonly repository: AdministrationProductsRepository) {}

  call(productId: string): Promise<Result<void>> {
    if (!productId) {
      return Promise.resolve(Result.failure({ type: "validation", message: "Produto invalido para exclusao." }));
    }

    return this.repository.delete(productId);
  }
}
