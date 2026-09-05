import { Result } from "@/core/result/result";
import { promotionDtoToDomain } from "@/features/promotions/data/dtos/promotion-dto";
import type { PromotionsDataSource } from "@/features/promotions/data/datasources/promotions-supabase-datasource";
import type { PromotionsRepository, PromotionImageUpload } from "@/features/promotions/domain/repositories/promotions-repository";

export class PromotionsRepositoryImpl implements PromotionsRepository {
  constructor(private readonly dataSource: PromotionsDataSource) {}

  async getForAdministration() {
    try { return Result.success((await this.dataSource.findAll()).map(promotionDtoToDomain)); }
    catch { return Result.failure({ type: "unknown", message: "Nao foi possivel carregar as promocoes." }); }
  }

  async getActive() {
    try { return Result.success((await this.dataSource.findActive()).map(promotionDtoToDomain)); }
    catch { return Result.failure({ type: "unknown", message: "Nao foi possivel carregar as promocoes ativas." }); }
  }

  async save(promotion: Parameters<PromotionsRepository["save"]>[0]) {
    try { return Result.success(promotionDtoToDomain(await this.dataSource.save(promotion))); }
    catch (error) { return Result.failure({ type: "unknown", message: error instanceof Error ? error.message : "Nao foi possivel salvar a promocao." }); }
  }

  async delete(promotion: Parameters<PromotionsRepository["delete"]>[0]) {
    try { await this.dataSource.delete(promotion); return Result.success(undefined); }
    catch { return Result.failure({ type: "unknown", message: "Nao foi possivel excluir a promocao." }); }
  }

  async uploadImage(upload: PromotionImageUpload) {
    try { return Result.success(await this.dataSource.uploadImage(upload)); }
    catch { return Result.failure({ type: "unknown", message: "Nao foi possivel enviar a imagem da campanha." }); }
  }

  async listAvailableCartBenefits(input: Parameters<PromotionsRepository["listAvailableCartBenefits"]>[0]) {
    try { return Result.success(await this.dataSource.listAvailableCartBenefits(input)); }
    catch { return Result.failure({ type: "unknown", message: "Nao foi possivel carregar os beneficios disponiveis." }); }
  }

  async validateCartBenefit(input: Parameters<PromotionsRepository["validateCartBenefit"]>[0]) {
    try { return Result.success(await this.dataSource.validateCartBenefit(input)); }
    catch { return Result.failure({ type: "unknown", message: "Nao foi possivel calcular as promocoes." }); }
  }
}
