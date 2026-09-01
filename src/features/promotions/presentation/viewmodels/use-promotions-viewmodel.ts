"use client";

import { useState } from "react";

import type { PromotionDiscountType, PromotionKind, StorePromotion } from "@/core/promotions/promotion";
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
    internalName: "",
    kind,
    isActive: true,
    priority: 0,
  } as const;

  if (kind === "coupon") {
    return { ...base, couponRule: { code: "", minimumAmount: 0, discountType: "percentage", discountValue: 10 } };
  }
  if (kind === "product_discount") {
    return { ...base, productRule: { productId: "", discountType: "percentage", discountValue: 10 } };
  }
  if (kind === "quantity_discount") {
    return { ...base, productRule: { productId: "", discountType: "fixed_amount", discountValue: 0, buyQuantity: 3, payQuantity: 2 } };
  }
  return base;
}

export function usePromotionsViewModel(initialPromotions: StorePromotion[], promotionActions: PromotionActions) {
  const [state, setState] = useState<PromotionsViewState>({ promotions: initialPromotions, draft: null, saveStatus: "idle" });

  function openNew(kind: PromotionKind) {
    setState((current) => ({ ...current, draft: createDraft(kind), saveStatus: "idle", feedbackMessage: undefined }));
  }

  function openExisting(promotion: StorePromotion) {
    setState((current) => ({ ...current, draft: structuredClone(promotion), saveStatus: "idle", feedbackMessage: undefined }));
  }

  function closeEditor() {
    setState((current) => ({ ...current, draft: null, saveStatus: "idle" }));
  }

  function updateDraft(patch: Partial<PromotionDraft>) {
    setState((current) => current.draft ? { ...current, draft: { ...current.draft, ...patch }, saveStatus: "idle" } : current);
  }

  function updateProductRule(patch: { productId?: string; discountType?: PromotionDiscountType; discountValue?: number; buyQuantity?: number; payQuantity?: number }) {
    setState((current) => current.draft?.productRule ? {
      ...current,
      draft: { ...current.draft, productRule: { ...current.draft.productRule, ...patch } },
      saveStatus: "idle",
    } : current);
  }

  function updateCouponRule(patch: { code?: string; minimumAmount?: number; discountType?: "percentage" | "fixed_amount"; discountValue?: number }) {
    setState((current) => current.draft?.couponRule ? {
      ...current,
      draft: { ...current.draft, couponRule: { ...current.draft.couponRule, ...patch } },
      saveStatus: "idle",
    } : current);
  }

  async function uploadImage(file: File) {
    const result = await promotionActions.uploadImage.call({ file });
    if (!result.ok) {
      setState((current) => ({ ...current, saveStatus: "failure", feedbackMessage: result.failure.message }));
      return;
    }
    updateDraft({ imageUrl: result.data });
  }

  async function save() {
    if (!state.draft) return;
    setState((current) => ({ ...current, saveStatus: "loading", feedbackMessage: undefined }));
    const result = await promotionActions.save.call(state.draft);
    if (!result.ok) {
      setState((current) => ({ ...current, saveStatus: "failure", feedbackMessage: result.failure.message }));
      return;
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

  return { state, actions: { openNew, openExisting, closeEditor, updateDraft, updateProductRule, updateCouponRule, uploadImage, save, remove, dismissFeedback } };
}
