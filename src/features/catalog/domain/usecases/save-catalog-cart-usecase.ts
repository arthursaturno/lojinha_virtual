import type { CatalogCartItem } from "@/features/catalog/domain/entities/catalog-cart-item";
import type { CatalogCartRepository } from "@/features/catalog/domain/repositories/catalog-cart-repository";

export class SaveCatalogCartUseCase {
  constructor(private readonly repository: CatalogCartRepository) {}

  call(items: CatalogCartItem[]) {
    return this.repository.save(items);
  }
}
