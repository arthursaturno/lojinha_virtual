import type { Result } from "@/core/result/result";
import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";

export interface StoreSettingsRepository {
  get(): Promise<Result<StoreSettings>>;
  update(settings: StoreSettings): Promise<Result<StoreSettings>>;
}
