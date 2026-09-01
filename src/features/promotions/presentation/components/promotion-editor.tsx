"use client";

import Image from "next/image";
import { FiImage, FiTrash2, FiX } from "react-icons/fi";

import type { PromotionDiscountType } from "@/core/promotions/promotion";
import { administrationTypography } from "@/core/theme/tokens";
import type { PromotionProductOption, PromotionSaveStatus } from "@/features/promotions/presentation/viewmodels/promotions-view-state";
import { promotionDiscountTypeLabel, promotionKindLabel, type PromotionDraft } from "@/features/promotions/presentation/viewmodels/promotions-view-state";

type PromotionEditorProps = {
  draft: PromotionDraft;
  products: PromotionProductOption[];
  saveStatus: PromotionSaveStatus;
  onClose(): void;
  onSave(): void;
  onDelete(): void;
  onChange(patch: Partial<PromotionDraft>): void;
  onProductRuleChange(patch: { productId?: string; discountType?: PromotionDiscountType; discountValue?: number; buyQuantity?: number; payQuantity?: number }): void;
  onCouponRuleChange(patch: { code?: string; minimumAmount?: number; discountType?: "percentage" | "fixed_amount"; discountValue?: number }): void;
  onImageUpload(file: File): void;
};

function FieldLabel({ children }: { children: string }) {
  return <span className="mb-2 block font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.fieldLabel }}>{children}</span>;
}

export function PromotionEditor({ draft, products, saveStatus, onClose, onSave, onDelete, onChange, onProductRuleChange, onCouponRuleChange, onImageUpload }: PromotionEditorProps) {
  const isNew = draft.id.startsWith("draft-");
  const isSaving = saveStatus === "loading";
  const hasProductRule = draft.kind === "product_discount" || draft.kind === "quantity_discount";

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

          {draft.kind === "popup" ? <section className="border border-[var(--color-border)] bg-white p-4"><FieldLabel>IMAGEM DA CAMPANHA</FieldLabel><label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 border border-dashed border-[var(--color-foreground)] px-3 font-black" style={{ fontSize: administrationTypography.action }}><FiImage aria-hidden="true" /><span>{draft.imageUrl ? "TROCAR FOTO" : "ENVIAR FOTO"}</span><input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) onImageUpload(file); }} /></label>{draft.imageUrl ? <div className="relative mt-3 aspect-[4/5] w-full overflow-hidden bg-[#ededed]"><Image src={draft.imageUrl} alt="Preview da campanha" fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" /></div> : null}</section> : null}

          {hasProductRule && draft.productRule ? <section className="border border-[var(--color-border)] bg-white p-4"><FieldLabel>PRODUTO DA OFERTA</FieldLabel><select value={draft.productRule.productId} onChange={(event) => onProductRuleChange({ productId: event.target.value })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }}><option value="">Selecione o produto</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select>{draft.kind === "product_discount" ? <div className="mt-4 grid gap-4 sm:grid-cols-2"><label><FieldLabel>TIPO DE DESCONTO</FieldLabel><select value={draft.productRule.discountType} onChange={(event) => onProductRuleChange({ discountType: event.target.value as PromotionDiscountType })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }}>{(Object.keys(promotionDiscountTypeLabel) as PromotionDiscountType[]).map((type) => <option key={type} value={type}>{promotionDiscountTypeLabel[type]}</option>)}</select></label><label><FieldLabel>VALOR</FieldLabel><input type="number" min="0" step="0.01" value={draft.productRule.discountValue} onChange={(event) => onProductRuleChange({ discountValue: Number(event.target.value) })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }} /></label></div> : <div className="mt-4 grid grid-cols-2 gap-4"><label><FieldLabel>LEVE</FieldLabel><input type="number" min="2" value={draft.productRule.buyQuantity ?? 3} onChange={(event) => onProductRuleChange({ buyQuantity: Number(event.target.value) })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }} /></label><label><FieldLabel>PAGUE</FieldLabel><input type="number" min="1" value={draft.productRule.payQuantity ?? 2} onChange={(event) => onProductRuleChange({ payQuantity: Number(event.target.value) })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }} /></label></div>}</section> : null}

          {draft.kind === "coupon" && draft.couponRule ? <section className="border border-[var(--color-border)] bg-white p-4"><div className="grid gap-4 sm:grid-cols-2"><label><FieldLabel>CODIGO</FieldLabel><input value={draft.couponRule.code} onChange={(event) => onCouponRuleChange({ code: event.target.value.toUpperCase().replace(/\s/g, "") })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3 font-black uppercase" style={{ fontSize: administrationTypography.body }} placeholder="BEMVINDO10" /></label><label><FieldLabel>COMPRA MINIMA</FieldLabel><input type="number" min="0" step="0.01" value={draft.couponRule.minimumAmount} onChange={(event) => onCouponRuleChange({ minimumAmount: Number(event.target.value) })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }} /></label><label><FieldLabel>TIPO</FieldLabel><select value={draft.couponRule.discountType} onChange={(event) => onCouponRuleChange({ discountType: event.target.value as "percentage" | "fixed_amount" })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }}><option value="percentage">PORCENTAGEM</option><option value="fixed_amount">VALOR EM REAIS</option></select></label><label><FieldLabel>DESCONTO</FieldLabel><input type="number" min="0" step="0.01" value={draft.couponRule.discountValue} onChange={(event) => onCouponRuleChange({ discountValue: Number(event.target.value) })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }} /></label></div></section> : null}

          {draft.kind === "free_shipping" ? <section className="border border-[var(--color-border)] bg-white p-4"><p className="text-[var(--color-muted)]" style={{ fontSize: administrationTypography.body }}>A campanha informara frete gratis na mensagem de WhatsApp. Confirme as condicoes de entrega com o cliente antes de finalizar a venda.</p></section> : null}

          <div className="grid grid-cols-2 gap-3"><button type="button" onClick={onSave} disabled={isSaving} className="h-11 bg-[var(--color-lime)] font-black disabled:opacity-60" style={{ fontSize: administrationTypography.action }}>{isSaving ? "SALVANDO..." : "SALVAR PROMOCAO"}</button>{!isNew ? <button type="button" onClick={onDelete} disabled={isSaving} className="flex h-11 items-center justify-center gap-2 border-2 border-[var(--color-error)] bg-white font-black text-[var(--color-error)]" style={{ fontSize: administrationTypography.action }}><FiTrash2 aria-hidden="true" />EXCLUIR</button> : <button type="button" onClick={onClose} className="h-11 border-2 border-[var(--color-foreground)] bg-white font-black" style={{ fontSize: administrationTypography.action }}>CANCELAR</button>}</div>
        </div>
      </aside>
    </div>
  );
}
