import type { Result } from "@/core/result/result";
import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import type { AdministrationProductImageUpload, AdministrationProductImageUrls } from "@/features/administration/domain/entities/administration-product-image-upload";

export interface AdministrationProductsRepository {
  findAll(): Promise<Result<AdministrationProduct[]>>;
  create(product: AdministrationProduct): Promise<Result<AdministrationProduct>>;
  update(product: AdministrationProduct): Promise<Result<AdministrationProduct>>;
  delete(productId: string): Promise<Result<void>>;
  deleteImages(imageUrls: string[]): Promise<Result<void>>;
  uploadImage(upload: AdministrationProductImageUpload): Promise<Result<AdministrationProductImageUrls>>;
}
