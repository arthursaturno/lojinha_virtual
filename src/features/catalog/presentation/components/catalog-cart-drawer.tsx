"use client";

import { useState } from "react";
import Image from "next/image";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiX } from "react-icons/fi";

import type { PromotionCouponValidation } from "@/core/promotions/promotion";
import { catalogTypography } from "@/core/theme/tokens";
import { formatCurrency } from "@/core/utils/format/currency";
import type { CatalogCartItem } from "@/features/catalog/domain/entities/catalog-cart-item";
import { WhatsAppLabel } from "@/features/catalog/presentation/components/whatsapp-label";

type CatalogCartDrawerProps = {
  isOpen: boolean;
  items: CatalogCartItem[];
  couponCode: string;
  couponValidation?: PromotionCouponValidation;
  formattedTotal: string;
  onClose(): void;
  onCouponChange(value: string): void;
  onApplyCoupon(): void;
  onItemQuantityChange(itemId: string, quantity: number): void;
  onRemoveItem(itemId: string): void;
  onContactSeller(): Promise<void>;
};

export function CatalogCartDrawer({
  isOpen,
  items,
  couponCode,
  couponValidation,
  formattedTotal,
  onClose,
  onCouponChange,
  onApplyCoupon,
  onItemQuantityChange,
  onRemoveItem,
  onContactSeller,
}: CatalogCartDrawerProps) {
  const [isContactingSeller, setIsContactingSeller] = useState(false);

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

            <section className="border-y border-[var(--color-border)] py-4">
              <label className="block font-black" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>CUPOM DE DESCONTO</label>
              <div className="mt-2 flex gap-2">
                <input value={couponCode} onChange={(event) => onCouponChange(event.target.value)} className="h-11 min-w-0 flex-1 border border-[var(--color-border)] px-3 font-black uppercase outline-none" style={{ fontSize: catalogTypography.purchaseDrawerItem }} placeholder="DIGITE O CUPOM" />
                <button type="button" onClick={onApplyCoupon} className="h-11 border-2 border-[var(--color-foreground)] px-3 font-black" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>APLICAR</button>
              </div>
              {couponValidation ? <p className={couponValidation.isValid ? "mt-2 font-black text-[var(--color-stock)]" : "mt-2 font-black text-[var(--color-error)]"} style={{ fontSize: catalogTypography.purchaseDrawerItem }}>{couponValidation.message}</p> : null}
            </section>

            {couponValidation?.isValid ? (
              <div className="mt-4 grid gap-2 border-b border-[var(--color-border)] pb-4" style={{ fontSize: catalogTypography.purchaseDrawerItem }}>
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(couponValidation.originalTotal)}</span></div>
                {couponValidation.productDiscount > 0 ? <div className="flex justify-between text-[var(--color-stock)]"><span>Oferta da loja</span><span>- {formatCurrency(couponValidation.productDiscount)}</span></div> : null}
                {couponValidation.couponCode ? <div className="flex justify-between text-[var(--color-stock)]"><span>Cupom {couponValidation.couponCode}</span><span>- {formatCurrency(couponValidation.couponDiscount)}</span></div> : null}
                {couponValidation.hasFreeShipping ? <p className="font-black text-[var(--color-stock)]">FRETE GRATIS: confirme a entrega com o vendedor.</p> : null}
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
