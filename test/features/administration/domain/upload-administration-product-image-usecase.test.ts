import { describe, expect, it, vi } from "vitest";

import { Result } from "@/core/result/result";
import type { AdministrationProductsRepository } from "@/features/administration/domain/repositories/administration-products-repository";
import { UploadAdministrationProductImageUseCase } from "@/features/administration/domain/usecases/upload-administration-product-image-usecase";

const upload = {
  detail: { bytes: new ArrayBuffer(2), fileName: "product.webp", contentType: "image/webp" as const },
};

describe("UploadAdministrationProductImageUseCase", () => {
  it("uploads an optimized product image", async () => {
    const repository: AdministrationProductsRepository = {
      findAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), deleteImages: vi.fn(),
      uploadImage: vi.fn().mockResolvedValue(Result.success({ detailUrl: "detail", thumbnailUrl: "thumbnail" })),
    };
    const useCase = new UploadAdministrationProductImageUseCase(repository);

    const result = await useCase.call(upload);

    expect(result).toEqual(Result.success({ detailUrl: "detail", thumbnailUrl: "thumbnail" }));
    expect(repository.uploadImage).toHaveBeenCalledWith(upload);
  });

  it("rejects an empty image without calling repository", async () => {
    const repository: AdministrationProductsRepository = {
      findAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), deleteImages: vi.fn(), uploadImage: vi.fn(),
    };
    const useCase = new UploadAdministrationProductImageUseCase(repository);

    const result = await useCase.call({ ...upload, detail: { ...upload.detail, bytes: new ArrayBuffer(0) } });

    expect(result.ok).toBe(false);
    expect(repository.uploadImage).not.toHaveBeenCalled();
  });
});
