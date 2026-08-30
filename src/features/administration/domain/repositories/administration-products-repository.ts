import type { Result } from "@/core/result/result";
import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";

export interface AdministrationProductsRepository {
  findAll(): Promise<Result<AdministrationProduct[]>>;
}
