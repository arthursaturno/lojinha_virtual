import type { Result } from "@/core/result/result";
import type { CatalogCartItem } from "@/features/catalog/domain/entities/catalog-cart-item";

export interface CatalogCartRepository {
  load(): Promise<Result<CatalogCartItem[]>>;
  save(items: CatalogCartItem[]): Promise<Result<void>>;
}
