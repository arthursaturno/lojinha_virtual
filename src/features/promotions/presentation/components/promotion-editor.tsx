/* Local blob previews require a native image element. */
/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiImage, FiTrash2, FiX } from "react-icons/fi";

import { administrationTypography } from "@/core/theme/tokens";
import { maximumPromotionPopupImages } from "@/core/promotions/promotion";
import { ImageCropModal, type ImageCrop } from "@/core/ui/components/image-crop-modal";
import { createProductImageUpload } from "@/core/utils/images/create-product-image-upload";
import { formatCurrencyInput, parseCurrencyInput } from "@/core/utils/format/currency-input";
import { PromotionProductRulesEditor } from "@/features/promotions/presentation/components/promotion-product-rules-editor";
import { PromotionBenefitRulesEditor } from "@/features/promotions/presentation/components/promotion-benefit-rules-editor";
import type { PromotionProductOption, PromotionSaveStatus } from "@/features/promotions/presentation/viewmodels/promotions-view-state";
import { promotionKindLabel, type PromotionDraft } from "@/features/promotions/presentation/viewmodels/promotions-view-state";

type PromotionEditorProps = {
  draft: PromotionDraft;
  products: PromotionProductOption[];
  saveStatus: PromotionSaveStatus;
  onClose(): void;
  onSave(imageUrls?: string[]): Promise<boolean>;
  onDelete(): void;
  onChange(patch: Partial<PromotionDraft>): void;
  onProductRulesChange(rules: NonNullable<PromotionDraft["productRules"]>): void;
  onBenefitRuleChange(patch: { title?: string; description?: string; minimumAmount?: number; discountType?: "percentage" | "fixed_amount"; discountValue?: number }): void;
  onBenefitRulesChange(rules: NonNullable<PromotionDraft["benefitRules"]>): void;
  onImageUpload(file: File): Promise<string | null>;
};

type PendingPromotionImage = { file: File; previewUrl: string; crop: ImageCrop };

function FieldLabel({ children }: { children: string }) {
  return <span className="mb-2 block font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.fieldLabel }}>{children}</span>;
}

function CurrencyInput({ value, onChange }: { value: number; onChange(value: number): void }) {
  return <input type="text" inputMode="numeric" value={formatCurrencyInput(String(Math.round(value * 100)))} onChange={(event) => onChange(parseCurrencyInput(event.target.value))} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }} />;
}

function isCartBenefitKind(kind: PromotionDraft["kind"]): boolean {
  return kind === "cart_benefit" || kind === "free_shipping";
}

export function PromotionEditor({ draft, products, saveStatus, onClose, onSave, onDelete, onChange, onProductRulesChange, onBenefitRuleChange, onBenefitRulesChange, onImageUpload }: PromotionEditorProps) {
  const isNew = draft.id.startsWith("draft-");
  const isSaving = saveStatus === "loading";
  const hasProductRule = draft.kind === "product_discount" || draft.kind === "quantity_discount";
  const productRules = draft.productRules ?? (draft.productRule ? [draft.productRule] : []);
  const [pendingImage, setPendingImage] = useState<PendingPromotionImage | null>(null);
  const [isApplyingCrop, setIsApplyingCrop] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const localImagesRef = useRef(new Map<string, File>());
  const imageUrls = (draft.imageUrls ?? (draft.imageUrl ? [draft.imageUrl] : [])).slice(0, maximumPromotionPopupImages);
  const benefitRules = draft.benefitRules ?? (draft.benefitRule ? [draft.benefitRule] : []);

  useEffect(() => () => {
    for (const previewUrl of localImagesRef.current.keys()) URL.revokeObjectURL(previewUrl);
  }, []);

  if (isCartBenefitKind(draft.kind)) {
    return <div className="fixed inset-0 z-40 bg-black/55" onMouseDown={onClose}><aside className="absolute right-0 top-0 h-full w-full overflow-auto bg-[#f7f7f5] p-4 md:w-[620px] md:p-6" onMouseDown={(event) => event.stopPropagation()}><div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-center justify-between border-b border-[var(--color-border)] bg-[#f7f7f5] px-4 py-4 md:-mx-6 md:px-6"><div><span className="font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.eyebrow }}>PROMOCAO</span><h2 className="mt-1 font-black" style={{ fontSize: "1.5rem" }}>BENEFICIOS DO CARRINHO</h2></div><button type="button" className="grid size-10 place-items-center border border-[var(--color-border)] bg-white" onClick={onClose} aria-label="Fechar editor"><FiX aria-hidden="true" /></button></div><div className="grid gap-4"><label><FieldLabel>NOME INTERNO</FieldLabel><input value={draft.internalName} onChange={(event) => onChange({ internalName: event.target.value })} className="h-11 w-full border border-[var(--color-border)] px-3" /></label><label className="flex items-center gap-3 border border-[var(--color-border)] bg-white px-3 py-3"><input type="checkbox" checked={draft.isActive} onChange={(event) => onChange({ isActive: event.target.checked })} /><span className="font-black">CAMPANHA ATIVA</span></label><PromotionBenefitRulesEditor rules={benefitRules} onChange={onBenefitRulesChange} /><div className="grid grid-cols-2 gap-3"><button type="button" onClick={onDelete} disabled={isNew || isSaving || isUploadingImages} className="h-11 border-2 border-[var(--color-error)] bg-white font-black text-[var(--color-error)]">EXCLUIR</button><button type="button" onClick={() => void savePromotion()} disabled={isSaving || isUploadingImages} className="h-11 bg-[var(--color-lime)] font-black">{isSaving || isUploadingImages ? "SALVANDO..." : "SALVAR PROMOCAO"}</button></div></div></aside></div>;
  }

  function closeCrop() {
    setPendingImage((current) => {
      if (current) URL.revokeObjectURL(current.previewUrl);
      return null;
    });
  }

  function selectImage(file: File) {
    setPendingImage({ file, previewUrl: URL.createObjectURL(file), crop: { zoom: 1, offsetX: 0, offsetY: 0 } });
  }

  async function applyCrop() {
    if (!pendingImage) return;
    setIsApplyingCrop(true);
    try {
      const upload = await createProductImageUpload(pendingImage.file, pendingImage.crop);
      const croppedFile = new File([upload.detail.bytes], upload.detail.fileName, { type: upload.detail.contentType });
      const imageUrl = URL.createObjectURL(croppedFile);
      localImagesRef.current.set(imageUrl, croppedFile);
      onChange({ imageUrls: [...imageUrls, imageUrl], imageUrl: imageUrls[0] ?? imageUrl });
      closeCrop();
    } finally {
      setIsApplyingCrop(false);
    }
  }

  function removeImage(index: number) {
    const removedImageUrl = imageUrls[index];
    if (removedImageUrl && localImagesRef.current.has(removedImageUrl)) {
      URL.revokeObjectURL(removedImageUrl);
      localImagesRef.current.delete(removedImageUrl);
    }
    const nextImageUrls = imageUrls.filter((_, imageIndex) => imageIndex !== index);
    onChange({
      imageUrls: nextImageUrls,
      imageUrl: nextImageUrls[0],
      ...(nextImageUrls.length === 0 ? { isActive: false } : {}),
    });
  }

  function moveImage(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= imageUrls.length) return;
    const nextImageUrls = [...imageUrls];
    [nextImageUrls[index], nextImageUrls[destination]] = [nextImageUrls[destination], nextImageUrls[index]];
    onChange({ imageUrls: nextImageUrls, imageUrl: nextImageUrls[0] });
  }

  async function savePromotion() {
    if (isUploadingImages) return;
    setIsUploadingImages(true);
    try {
      const uploadedImageUrls: string[] = [];
      for (const imageUrl of imageUrls) {
        const localImage = localImagesRef.current.get(imageUrl);
        const uploadedImageUrl = localImage ? await onImageUpload(localImage) : imageUrl;
        if (!uploadedImageUrl) return;
        uploadedImageUrls.push(uploadedImageUrl);
      }

      const saved = await onSave(uploadedImageUrls);
      if (!saved) return;
      for (const previewUrl of localImagesRef.current.keys()) URL.revokeObjectURL(previewUrl);
      localImagesRef.current.clear();
    } finally {
      setIsUploadingImages(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/55" onMouseDown={onClose}>
      <aside className="absolute right-0 top-0 h-full w-full overflow-auto bg-[#f7f7f5] p-4 md:w-[620px] md:p-6" onMouseDown={(event) => event.stopPropagation()}>
        <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-5 flex items-center justify-between border-b border-[var(--color-border)] bg-[#f7f7f5] px-4 py-4 md:-mx-6 md:px-6">
          <div><span className="font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.eyebrow }}>PROMOCAO</span><h2 className="mt-1 font-black" style={{ fontSize: "1.5rem" }}>{promotionKindLabel[draft.kind]}</h2></div>
          <button type="button" className="grid size-10 place-items-center border border-[var(--color-border)] bg-white" onClick={onClose} aria-label="Fechar editor de promocao"><FiX aria-hidden="true" /></button>
        </div>

        <div className="grid gap-4">
          <label className="block"><FieldLabel>NOME INTERNO</FieldLabel><input value={draft.internalName} onChange={(event) => onChange({ internalName: event.target.value })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3 outline-none" style={{ fontSize: administrationTypography.body }} placeholder="Ex.: Semana do cliente" /></label>
          <label className="flex items-center gap-3 border border-[var(--color-border)] bg-white px-3 py-3"><input type="checkbox" checked={draft.isActive} onChange={(event) => onChange({ isActive: event.target.checked })} className="size-4 accent-[var(--color-foreground)]" /><span className="font-black" style={{ fontSize: administrationTypography.action }}>CAMPANHA ATIVA</span></label>

          {draft.kind === "popup" ? <section className="border border-[var(--color-border)] bg-white p-4"><FieldLabel>FOTOS DA CAMPANHA</FieldLabel><p className="text-[var(--color-muted)]" style={{ fontSize: administrationTypography.helper }}>Selecione ate dez fotos. A primeira aparece primeiro no popup.</p><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{imageUrls.map((imageUrl, index) => <div key={imageUrl} className="relative aspect-[4/5] overflow-hidden border border-[var(--color-border)] bg-[#ededed]">{imageUrl.startsWith("blob:") ? <img src={imageUrl} alt={`Foto ${index + 1} da campanha`} className="size-full object-cover" /> : <Image src={imageUrl} alt={`Foto ${index + 1} da campanha`} fill sizes="180px" className="object-cover" />}<div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/70 p-1"><button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} className="grid size-8 place-items-center bg-white text-black disabled:opacity-40" aria-label={`Mover foto ${index + 1} para a esquerda`}><FiChevronLeft aria-hidden="true" /></button><button type="button" onClick={() => removeImage(index)} className="grid size-8 place-items-center bg-white text-[var(--color-error)]" aria-label={`Remover foto ${index + 1}`}><FiTrash2 aria-hidden="true" /></button><button type="button" onClick={() => moveImage(index, 1)} disabled={index === imageUrls.length - 1} className="grid size-8 place-items-center bg-white text-black disabled:opacity-40" aria-label={`Mover foto ${index + 1} para a direita`}><FiChevronRight aria-hidden="true" /></button></div></div>)}</div>{imageUrls.length < maximumPromotionPopupImages ? <label className="mt-3 flex min-h-12 cursor-pointer items-center justify-center gap-2 border border-dashed border-[var(--color-foreground)] px-3 font-black" style={{ fontSize: administrationTypography.action }}><FiImage aria-hidden="true" /><span>ADICIONAR FOTO ({imageUrls.length}/{maximumPromotionPopupImages})</span><input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) selectImage(file); event.currentTarget.value = ""; }} /></label> : null}</section> : null}

          {hasProductRule ? <PromotionProductRulesEditor isQuantityPromotion={draft.kind === "quantity_discount"} products={products} rules={productRules} onChange={onProductRulesChange} /> : null}

          {(draft.kind === "cart_benefit" || draft.kind === "free_shipping") ? <section className="border border-[var(--color-border)] bg-white p-4"><label className="block"><FieldLabel>MODALIDADE</FieldLabel><select value={draft.kind} onChange={(event) => onChange({ kind: event.target.value as "cart_benefit" | "free_shipping", internalName: event.target.value === "free_shipping" ? "Frete gratis" : "Beneficios do carrinho" })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3 font-black" style={{ fontSize: administrationTypography.body }}><option value="cart_benefit">DESCONTO NO CARRINHO</option><option value="free_shipping">FRETE GRATIS</option></select></label><div className="mt-4 grid gap-4 sm:grid-cols-2"><label><FieldLabel>TITULO PUBLICO</FieldLabel><input value={draft.benefitRule?.title ?? ""} onChange={(event) => onBenefitRuleChange({ title: event.target.value })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3 font-black" style={{ fontSize: administrationTypography.body }} placeholder={draft.kind === "free_shipping" ? "Frete gratis" : "10% de desconto"} /></label><label><FieldLabel>COMPRA MINIMA</FieldLabel><CurrencyInput value={draft.benefitRule?.minimumAmount ?? 0} onChange={(minimumAmount) => onBenefitRuleChange({ minimumAmount })} /></label></div><label className="mt-4 block"><FieldLabel>DESCRICAO PARA O CLIENTE</FieldLabel><textarea value={draft.benefitRule?.description ?? ""} onChange={(event) => onBenefitRuleChange({ description: event.target.value })} className="min-h-24 w-full border border-[var(--color-border)] bg-white px-3 py-3 outline-none" style={{ fontSize: administrationTypography.body }} placeholder="Ex.: Valido para pedidos acima de R$ 150." /></label>{draft.kind === "cart_benefit" ? <div className="mt-4 grid gap-4 sm:grid-cols-2"><label><FieldLabel>TIPO</FieldLabel><select value={draft.benefitRule?.discountType ?? "percentage"} onChange={(event) => onBenefitRuleChange({ discountType: event.target.value as "percentage" | "fixed_amount" })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }}><option value="percentage">PORCENTAGEM</option><option value="fixed_amount">VALOR EM REAIS</option></select></label><label><FieldLabel>DESCONTO</FieldLabel><CurrencyInput value={draft.benefitRule?.discountValue ?? 0} onChange={(discountValue) => onBenefitRuleChange({ discountValue })} /></label></div> : <p className="mt-4 text-[var(--color-muted)]" style={{ fontSize: administrationTypography.body }}>O frete sera destacado na mensagem do WhatsApp e confirmado pela loja.</p>}</section> : null}

          <div className="grid grid-cols-2 gap-3">{!isNew ? <button type="button" onClick={onDelete} disabled={isSaving || isUploadingImages} className="flex h-11 items-center justify-center gap-2 border-2 border-[var(--color-error)] bg-white font-black text-[var(--color-error)]" style={{ fontSize: administrationTypography.action }}><FiTrash2 aria-hidden="true" />EXCLUIR</button> : <button type="button" onClick={onClose} className="h-11 border-2 border-[var(--color-foreground)] bg-white font-black" style={{ fontSize: administrationTypography.action }}>CANCELAR</button>}<button type="button" onClick={() => void savePromotion()} disabled={isSaving || isUploadingImages} className="h-11 bg-[var(--color-lime)] font-black disabled:opacity-60" style={{ fontSize: administrationTypography.action }}>{isSaving || isUploadingImages ? "SALVANDO..." : "SALVAR PROMOCAO"}</button></div>
        </div>
      </aside>
      {pendingImage ? <ImageCropModal imageUrl={pendingImage.previewUrl} crop={pendingImage.crop} title="Recorte da campanha" isApplying={isApplyingCrop} onCropChange={(patch) => setPendingImage((current) => current ? { ...current, crop: { ...current.crop, ...patch } } : current)} onCancel={closeCrop} onApply={applyCrop} /> : null}
    </div>
  );
}
