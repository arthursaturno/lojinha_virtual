import { describe, expect, it } from "vitest";

import { createCartWhatsAppMessage, createWhatsAppUrl } from "@/features/catalog/presentation/utils/create-cart-whatsapp-message";

describe("createCartWhatsAppMessage", () => {
  it("includes cart values and applied coupon details", () => {
    const message = createCartWhatsAppMessage({
      items: [{
        id: "item-1",
        productId: "product-1",
        variantId: "variant-1",
        name: "Camiseta Essential",
        imageUrl: "",
        size: "M",
        color: "Preto",
        model: "Regular",
        unitPrice: 100,
        quantity: 2,
        availableQuantity: 8,
      }],
      promotion: {
        isValid: true,
        message: "Cupom aplicado.",
        couponCode: "BEMVINDO",
        originalTotal: 200,
        productDiscount: 20,
        couponDiscount: 10,
        finalTotal: 170,
        hasFreeShipping: true,
      },
      storeUrl: "https://ezzionimports.com",
    });

    expect(message).toContain("2 x R$ 100,00");
    expect(message).toContain("Cupom aplicado: BEMVINDO");
    expect(message).toContain("Descontos: - R$ 30,00");
    expect(message).toContain("Total estimado: R$ 170,00");
  });

  it("normalizes the WhatsApp phone number", () => {
    expect(createWhatsAppUrl("+55 (11) 99999-9999", "Ola")).toBe("https://wa.me/5511999999999?text=Ola");
    expect(createWhatsAppUrl("", "Ola")).toBeNull();
  });
});
