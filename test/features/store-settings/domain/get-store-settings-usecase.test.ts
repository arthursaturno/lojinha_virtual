import { describe, expect, it, vi } from "vitest";

import { Result } from "@/core/result/result";
import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import type { StoreSettingsRepository } from "@/features/store-settings/domain/repositories/store-settings-repository";
import { GetStoreSettingsUseCase } from "@/features/store-settings/domain/usecases/get-store-settings-usecase";

const settings: StoreSettings = { storeName: "Ezzion Imports", whatsappPhone: "5581999999999" };

describe("GetStoreSettingsUseCase", () => {
  it("returns the settings from repository", async () => {
    const repository: StoreSettingsRepository = { get: vi.fn().mockResolvedValue(Result.success(settings)), update: vi.fn() };
    const result = await new GetStoreSettingsUseCase(repository).call();

    expect(result).toEqual(Result.success(settings));
    expect(repository.get).toHaveBeenCalledOnce();
  });

  it("returns repository failure", async () => {
    const failure = Result.failure<StoreSettings>({ type: "unknown", message: "Falhou" });
    const repository: StoreSettingsRepository = { get: vi.fn().mockResolvedValue(failure), update: vi.fn() };

    await expect(new GetStoreSettingsUseCase(repository).call()).resolves.toEqual(failure);
  });
});
