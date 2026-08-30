import { StoreSettingsMockDataSource } from "@/features/store-settings/data/datasources/store-settings-mock-datasource";
import { StoreSettingsRepositoryImpl } from "@/features/store-settings/data/repositories/store-settings-repository-impl";
import { GetStoreSettingsUseCase } from "@/features/store-settings/domain/usecases/get-store-settings-usecase";

export function createGetStoreSettingsUseCase() {
  return new GetStoreSettingsUseCase(
    new StoreSettingsRepositoryImpl(new StoreSettingsMockDataSource()),
  );
}
