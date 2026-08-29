import type { Result } from "@/core/result/result";
import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";

export type CatalogProductsRepository = {
  findAll(): Promise<Result<CatalogProduct[]>>;
};
