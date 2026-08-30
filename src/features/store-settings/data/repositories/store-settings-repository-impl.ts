import { Result } from "@/core/result/result";
import type { StoreSettingsDataSource } from "@/features/store-settings/data/datasources/store-settings-mock-datasource";
import { storeSettingsToDomain } from "@/features/store-settings/data/dtos/store-settings-dto";
import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import type { StoreSettingsRepository } from "@/features/store-settings/domain/repositories/store-settings-repository";

export class StoreSettingsRepositoryImpl implements StoreSettingsRepository {
  constructor(private readonly dataSource: StoreSettingsDataSource) {}

  async get() {
    try {
      return Result.success<StoreSettings>(storeSettingsToDomain(await this.dataSource.get()));
    } catch {
      return Result.failure<StoreSettings>({
        type: "unknown",
        message: "Nao foi possivel carregar as configuracoes da loja.",
      });
    }
  }
}
