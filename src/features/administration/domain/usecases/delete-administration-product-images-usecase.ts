import { Result } from "@/core/result/result";
import type { AdministrationProductsRepository } from "@/features/administration/domain/repositories/administration-products-repository";

export class DeleteAdministrationProductImagesUseCase {
  constructor(private readonly repository: AdministrationProductsRepository) {}

  call(imageUrls: string[]): Promise<Result<void>> {
    if (imageUrls.length === 0) {
      return Promise.resolve(Result.success(undefined));
    }

    return this.repository.deleteImages(imageUrls);
  }
}
