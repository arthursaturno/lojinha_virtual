import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";

export type StoreSettingsDto = {
  store_name: string;
  whatsapp_phone: string;
  fixed_shipping_amount: number;
};

export function storeSettingsToDomain(dto: StoreSettingsDto): StoreSettings {
  return {
    storeName: dto.store_name,
    whatsappPhone: dto.whatsapp_phone,
    fixedShippingAmount: Number(dto.fixed_shipping_amount),
  };
}
