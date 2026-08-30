import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";

export type StoreSettingsDto = {
  store_name: string;
  whatsapp_phone: string;
};

export function storeSettingsToDomain(dto: StoreSettingsDto): StoreSettings {
  return {
    storeName: dto.store_name,
    whatsappPhone: dto.whatsapp_phone,
  };
}
