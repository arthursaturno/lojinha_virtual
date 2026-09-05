"use client";

import { FiPlus, FiTrash2 } from "react-icons/fi";

import type { PromotionDiscountType, PromotionProductRule, PromotionTargetType } from "@/core/promotions/promotion";
import { administrationTypography } from "@/core/theme/tokens";
import type { PromotionProductOption } from "@/features/promotions/presentation/viewmodels/promotions-view-state";
import {
  promotionDiscountTypeLabel,
  promotionTargetTypeLabel,
} from "@/features/promotions/presentation/viewmodels/promotions-view-state";

type PromotionProductRulesEditorProps = {
  isQuantityPromotion: boolean;
  products: PromotionProductOption[];
  rules: PromotionProductRule[];
  onChange(rules: PromotionProductRule[]): void;
};

function FieldLabel({ children }: { children: string }) {
  return <span className="mb-2 block font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.fieldLabel }}>{children}</span>;
}

function createRule(isQuantityPromotion: boolean): PromotionProductRule {
  return {
    targetType: "product",
    productId: "",
    discountType: isQuantityPromotion ? "fixed_amount" : "percentage",
    discountValue: isQuantityPromotion ? 0 : 10,
    buyQuantity: isQuantityPromotion ? 3 : undefined,
    payQuantity: isQuantityPromotion ? 2 : undefined,
  };
}

export function PromotionProductRulesEditor({ isQuantityPromotion, products, rules, onChange }: PromotionProductRulesEditorProps) {
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
  const brands = [...new Set(products.map((product) => product.brand).filter((brand): brand is string => Boolean(brand)))];

  function updateRule(index: number, patch: Partial<PromotionProductRule>) {
    onChange(rules.map((rule, ruleIndex) => ruleIndex === index ? { ...rule, ...patch } : rule));
  }

  return <section className="border border-[var(--color-border)] bg-white p-4">
    <div className="flex items-center justify-between gap-3"><FieldLabel>{isQuantityPromotion ? "REGRAS LEVE X, PAGUE Y" : "ITENS COM DESCONTO"}</FieldLabel><button type="button" onClick={() => onChange([...rules, createRule(isQuantityPromotion)])} className="flex h-9 items-center gap-2 bg-[var(--color-lime)] px-3 font-black" style={{ fontSize: administrationTypography.action }}><FiPlus aria-hidden="true" />ADICIONAR ITEM</button></div>
    <div className="mt-3 grid gap-4">{rules.map((rule, index) => <div key={rule.id ?? `${rule.targetType}-${index}`} className="border border-[var(--color-border)] p-3"><div className="mb-3 flex items-center justify-between gap-3"><strong className="font-black" style={{ fontSize: administrationTypography.body }}>ITEM {index + 1}</strong><button type="button" onClick={() => onChange(rules.filter((_, ruleIndex) => ruleIndex !== index))} disabled={rules.length === 1} className="grid size-9 place-items-center border border-[var(--color-error)] text-[var(--color-error)] disabled:opacity-40" aria-label={`Remover item ${index + 1}`}><FiTrash2 aria-hidden="true" /></button></div><div className="grid gap-4 sm:grid-cols-2"><label><FieldLabel>ALVO DA OFERTA</FieldLabel><select value={rule.targetType} onChange={(event) => updateRule(index, { targetType: event.target.value as PromotionTargetType, productId: "", targetValue: "" })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }}>{(Object.keys(promotionTargetTypeLabel) as PromotionTargetType[]).map((type) => <option key={type} value={type}>{promotionTargetTypeLabel[type]}</option>)}</select></label><label><FieldLabel>{rule.targetType === "product" ? "PRODUTO" : rule.targetType === "category" ? "CATEGORIA" : "MARCA"}</FieldLabel><select value={rule.targetType === "product" ? rule.productId ?? "" : rule.targetValue ?? ""} onChange={(event) => updateRule(index, rule.targetType === "product" ? { productId: event.target.value } : { targetValue: event.target.value })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }}><option value="">Selecione uma opcao</option>{(rule.targetType === "product" ? products.map((product) => ({ value: product.id, label: product.name })) : (rule.targetType === "category" ? categories : brands).map((value) => ({ value, label: value }))).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div>{isQuantityPromotion ? <div className="mt-4 grid grid-cols-2 gap-4"><label><FieldLabel>LEVE</FieldLabel><input type="number" min="2" value={rule.buyQuantity ?? 3} onChange={(event) => updateRule(index, { buyQuantity: Number(event.target.value) })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }} /></label><label><FieldLabel>PAGUE</FieldLabel><input type="number" min="1" value={rule.payQuantity ?? 2} onChange={(event) => updateRule(index, { payQuantity: Number(event.target.value) })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }} /></label></div> : <div className="mt-4 grid gap-4 sm:grid-cols-2"><label><FieldLabel>TIPO DE DESCONTO</FieldLabel><select value={rule.discountType} onChange={(event) => updateRule(index, { discountType: event.target.value as PromotionDiscountType })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }}>{(Object.keys(promotionDiscountTypeLabel) as PromotionDiscountType[]).map((type) => <option key={type} value={type}>{promotionDiscountTypeLabel[type]}</option>)}</select></label><label><FieldLabel>VALOR</FieldLabel><input type="number" min="0" step="0.01" value={rule.discountValue} onChange={(event) => updateRule(index, { discountValue: Number(event.target.value) })} className="h-11 w-full border border-[var(--color-border)] bg-white px-3" style={{ fontSize: administrationTypography.body }} /></label></div>}</div>)}</div>
  </section>;
}
