"use client";

import { useState } from "react";

import type { PromotionDiscountType, PromotionKind, PromotionTargetType, StorePromotion } from "@/core/promotions/promotion";
import type { DeletePromotionUseCase } from "@/features/promotions/domain/usecases/delete-promotion-usecase";
import type { SavePromotionUseCase } from "@/features/promotions/domain/usecases/save-promotion-usecase";
import type { UploadPromotionImageUseCase } from "@/features/promotions/domain/usecases/upload-promotion-image-usecase";
import type { PromotionDraft, PromotionsViewState } from "@/features/promotions/presentation/viewmodels/promotions-view-state";

type PromotionActions = {
  save: Pick<SavePromotionUseCase, "call">;
  delete: Pick<DeletePromotionUseCase, "call">;
  uploadImage: Pick<UploadPromotionImageUseCase, "call">;
};

function createDraft(kind: PromotionKind): PromotionDraft {
  const id = `draft-${Date.now()}`;
  const base = {
    id,
    internalName: promotionKindInternalName[kind],
    kind,
    isActive: true,
    priority: 0,
    imageUrls: [],
  };

  if (kind === "cart_benefit" || kind === "free_shipping") {
    const benefitRule = createBenefitRule(kind);
    return { ...base, benefitRules: [benefitRule], benefitRule };
  }
  if (kind === "product_discount") {
    return { ...base, productRules: [{ targetType: "product", productId: "", discountType: "percentage", discountValue: 10 }] };
  }
  if (kind === "quantity_discount") {
    return { ...base, productRules: [{ targetType: "product", productId: "", discountType: "fixed_amount", discountValue: 0, buyQuantity: 3, payQuantity: 2 }] };
  }
  return base;
}

export function usePromotionsViewModel(initialPromotions: StorePromotion[], promotionActions: PromotionActions) {
  const [state, setState] = useState<PromotionsViewState>({ promotions: initialPromotions, draft: null, saveStatus: "idle" });

  function openNew(kind: PromotionKind) {
    setState((current) => ({ ...current, draft: createDraft(kind), saveStatus: "idle", feedbackMessage: undefined }));
  }

  function openExisting(promotion: StorePromotion) {
    const draft = structuredClone(promotion);
    if ((draft.kind === "cart_benefit" || draft.kind === "free_shipping") && !draft.benefitRule) {
      draft.benefitRule = createBenefitRule(draft.kind);
      draft.benefitRules = [draft.benefitRule];
    }
    setState((current) => ({ ...current, draft, saveStatus: "idle", feedbackMessage: undefined }));
  }

  function openCampaign(kind: PromotionKind) {
    const existing = state.promotions.find((promotion) => promotion.kind === kind);
    if (existing) {
      openExisting(existing);
      return;
    }
    openNew(kind);
  }

  function openCartBenefitsCampaign() {
    const existing = state.promotions.find(
      (promotion) => promotion.kind === "cart_benefit" || promotion.kind === "free_shipping",
    );
    if (existing) {
      openExisting(existing);
      return;
    }
    openNew("cart_benefit");
  }

  function closeEditor() {
    setState((current) => ({ ...current, draft: null, saveStatus: "idle" }));
  }

  function updateDraft(patch: Partial<PromotionDraft>) {
    setState((current) => current.draft ? { ...current, draft: { ...current.draft, ...patch }, saveStatus: "idle" } : current);
  }

  function updateProductRule(patch: { targetType?: PromotionTargetType; productId?: string; targetValue?: string; discountType?: PromotionDiscountType; discountValue?: number; buyQuantity?: number; payQuantity?: number }) {
    setState((current) => current.draft?.productRule ? {
      ...current,
      draft: { ...current.draft, productRule: { ...current.draft.productRule, ...patch } },
      saveStatus: "idle",
    } : current);
  }

  function updateProductRules(productRules: NonNullable<PromotionDraft["productRules"]>) {
    setState((current) => current.draft ? {
      ...current,
      draft: { ...current.draft, productRules, productRule: productRules[0] },
      saveStatus: "idle",
    } : current);
  }

  function updateBenefitRule(patch: { title?: string; description?: string; minimumAmount?: number; discountType?: "percentage" | "fixed_amount"; discountValue?: number }) {
    setState((current) => current.draft?.benefitRule ? {
      ...current,
      draft: { ...current.draft, benefitRule: { ...current.draft.benefitRule, ...patch } },
      saveStatus: "idle",
    } : current);
  }

  function updateBenefitRules(benefitRules: NonNullable<PromotionDraft["benefitRules"]>) {
    setState((current) => current.draft ? {
      ...current,
      draft: { ...current.draft, benefitRules, benefitRule: benefitRules[0] },
      saveStatus: "idle",
    } : current);
  }

  async function uploadImage(file: File): Promise<string | null> {
    const result = await promotionActions.uploadImage.call({ file });
    if (!result.ok) {
      setState((current) => ({ ...current, saveStatus: "failure", feedbackMessage: result.failure.message }));
      return null;
    }
    return result.data;
  }

  async function save(imageUrls?: string[]): Promise<boolean> {
    if (!state.draft) return false;
    const promotion = imageUrls
      ? { ...state.draft, imageUrls, imageUrl: imageUrls[0] }
      : state.draft;
    setState((current) => ({ ...current, saveStatus: "loading", feedbackMessage: undefined }));
    const result = await promotionActions.save.call(promotion);
    if (!result.ok) {
      setState((current) => ({ ...current, saveStatus: "failure", feedbackMessage: result.failure.message }));
      return false;
    }
    setState((current) => ({
      ...current,
      promotions: current.promotions.some((promotion) => promotion.id === result.data.id)
        ? current.promotions.map((promotion) => promotion.id === result.data.id ? result.data : promotion)
        : [result.data, ...current.promotions],
      draft: result.data,
      saveStatus: "idle",
      feedbackMessage: "Promocao salva com sucesso.",
    }));
    return true;
  }

  async function remove() {
    if (!state.draft || state.draft.id.startsWith("draft-")) return;
    setState((current) => ({ ...current, saveStatus: "loading", feedbackMessage: undefined }));
    const result = await promotionActions.delete.call(state.draft);
    if (!result.ok) {
      setState((current) => ({ ...current, saveStatus: "failure", feedbackMessage: result.failure.message }));
      return;
    }
    setState((current) => ({ ...current, promotions: current.promotions.filter((promotion) => promotion.id !== state.draft?.id), draft: null, saveStatus: "idle", feedbackMessage: "Promocao excluida com sucesso." }));
  }

  function dismissFeedback() { setState((current) => ({ ...current, feedbackMessage: undefined })); }

  return { state, actions: { openNew, openExisting, openCampaign, openCartBenefitsCampaign, closeEditor, updateDraft, updateProductRule, updateProductRules, updateBenefitRule, updateBenefitRules, uploadImage, save, remove, dismissFeedback } };
}

function createBenefitRule(kind: "cart_benefit" | "free_shipping") {
  return kind === "free_shipping"
    ? { kind, title: "Frete gratis", description: "Frete gratis para esta compra.", minimumAmount: 0, discountType: "fixed_amount" as const, discountValue: 0 }
    : { kind, title: "", description: "", minimumAmount: 0, discountType: "percentage" as const, discountValue: 10 };
}

const promotionKindInternalName: Record<PromotionKind, string> = {
  popup: "Popup da loja",
  product_discount: "Descontos nos produtos",
  quantity_discount: "Leve X, pague Y",
  cart_benefit: "Beneficios do carrinho",
  coupon: "Beneficio legado",
  free_shipping: "Frete gratis",
};
