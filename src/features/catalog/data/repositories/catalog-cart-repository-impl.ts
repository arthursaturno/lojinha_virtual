import { Result } from "@/core/result/result";
import type { CatalogCartLocalStorageDataSource } from "@/features/catalog/data/datasources/catalog-cart-local-storage-datasource";
import type { CatalogCartRepository } from "@/features/catalog/domain/repositories/catalog-cart-repository";

export class CatalogCartRepositoryImpl implements CatalogCartRepository {
  constructor(private readonly dataSource: CatalogCartLocalStorageDataSource) {}

  async load() {
    try { return Result.success(this.dataSource.get()); }
    catch { return Result.failure({ type: "unknown", message: "Nao foi possivel recuperar o carrinho." }); }
  }

  async save(items: Parameters<CatalogCartRepository["save"]>[0]) {
    try { this.dataSource.set(items); return Result.success(undefined); }
    catch { return Result.failure({ type: "unknown", message: "Nao foi possivel salvar o carrinho neste aparelho." }); }
  }
}
