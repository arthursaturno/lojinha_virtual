import { Result } from "@/core/result/result";
import type {
  AdministrationProductImageUpload,
  AdministrationProductImageUrls,
} from "@/features/administration/domain/entities/administration-product-image-upload";
import type { AdministrationProductsRepository } from "@/features/administration/domain/repositories/administration-products-repository";

export class UploadAdministrationProductImageUseCase {
  constructor(private readonly repository: AdministrationProductsRepository) {}

  call(upload: AdministrationProductImageUpload): Promise<Result<AdministrationProductImageUrls>> {
    if (upload.detail.bytes.byteLength === 0) {
      return Promise.resolve(Result.failure({ type: "validation", message: "Selecione uma foto valida." }));
    }

    return this.repository.uploadImage(upload);
  }
}
