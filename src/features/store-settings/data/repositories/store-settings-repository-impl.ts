import { Result } from "@/core/result/result";
import type { StoreSettingsDataSource } from "@/features/store-settings/data/datasources/store-settings-supabase-datasource";
import { storeSettingsToDomain } from "@/features/store-settings/data/dtos/store-settings-dto";
import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import type { StoreSettingsRepository } from "@/features/store-settings/domain/repositories/store-settings-repository";

export class StoreSettingsRepositoryImpl implements StoreSettingsRepository {
  constructor(private readonly dataSource: StoreSettingsDataSource) {}

  async get() {
    try {
      const dto = await this.dataSource.get();

      return Result.success<StoreSettings>(
        dto ? storeSettingsToDomain(dto) : { storeName: "Ezzion Imports", whatsappPhone: "5581999999999", fixedShippingAmount: 0 },
      );
    } catch {
      return Result.failure<StoreSettings>({
        type: "unknown",
        message: "Nao foi possivel carregar as configuracoes da loja.",
      });
    }
  }

  async update(settings: StoreSettings) {
    try {
      return Result.success<StoreSettings>(storeSettingsToDomain(await this.dataSource.upsert(settings)));
    } catch {
      return Result.failure<StoreSettings>({
        type: "unknown",
        message: "Nao foi possivel salvar as configuracoes da loja.",
      });
    }
  }
}
