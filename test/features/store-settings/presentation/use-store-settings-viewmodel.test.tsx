import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import { useStoreSettingsViewModel } from "@/features/store-settings/presentation/viewmodels/use-store-settings-viewmodel";

const settings: StoreSettings = { storeName: "Ezzion Imports", whatsappPhone: "5581999999999" };

describe("useStoreSettingsViewModel", () => {
  it("updates fields and clears saved feedback", () => {
    const { result } = renderHook(() => useStoreSettingsViewModel(settings));

    act(() => result.current.actions.save());
    act(() => result.current.actions.updateField("storeName", "Outra loja"));

    expect(result.current.state.settings.storeName).toBe("Outra loja");
    expect(result.current.state.saveStatus).toBe("idle");
    expect(result.current.state.feedbackMessage).toBeUndefined();
  });

  it("sets a save confirmation", () => {
    const { result } = renderHook(() => useStoreSettingsViewModel(settings));

    act(() => result.current.actions.save());

    expect(result.current.state.saveStatus).toBe("saved");
    expect(result.current.state.feedbackMessage).toBe("Configuracoes salvas no MVP local.");
  });
});
