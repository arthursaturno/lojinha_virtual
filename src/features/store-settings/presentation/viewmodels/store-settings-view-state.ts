import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import type { AppToastTone } from "@/core/ui/components/app-toast";

export type StoreSettingsSaveStatus = "idle" | "loading" | "saved" | "failure";

export type StoreSettingsToast = {
  tone: AppToastTone;
  message: string;
};

export type StoreSettingsViewState = {
  settings: StoreSettings;
  saveStatus: StoreSettingsSaveStatus;
  toast: StoreSettingsToast | null;
};
