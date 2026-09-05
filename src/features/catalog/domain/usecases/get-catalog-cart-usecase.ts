import type { CatalogCartRepository } from "@/features/catalog/domain/repositories/catalog-cart-repository";

export class GetCatalogCartUseCase {
  constructor(private readonly repository: CatalogCartRepository) {}

  call() {
    return this.repository.load();
  }
}
