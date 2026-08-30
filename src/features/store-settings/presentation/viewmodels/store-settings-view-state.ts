import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";

export type StoreSettingsSaveStatus = "idle" | "saved";

export type StoreSettingsViewState = {
  settings: StoreSettings;
  saveStatus: StoreSettingsSaveStatus;
  feedbackMessage?: string;
};
