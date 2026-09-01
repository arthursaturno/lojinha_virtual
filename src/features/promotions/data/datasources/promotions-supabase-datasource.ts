import type { SupabaseClient } from "@supabase/supabase-js";

import type { PromotionCouponValidation, StorePromotion } from "@/core/promotions/promotion";
import type { PromotionDto } from "@/features/promotions/data/dtos/promotion-dto";
import type { PromotionImageUpload } from "@/features/promotions/domain/repositories/promotions-repository";

export type PromotionsDataSource = {
  findAll(): Promise<PromotionDto[]>;
  findActive(): Promise<PromotionDto[]>;
  save(promotion: StorePromotion): Promise<PromotionDto>;
  delete(promotion: StorePromotion): Promise<void>;
  uploadImage(upload: PromotionImageUpload): Promise<string>;
  validateCoupon(input: { code: string; items: Array<{ variantId: string; quantity: number }> }): Promise<PromotionCouponValidation>;
};

const promotionSelect = "id, internal_name, kind, image_url, is_active, priority, starts_at, ends_at, promotion_products(id, product_id, discount_type, discount_value, buy_quantity, pay_quantity), promotion_coupons(id, code, minimum_amount, discount_type, discount_value)";

export class PromotionsSupabaseDataSource implements PromotionsDataSource {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async findAll(): Promise<PromotionDto[]> {
    const { data: authData, error: authError } = await this.supabaseClient.auth.getUser();
    if (authError || !authData.user) throw new Error("Sessao administrativa nao encontrada.");
    const { data, error } = await this.supabaseClient
      .from("promotions")
      .select(promotionSelect)
      .eq("owner_id", authData.user.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as PromotionDto[];
  }

  async findActive(): Promise<PromotionDto[]> {
    const { data, error } = await this.supabaseClient
      .from("promotions")
      .select(promotionSelect)
      .eq("is_active", true)
      .order("priority", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as PromotionDto[];
  }

  async save(promotion: StorePromotion): Promise<PromotionDto> {
    const { data: authData, error: authError } = await this.supabaseClient.auth.getUser();
    if (authError || !authData.user) throw new Error("Sessao administrativa nao encontrada.");

    const row = {
      owner_id: authData.user.id,
      internal_name: promotion.internalName.trim(),
      kind: promotion.kind,
      image_url: promotion.imageUrl ?? null,
      is_active: promotion.isActive,
      priority: promotion.priority,
      starts_at: promotion.startsAt ?? null,
      ends_at: promotion.endsAt ?? null,
    };
    const promotionId = promotion.id.startsWith("draft-")
      ? await this.create(row)
      : await this.update(promotion.id, row);

    const { error: removeProductRuleError } = await this.supabaseClient.from("promotion_products").delete().eq("promotion_id", promotionId);
    if (removeProductRuleError) throw new Error(removeProductRuleError.message);
    const { error: removeCouponRuleError } = await this.supabaseClient.from("promotion_coupons").delete().eq("promotion_id", promotionId);
    if (removeCouponRuleError) throw new Error(removeCouponRuleError.message);

    if (promotion.productRule) {
      const { error } = await this.supabaseClient.from("promotion_products").insert({
        promotion_id: promotionId,
        owner_id: authData.user.id,
        product_id: promotion.productRule.productId,
        discount_type: promotion.productRule.discountType,
        discount_value: promotion.productRule.discountValue,
        buy_quantity: promotion.productRule.buyQuantity ?? null,
        pay_quantity: promotion.productRule.payQuantity ?? null,
      });
      if (error) throw new Error(error.message);
    }

    if (promotion.couponRule) {
      const { error } = await this.supabaseClient.from("promotion_coupons").insert({
        promotion_id: promotionId,
        owner_id: authData.user.id,
        code: promotion.couponRule.code.trim().toUpperCase(),
        minimum_amount: promotion.couponRule.minimumAmount,
        discount_type: promotion.couponRule.discountType,
        discount_value: promotion.couponRule.discountValue,
      });
      if (error) throw new Error(error.message);
    }

    const { data, error } = await this.supabaseClient.from("promotions").select(promotionSelect).eq("id", promotionId).single();
    if (error) throw new Error(error.message);
    return data as PromotionDto;
  }

  async delete(promotion: StorePromotion): Promise<void> {
    const { error } = await this.supabaseClient.from("promotions").delete().eq("id", promotion.id);
    if (error) throw new Error(error.message);

    if (promotion.imageUrl) {
      const path = this.getStoragePath(promotion.imageUrl);
      if (path) {
        const { error: storageError } = await this.supabaseClient.storage.from("promotion-images").remove([path]);
        if (storageError) throw new Error(storageError.message);
      }
    }
  }

  async uploadImage(upload: PromotionImageUpload): Promise<string> {
    const { data: authData, error: authError } = await this.supabaseClient.auth.getUser();
    if (authError || !authData.user) throw new Error("Sessao administrativa nao encontrada.");
    const extension = upload.file.name.split(".").pop()?.toLowerCase() || "webp";
    const path = `${authData.user.id}/campaigns/${crypto.randomUUID()}.${extension}`;
    const { error } = await this.supabaseClient.storage.from("promotion-images").upload(path, upload.file, { contentType: upload.file.type, upsert: false });
    if (error) throw new Error(error.message);
    return this.supabaseClient.storage.from("promotion-images").getPublicUrl(path).data.publicUrl;
  }

  async validateCoupon(input: { code: string; items: Array<{ variantId: string; quantity: number }> }): Promise<PromotionCouponValidation> {
    const { data, error } = await this.supabaseClient.rpc("validate_promotion_cart_coupon", {
      p_code: input.code.trim().toUpperCase(),
      p_items: input.items.map((item) => ({ variant_id: item.variantId, quantity: item.quantity })),
    });
    if (error) throw new Error(error.message);
    const result = Array.isArray(data) ? data[0] : data;
    if (!result) throw new Error("Nao foi possivel validar o cupom.");
    return {
      isValid: result.is_valid,
      message: result.message,
      couponCode: result.coupon_code ?? undefined,
      originalTotal: Number(result.original_total),
      productDiscount: Number(result.product_discount),
      couponDiscount: Number(result.coupon_discount),
      finalTotal: Number(result.final_total),
      hasFreeShipping: Boolean(result.has_free_shipping),
    };
  }

  private async create(row: Record<string, unknown>): Promise<string> {
    const { data, error } = await this.supabaseClient.from("promotions").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    return data.id as string;
  }

  private async update(id: string, row: Record<string, unknown>): Promise<string> {
    const { error } = await this.supabaseClient.from("promotions").update(row).eq("id", id);
    if (error) throw new Error(error.message);
    return id;
  }

  private getStoragePath(imageUrl: string): string | null {
    const marker = "/storage/v1/object/public/promotion-images/";
    const markerIndex = imageUrl.indexOf(marker);
    return markerIndex >= 0 ? imageUrl.slice(markerIndex + marker.length) : null;
  }
}
