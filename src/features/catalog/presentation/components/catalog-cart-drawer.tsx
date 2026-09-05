"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiChevronUp, FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiX } from "react-icons/fi";

import type { PromotionCartBenefit, PromotionCartValidation } from "@/core/promotions/promotion";
import { catalogTypography } from "@/core/theme/tokens";
import { formatCurrency } from "@/core/utils/format/currency";
import type { CatalogCartItem } from "@/features/catalog/domain/entities/catalog-cart-item";
import { WhatsAppLabel } from "@/features/catalog/presentation/components/whatsapp-label";

type CatalogCartDrawerProps = {
  isOpen: boolean;
  items: CatalogCartItem[];
  availableBenefits: PromotionCartBenefit[];
  selectedBenefitId?: string;
  promotionValidation?: PromotionCartValidation;
  cartMessage?: string;
  formattedTotal: string;
  onClose(): void;
  onSelectBenefit(id?: string): void;
  onItemQuantityChange(itemId: string, quantity: number): void;
  onRemoveItem(itemId: string): void;
  onContactSeller(): Promise<void>;
};

export function CatalogCartDrawer({
  isOpen,
  items,
  availableBenefits,
  selectedBenefitId,
  promotionValidation,
  cartMessage,
  formattedTotal,
  onClose,
  onSelectBenefit,
  onItemQuantityChange,
  onRemoveItem,
  onContactSeller,
}: CatalogCartDrawerProps) {
  const [isContactingSeller, setIsContactingSeller] = useState(false);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);

  if (!isOpen) return null;

  async function handleContactSeller() {
    if (isContactingSeller) return;

    setIsContactingSeller(true);
    try {
      await onContactSeller();
    } finally {
      setIsContactingSeller(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/55" onMouseDown={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-full overflow-auto bg-white px-4 py-4 md:w-[420px] md:px-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-2">
            <FiShoppingBag aria-hidden="true" />
            <h2 className="font-black" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>
              SEU CARRINHO ({items.length})
            </h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center" aria-label="Fechar carrinho">
            <FiX aria-hidden="true" className="text-xl" />
          </button>
        </div>

        {items.length ? (
          <>
            <div className="divide-y divide-[var(--color-border)]">
              {items.map((item) => (
                <article key={item.id} className="grid grid-cols-[72px_1fr] gap-3 py-4">
                  {item.imageUrl ? (
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#eee]">
                      <Image src={item.imageUrl} alt={item.name} fill sizes="72px" className="object-cover" />
                    </div>
                  ) : <div className="aspect-[4/5] bg-[#eee]" />}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <strong className="block font-black" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>{item.name}</strong>
                        <span className="mt-1 block text-[var(--color-muted)]" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>
                          {item.size} | {item.color} | {item.model}
                        </span>
                      </div>
                      <button type="button" onClick={() => onRemoveItem(item.id)} className="grid size-8 place-items-center text-[var(--color-error)]" aria-label={`Remover ${item.name}`}>
                        <FiTrash2 aria-hidden="true" />
                      </button>
                    </div>
                    <strong className="mt-2 block" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>{formatCurrency(item.unitPrice)}</strong>
                    <div className="mt-3 flex h-9 w-[120px] items-center border border-[var(--color-border)]">
                      <button type="button" onClick={() => onItemQuantityChange(item.id, item.quantity - 1)} className="grid size-9 place-items-center" disabled={item.quantity <= 1} aria-label={`Diminuir quantidade de ${item.name}`}>
                        <FiMinus aria-hidden="true" />
                      </button>
                      <span className="grid flex-1 place-items-center font-black" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>{item.quantity}</span>
                      <button type="button" onClick={() => onItemQuantityChange(item.id, item.quantity + 1)} className="grid size-9 place-items-center" disabled={item.quantity >= item.availableQuantity} aria-label={`Aumentar quantidade de ${item.name}`}>
                        <FiPlus aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {availableBenefits.length ? <section className="border-y border-[var(--color-border)] py-4">
              <button type="button" onClick={() => setIsBenefitsOpen((current) => !current)} className="flex w-full items-center justify-between border border-[var(--color-border)] bg-white px-3 py-4 text-left">
                <span><strong className="block font-black" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>BENEFICIOS DISPONIVEIS</strong><span className="mt-1 block text-[var(--color-muted)]" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>{availableBenefits.length} opcao(oes) para esta compra</span></span>
                {isBenefitsOpen ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
              </button>
              {isBenefitsOpen ? <div className="mt-3 grid gap-2">
                {availableBenefits.map((benefit) => {
                  const isSelected = selectedBenefitId === benefit.id;
                  return <button key={benefit.id} type="button" onClick={() => onSelectBenefit(isSelected ? undefined : benefit.id)} className={`border p-3 text-left ${isSelected ? "border-black bg-[var(--color-lime)]" : "border-[var(--color-border)] bg-white"}`}>
                    <strong className="block font-black" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>{benefit.title}</strong>
                    <span className="mt-1 block text-[var(--color-muted)]" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>{benefit.description}</span>
                  </button>;
                })}
              </div> : null}
              {cartMessage ? <p className={promotionValidation?.isValid ? "mt-3 font-black text-[var(--color-stock)]" : "mt-3 font-black text-[var(--color-error)]"} style={{ fontSize: catalogTypography.purchaseDrawerItem }}>{cartMessage}</p> : null}
            </section> : null}

            {promotionValidation?.isValid ? (
              <div className="mt-4 grid gap-2 border-b border-[var(--color-border)] pb-4" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(promotionValidation.originalTotal)}</span></div>
                <div className="flex justify-between"><span>Frete</span><span>{formatCurrency(promotionValidation.hasFreeShipping ? promotionValidation.shippingDiscount : promotionValidation.shippingAmount)}</span></div>
                {promotionValidation.productDiscount > 0 ? <div className="flex justify-between text-[var(--color-stock)]"><span>Oferta da loja</span><span>- {formatCurrency(promotionValidation.productDiscount)}</span></div> : null}
                {promotionValidation.benefitTitle && !promotionValidation.hasFreeShipping ? <div className="flex justify-between text-[var(--color-stock)]"><span>{promotionValidation.benefitTitle}</span><span>- {formatCurrency(promotionValidation.benefitDiscount)}</span></div> : null}
                {promotionValidation.hasFreeShipping ? <div className="flex justify-between text-[var(--color-stock)]"><span>Frete gratis</span><span>{formatCurrency(promotionValidation.shippingAmount)}</span></div> : null}
              </div>
            ) : null}

            <div className="mt-4 flex items-center justify-between bg-[#f7f7f5] px-3 py-4">
              <strong style={{ fontSize: catalogTypography.purchaseDrawerItem }}>TOTAL</strong>
              <strong className="text-xl">{formattedTotal}</strong>
            </div>
            <button type="button" onClick={handleContactSeller} disabled={isContactingSeller} className="mt-4 flex h-12 w-full items-center justify-center bg-[var(--color-lime)] font-black disabled:cursor-wait disabled:opacity-60" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>
              <WhatsAppLabel>{isContactingSeller ? "PREPARANDO PEDIDO..." : "FALAR NO WHATSAPP"}</WhatsAppLabel>
            </button>
          </>
        ) : (
          <div className="grid min-h-[60vh] place-items-center text-center"><p className="text-[var(--color-muted)]" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>Seu carrinho esta vazio.</p></div>
        )}
      </aside>
    </div>
  );
}
