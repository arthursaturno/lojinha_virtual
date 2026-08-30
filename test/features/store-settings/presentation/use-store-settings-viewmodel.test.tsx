import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Result } from "@/core/result/result";
import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import type { UpdateStoreSettingsUseCase } from "@/features/store-settings/domain/usecases/update-store-settings-usecase";
import { useStoreSettingsViewModel } from "@/features/store-settings/presentation/viewmodels/use-store-settings-viewmodel";

const settings: StoreSettings = { storeName: "Ezzion Imports", whatsappPhone: "5581999999999" };

function createUseCase(result: ReturnType<typeof Result.success<StoreSettings>> | ReturnType<typeof Result.failure<StoreSettings>>) {
  return { call: vi.fn().mockResolvedValue(result) } as unknown as UpdateStoreSettingsUseCase;
}

describe("useStoreSettingsViewModel", () => {
  it("updates fields and clears saved feedback", () => {
    const { result } = renderHook(() => useStoreSettingsViewModel(settings, () => createUseCase(Result.success(settings))));

    act(() => result.current.actions.updateField("storeName", "Outra loja"));

    expect(result.current.state.settings.storeName).toBe("Outra loja");
    expect(result.current.state.saveStatus).toBe("idle");
    expect(result.current.state.toast).toBeNull();
  });

  it("sets a success toast after saving", async () => {
    const { result } = renderHook(() => useStoreSettingsViewModel(settings, () => createUseCase(Result.success(settings))));

    await act(async () => result.current.actions.save());

    expect(result.current.state.saveStatus).toBe("saved");
    expect(result.current.state.toast).toEqual({ tone: "success", message: "Configuracoes salvas com sucesso." });
  });

  it("sets an error toast when save fails", async () => {
    const failure = Result.failure<StoreSettings>({ type: "unknown", message: "Falhou" });
    const { result } = renderHook(() => useStoreSettingsViewModel(settings, () => createUseCase(failure)));

    await act(async () => result.current.actions.save());

    expect(result.current.state.saveStatus).toBe("failure");
    expect(result.current.state.toast).toEqual({ tone: "error", message: "Falhou" });
  });
});
