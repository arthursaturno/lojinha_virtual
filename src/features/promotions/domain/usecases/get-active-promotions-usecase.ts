import type { PromotionsRepository } from "@/features/promotions/domain/repositories/promotions-repository";

export class GetActivePromotionsUseCase {
  constructor(private readonly repository: PromotionsRepository) {}

  call() {
    return this.repository.getActive();
  }
}
