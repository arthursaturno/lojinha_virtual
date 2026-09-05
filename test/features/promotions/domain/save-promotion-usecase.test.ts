import { describe, expect, it, vi } from "vitest";

import { Result } from "@/core/result/result";
import type { StorePromotion } from "@/core/promotions/promotion";
import { SavePromotionUseCase } from "@/features/promotions/domain/usecases/save-promotion-usecase";

const popupWithoutImages: StorePromotion = {
  id: "promotion-1",
  internalName: "Campanha de inverno",
  kind: "popup",
  imageUrls: [],
  isActive: true,
  priority: 0,
};

describe("SavePromotionUseCase", () => {
  it("rejects an active popup without images", async () => {
    const repository = { save: vi.fn() };
    const useCase = new SavePromotionUseCase(repository as never);

    const result = await useCase.call(popupWithoutImages);

    expect(result.ok).toBe(false);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("saves a paused popup without images", async () => {
    const repository = { save: vi.fn().mockResolvedValue(Result.success({ ...popupWithoutImages, isActive: false })) };
    const useCase = new SavePromotionUseCase(repository as never);

    const result = await useCase.call({ ...popupWithoutImages, isActive: false });

    expect(result.ok).toBe(true);
    expect(repository.save).toHaveBeenCalledOnce();
  });
});
