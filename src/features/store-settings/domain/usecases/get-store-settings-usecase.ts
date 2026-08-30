import type { Result } from "@/core/result/result";
import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import type { StoreSettingsRepository } from "@/features/store-settings/domain/repositories/store-settings-repository";

export class GetStoreSettingsUseCase {
  constructor(private readonly repository: StoreSettingsRepository) {}

  call(): Promise<Result<StoreSettings>> {
    return this.repository.get();
  }
}
