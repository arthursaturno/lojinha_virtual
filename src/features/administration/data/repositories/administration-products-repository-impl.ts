import { Result } from "@/core/result/result";
import type { AdministrationProductsDataSource } from "@/features/administration/data/datasources/administration-products-supabase-datasource";
import { administrationProductToDomain } from "@/features/administration/data/dtos/administration-product-dto";
import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import type { AdministrationProductImageUpload } from "@/features/administration/domain/entities/administration-product-image-upload";
import type { AdministrationProductsRepository } from "@/features/administration/domain/repositories/administration-products-repository";

export class AdministrationProductsRepositoryImpl implements AdministrationProductsRepository {
  constructor(private readonly dataSource: AdministrationProductsDataSource) {}

  async findAll() {
    try {
      const products = await this.dataSource.findAll();

      return Result.success<AdministrationProduct[]>(products.map(administrationProductToDomain));
    } catch {
      return Result.failure<AdministrationProduct[]>({
        type: "unknown",
        message: "Nao foi possivel carregar o painel administrativo.",
      });
    }
  }

  async create(product: AdministrationProduct) {
    try { return Result.success(administrationProductToDomain(await this.dataSource.create(product))); }
    catch { return Result.failure<AdministrationProduct>({ type: "unknown", message: "Nao foi possivel criar o produto." }); }
  }

  async update(product: AdministrationProduct) {
    try { return Result.success(administrationProductToDomain(await this.dataSource.update(product))); }
    catch (error) {
      return Result.failure<AdministrationProduct>({
        type: "unknown",
        message: error instanceof Error ? `Nao foi possivel atualizar o produto: ${error.message}` : "Nao foi possivel atualizar o produto.",
      });
    }
  }

  async delete(productId: string) {
    try { await this.dataSource.delete(productId); return Result.success(undefined); }
    catch { return Result.failure<void>({ type: "unknown", message: "Nao foi possivel excluir o produto." }); }
  }

  async deleteImages(imageUrls: string[]) {
    try {
      await this.dataSource.deleteImages(imageUrls);
      return Result.success(undefined);
    } catch {
      return Result.failure<void>({ type: "unknown", message: "Produto salvo, mas nao foi possivel apagar a foto antiga." });
    }
  }

  async uploadImage(upload: AdministrationProductImageUpload) {
    try {
      return Result.success(await this.dataSource.uploadImage(upload));
    } catch {
      return Result.failure({ type: "unknown", message: "Nao foi possivel enviar a foto do produto." });
    }
  }
}
