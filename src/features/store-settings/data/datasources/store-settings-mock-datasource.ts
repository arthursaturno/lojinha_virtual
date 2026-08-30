import type { StoreSettingsDto } from "@/features/store-settings/data/dtos/store-settings-dto";

export interface StoreSettingsDataSource {
  get(): Promise<StoreSettingsDto>;
}

const settings: StoreSettingsDto = {
  store_name: "Ezzion Imports",
  whatsapp_phone: "5581999999999",
};

export class StoreSettingsMockDataSource implements StoreSettingsDataSource {
  async get(): Promise<StoreSettingsDto> {
    return settings;
  }
}
