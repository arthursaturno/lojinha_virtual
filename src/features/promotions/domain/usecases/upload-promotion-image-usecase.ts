import type { PromotionsRepository, PromotionImageUpload } from "@/features/promotions/domain/repositories/promotions-repository";

export class UploadPromotionImageUseCase {
  constructor(private readonly repository: PromotionsRepository) {}

  call(upload: PromotionImageUpload) {
    if (!upload.file.type.startsWith("image/")) {
      return Promise.resolve({ ok: false as const, failure: { type: "validation" as const, message: "Selecione uma imagem valida." } });
    }

    return this.repository.uploadImage(upload);
  }
}
