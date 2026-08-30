import { describe, expect, it, vi } from "vitest";

import { Result } from "@/core/result/result";
import type { AdministrationProductsRepository } from "@/features/administration/domain/repositories/administration-products-repository";
import { DeleteAdministrationProductImagesUseCase } from "@/features/administration/domain/usecases/delete-administration-product-images-usecase";

function createRepository(): AdministrationProductsRepository {
  return {
    findAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteImages: vi.fn().mockResolvedValue(Result.success(undefined)),
    uploadImage: vi.fn(),
  };
}

describe("DeleteAdministrationProductImagesUseCase", () => {
  it("deletes stored images after a product change", async () => {
    const repository = createRepository();
    const useCase = new DeleteAdministrationProductImagesUseCase(repository);

    const result = await useCase.call(["https://example.supabase.co/storage/v1/object/public/product-images/photo.webp"]);

    expect(result.ok).toBe(true);
    expect(repository.deleteImages).toHaveBeenCalledOnce();
  });

  it("does not call repository when there are no images to delete", async () => {
    const repository = createRepository();
    const useCase = new DeleteAdministrationProductImagesUseCase(repository);

    const result = await useCase.call([]);

    expect(result.ok).toBe(true);
    expect(repository.deleteImages).not.toHaveBeenCalled();
  });
});
