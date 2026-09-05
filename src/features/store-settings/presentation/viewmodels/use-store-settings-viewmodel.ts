"use client";

import { useState } from "react";

import type { UpdateStoreSettingsUseCase } from "@/features/store-settings/domain/usecases/update-store-settings-usecase";
import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import type { StoreSettingsViewState } from "@/features/store-settings/presentation/viewmodels/store-settings-view-state";

type UpdateStoreSettingsUseCaseFactory = () => UpdateStoreSettingsUseCase;

export function useStoreSettingsViewModel(
  initialSettings: StoreSettings,
  createUpdateStoreSettingsUseCase: UpdateStoreSettingsUseCaseFactory,
) {
  const [state, setState] = useState<StoreSettingsViewState>({
    settings: initialSettings,
    saveStatus: "idle",
    toast: null,
  });

  function updateField(field: keyof StoreSettings, value: string | number) {
    setState((current) => ({
      settings: { ...current.settings, [field]: value },
      saveStatus: "idle",
      toast: null,
    }));
  }

  async function save() {
    setState((current) => ({ ...current, saveStatus: "loading", toast: null }));

    let updateStoreSettingsUseCase: UpdateStoreSettingsUseCase;

    try {
      updateStoreSettingsUseCase = createUpdateStoreSettingsUseCase();
    } catch {
      setState((current) => ({
        ...current,
        saveStatus: "failure",
        toast: { tone: "error", message: "Configuracao do Supabase nao encontrada." },
      }));
      return;
    }

    const result = await updateStoreSettingsUseCase.call(state.settings);

    if (!result.ok) {
      setState((current) => ({
        ...current,
        saveStatus: "failure",
        toast: { tone: "error", message: result.failure.message },
      }));
      return;
    }

    setState((current) => ({
      ...current,
      settings: result.data,
      saveStatus: "saved",
      toast: { tone: "success", message: "Configuracoes salvas com sucesso." },
    }));
  }

  function dismissToast() {
    setState((current) => ({ ...current, toast: null }));
  }

  return { state, actions: { updateField, save, dismissToast } };
}
