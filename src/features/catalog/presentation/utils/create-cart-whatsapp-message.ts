import type { PromotionCartValidation } from "@/core/promotions/promotion";
import { formatCurrency } from "@/core/utils/format/currency";
import type { CatalogCartItem } from "@/features/catalog/domain/entities/catalog-cart-item";

type CreateCartWhatsAppMessageInput = {
  items: CatalogCartItem[];
  promotion: PromotionCartValidation;
  storeUrl: string;
};

export function createCartWhatsAppMessage({ items, promotion, storeUrl }: CreateCartWhatsAppMessageInput): string {
  const itemLines = items.flatMap((item) => [
    `- ${item.name}`,
    `  ${item.size} | ${item.color} | ${item.model}`,
    `  ${item.quantity} x ${formatCurrency(item.unitPrice)}`,
  ]);
  const discount = promotion.productDiscount + promotion.benefitDiscount;
  const promotionLines = [
    `Subtotal: ${formatCurrency(promotion.originalTotal)}`,
    promotion.productDiscount > 0 ? `Oferta da loja: - ${formatCurrency(promotion.productDiscount)}` : "",
    promotion.benefitTitle ? `Beneficio selecionado: ${promotion.benefitTitle}` : "",
    promotion.benefitDiscount > 0 ? `Desconto do beneficio: - ${formatCurrency(promotion.benefitDiscount)}` : "",
    promotion.shippingAmount > 0 ? `Frete: ${formatCurrency(promotion.shippingAmount)}` : "",
    promotion.shippingDiscount > 0 ? `Frete gratis: - ${formatCurrency(promotion.shippingDiscount)}` : "",
    discount > 0 ? `Descontos: - ${formatCurrency(discount)}` : "",
  ];

  return [
    "Ola! Tenho interesse nestes itens:",
    "",
    ...itemLines,
    "",
    ...promotionLines,
    `Total estimado: ${formatCurrency(promotion.finalTotal)}`,
    `Link: ${storeUrl}`,
  ].filter(Boolean).join("\n");
}

export function createWhatsAppUrl(phone: string, message: string): string | null {
  const normalizedPhone = phone.replace(/\D/g, "");

  if (!normalizedPhone) return null;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
