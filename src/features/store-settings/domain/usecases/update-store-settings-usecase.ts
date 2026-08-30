import { Result } from "@/core/result/result";
import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import type { StoreSettingsRepository } from "@/features/store-settings/domain/repositories/store-settings-repository";

export class UpdateStoreSettingsUseCase {
  constructor(private readonly repository: StoreSettingsRepository) {}

  call(settings: StoreSettings): Promise<Result<StoreSettings>> {
    const storeName = settings.storeName.trim();
    const whatsappPhone = settings.whatsappPhone.replace(/\D/g, "");

    if (!storeName) {
      return Promise.resolve(Result.failure({ type: "validation", message: "Informe o nome da loja." }));
    }

    if (!/^55\d{10,11}$/.test(whatsappPhone)) {
      return Promise.resolve(
        Result.failure({
          type: "validation",
          message: "Informe o WhatsApp com codigo do pais, DDD e numero.",
        }),
      );
    }

    return this.repository.update({ storeName, whatsappPhone });
  }
}
