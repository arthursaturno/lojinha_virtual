"use client";

import { useState } from "react";

import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import type { StoreSettingsViewState } from "@/features/store-settings/presentation/viewmodels/store-settings-view-state";

export function useStoreSettingsViewModel(initialSettings: StoreSettings) {
  const [state, setState] = useState<StoreSettingsViewState>({
    settings: initialSettings,
    saveStatus: "idle",
  });

  function updateField(field: keyof StoreSettings, value: string) {
    setState((current) => ({
      settings: { ...current.settings, [field]: value },
      saveStatus: "idle",
      feedbackMessage: undefined,
    }));
  }

  function save() {
    setState((current) => ({
      ...current,
      saveStatus: "saved",
      feedbackMessage: "Configuracoes salvas no MVP local.",
    }));
  }

  return { state, actions: { updateField, save } };
}
