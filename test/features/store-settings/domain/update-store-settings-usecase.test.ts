import { describe, expect, it, vi } from "vitest";

import { Result } from "@/core/result/result";
import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import type { StoreSettingsRepository } from "@/features/store-settings/domain/repositories/store-settings-repository";
import { UpdateStoreSettingsUseCase } from "@/features/store-settings/domain/usecases/update-store-settings-usecase";

const settings: StoreSettings = { storeName: "Ezzion Imports", whatsappPhone: "5581999999999" };

describe("UpdateStoreSettingsUseCase", () => {
  it("normalizes WhatsApp and updates valid settings", async () => {
    const repository: StoreSettingsRepository = { get: vi.fn(), update: vi.fn().mockResolvedValue(Result.success(settings)) };
    const result = await new UpdateStoreSettingsUseCase(repository).call({ ...settings, whatsappPhone: "+55 (81) 99999-9999" });

    expect(result).toEqual(Result.success(settings));
    expect(repository.update).toHaveBeenCalledWith(settings);
  });

  it("does not update invalid settings", async () => {
    const repository: StoreSettingsRepository = { get: vi.fn(), update: vi.fn() };
    const result = await new UpdateStoreSettingsUseCase(repository).call({ ...settings, whatsappPhone: "81999999999" });

    expect(result.ok).toBe(false);
    expect(repository.update).not.toHaveBeenCalled();
  });
});
