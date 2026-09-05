import type { SupabaseClient } from "@supabase/supabase-js";

import { maximumPromotionPopupImages, type PromotionCartBenefit, type PromotionCartValidation, type StorePromotion } from "@/core/promotions/promotion";
import type { PromotionDto } from "@/features/promotions/data/dtos/promotion-dto";
import type { PromotionImageUpload } from "@/features/promotions/domain/repositories/promotions-repository";

export type PromotionsDataSource = {
  findAll(): Promise<PromotionDto[]>;
  findActive(): Promise<PromotionDto[]>;
  save(promotion: StorePromotion): Promise<PromotionDto>;
  delete(promotion: StorePromotion): Promise<void>;
  uploadImage(upload: PromotionImageUpload): Promise<string>;
  listAvailableCartBenefits(input: { items: Array<{ variantId: string; quantity: number }> }): Promise<PromotionCartBenefit[]>;
  validateCartBenefit(input: { promotionId?: string; items: Array<{ variantId: string; quantity: number }> }): Promise<PromotionCartValidation>;
};

const promotionSelect = "id, internal_name, kind, image_url, is_active, priority, starts_at, ends_at, promotion_images(image_url, position), promotion_products(id, target_type, product_id, target_value, discount_type, discount_value, buy_quantity, pay_quantity), promotion_benefits(id, kind, title, description, minimum_amount, discount_type, discount_value)";
const promotionImagesBucket = "promotion-images";
const promotionImagesPublicPathPrefix = "/storage/v1/object/public/promotion-images/";

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
      image_url: promotion.imageUrls?.[0] ?? promotion.imageUrl ?? null,
      is_active: promotion.isActive,
      priority: promotion.priority,
      starts_at: promotion.startsAt ?? null,
      ends_at: promotion.endsAt ?? null,
    };
    const existingPromotionId = promotion.id.startsWith("draft-")
      ? await this.findCampaignId(authData.user.id, promotion.kind)
      : promotion.id;
    const previousImageUrls = existingPromotionId ? await this.getImageUrls(existingPromotionId) : [];
    const promotionId = existingPromotionId
      ? await this.update(existingPromotionId, row)
      : await this.create(row);
    const { error: removeProductRuleError } = await this.supabaseClient.from("promotion_products").delete().eq("promotion_id", promotionId);
    if (removeProductRuleError) throw new Error(removeProductRuleError.message);
    const { error: removeBenefitRuleError } = await this.supabaseClient.from("promotion_benefits").delete().eq("promotion_id", promotionId);
    if (removeBenefitRuleError) throw new Error(removeBenefitRuleError.message);
    const { error: removeImagesError } = await this.supabaseClient.from("promotion_images").delete().eq("promotion_id", promotionId);
    if (removeImagesError) throw new Error(removeImagesError.message);

    const imageUrls = (promotion.imageUrls ?? (promotion.imageUrl ? [promotion.imageUrl] : [])).slice(0, maximumPromotionPopupImages);
    if (imageUrls.length) {
      const { error: insertImagesError } = await this.supabaseClient.from("promotion_images").insert(
        imageUrls.map((imageUrl, position) => ({ promotion_id: promotionId, owner_id: authData.user.id, image_url: imageUrl, position })),
      );
      if (insertImagesError) throw new Error(insertImagesError.message);
    }

    const productRules = promotion.productRules ?? (promotion.productRule ? [promotion.productRule] : []);
    if (productRules.length) {
      const { error } = await this.supabaseClient.from("promotion_products").insert(productRules.map((rule) => ({
        promotion_id: promotionId,
        owner_id: authData.user.id,
        target_type: rule.targetType,
        product_id: rule.targetType === "product" ? rule.productId ?? null : null,
        target_value: rule.targetType === "product" ? null : rule.targetValue ?? null,
        discount_type: rule.discountType,
        discount_value: rule.discountValue,
        buy_quantity: rule.buyQuantity ?? null,
        pay_quantity: rule.payQuantity ?? null,
      })));
      if (error) throw new Error(error.message);
    }

    const benefitRules = promotion.benefitRules ?? (promotion.benefitRule ? [promotion.benefitRule] : []);
    if (benefitRules.length) {
      const { error } = await this.supabaseClient.from("promotion_benefits").insert(benefitRules.map((rule) => ({
        promotion_id: promotionId,
        owner_id: authData.user.id,
        kind: rule.kind,
        title: rule.title.trim(),
        description: rule.description.trim(),
        minimum_amount: rule.minimumAmount,
        discount_type: rule.discountType,
        discount_value: rule.discountValue,
      })));
      if (error) throw new Error(error.message);
    }

    const removedImageUrls = previousImageUrls.filter((imageUrl) => !imageUrls.includes(imageUrl));
    await this.deleteImages(removedImageUrls);

    const { data, error } = await this.supabaseClient.from("promotions").select(promotionSelect).eq("id", promotionId).single();
    if (error) throw new Error(error.message);
    return data as PromotionDto;
  }

  async delete(promotion: StorePromotion): Promise<void> {
    const { data: authData, error: authError } = await this.supabaseClient.auth.getUser();
    if (authError || !authData.user) throw new Error("Sessao administrativa nao encontrada.");

    const imageUrls = await this.getImageUrls(promotion.id);
    await this.deleteImages([...new Set([...imageUrls, ...(promotion.imageUrls ?? []), ...(promotion.imageUrl ? [promotion.imageUrl] : [])])]);

    const { error } = await this.supabaseClient.from("promotions").delete().eq("id", promotion.id);
    if (error) throw new Error(error.message);
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

  async listAvailableCartBenefits(input: { items: Array<{ variantId: string; quantity: number }> }): Promise<PromotionCartBenefit[]> {
    const { data, error } = await this.supabaseClient.rpc("list_available_cart_benefits", {
      p_items: input.items.map((item) => ({ variant_id: item.variantId, quantity: item.quantity })),
    });
    if (error) throw new Error(error.message);
    return (data ?? []).map((benefit: { benefit_id: string; title: string; description: string; kind: PromotionCartBenefit["kind"]; minimum_amount: number }) => ({
      id: benefit.benefit_id,
      title: benefit.title,
      description: benefit.description,
      kind: benefit.kind,
      minimumAmount: Number(benefit.minimum_amount),
    }));
  }

  async validateCartBenefit(input: { promotionId?: string; items: Array<{ variantId: string; quantity: number }> }): Promise<PromotionCartValidation> {
    const { data, error } = await this.supabaseClient.rpc("validate_promotion_cart_benefit", {
      p_benefit_id: input.promotionId ?? null,
      p_items: input.items.map((item) => ({ variant_id: item.variantId, quantity: item.quantity })),
    });
    if (error) throw new Error(error.message);
    const result = Array.isArray(data) ? data[0] : data;
    if (!result) throw new Error("Nao foi possivel calcular as promocoes.");
    return {
      isValid: result.is_valid,
      message: result.message,
      benefitTitle: result.benefit_title ?? undefined,
      originalTotal: Number(result.original_total),
      productDiscount: Number(result.product_discount),
      benefitDiscount: Number(result.benefit_discount),
      shippingAmount: Number(result.shipping_amount),
      shippingDiscount: Number(result.shipping_discount),
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
    try {
      const pathname = new URL(imageUrl).pathname;
      const pathStart = pathname.indexOf(promotionImagesPublicPathPrefix);

      return pathStart >= 0
        ? decodeURIComponent(pathname.slice(pathStart + promotionImagesPublicPathPrefix.length))
        : null;
    } catch {
      return null;
    }
  }

  private async findCampaignId(ownerId: string, kind: StorePromotion["kind"]): Promise<string | null> {
    const { data: existing, error: existingError } = await this.supabaseClient
      .from("promotions")
      .select("id")
      .eq("owner_id", ownerId)
      .eq("kind", kind)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existingError) throw new Error(existingError.message);
    return existing?.id ?? null;
  }

  private async getImageUrls(promotionId: string): Promise<string[]> {
    const { data, error } = await this.supabaseClient
      .from("promotions")
      .select("image_url, promotion_images(image_url)")
      .eq("id", promotionId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return [];

    return [
      ...(data.image_url ? [data.image_url] : []),
      ...((data.promotion_images ?? []).map((image) => image.image_url)),
    ];
  }

  private async deleteImages(imageUrls: string[]): Promise<void> {
    const uniqueImageUrls = [...new Set(imageUrls)];
    const paths = uniqueImageUrls.flatMap((imageUrl) => {
      const path = this.getStoragePath(imageUrl);
      return path ? [path] : [];
    });
    if (paths.length !== uniqueImageUrls.length) {
      throw new Error("Nao foi possivel localizar todas as fotos da promocao no Storage.");
    }
    if (!paths.length) return;

    const bucket = this.supabaseClient.storage.from(promotionImagesBucket);
    const { error } = await bucket.remove(paths);
    if (error) throw new Error(error.message);

    const remainingPaths = await this.findRemainingStoragePaths(bucket, paths);
    if (remainingPaths.length) {
      throw new Error("Nao foi possivel apagar todas as fotos da promocao no Storage.");
    }
  }

  private async findRemainingStoragePaths(
    bucket: ReturnType<SupabaseClient["storage"]["from"]>,
    paths: string[],
  ): Promise<string[]> {
    const pathsByFolder = paths.reduce<Map<string, Set<string>>>((groups, path) => {
      const separatorIndex = path.lastIndexOf("/");
      const folder = path.slice(0, separatorIndex);
      const name = path.slice(separatorIndex + 1);
      const names = groups.get(folder) ?? new Set<string>();
      names.add(name);
      groups.set(folder, names);
      return groups;
    }, new Map());

    const remainingPaths: string[] = [];
    for (const [folder, names] of pathsByFolder) {
      const { data, error } = await bucket.list(folder, { limit: 1000 });
      if (error) throw new Error(error.message);
      for (const object of data ?? []) {
        if (names.has(object.name)) remainingPaths.push(`${folder}/${object.name}`);
      }
    }

    return remainingPaths;
  }
}
