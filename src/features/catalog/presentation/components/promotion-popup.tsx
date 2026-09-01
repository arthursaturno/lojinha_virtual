"use client";

import Image from "next/image";
import { FiX } from "react-icons/fi";

import type { StorePromotion } from "@/core/promotions/promotion";

type PromotionPopupProps = {
  promotion: StorePromotion | null;
  onClose(): void;
};

export function PromotionPopup({ promotion, onClose }: PromotionPopupProps) {
  if (!promotion?.imageUrl) return null;

  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onMouseDown={onClose}>
    <section className="relative w-full max-w-[420px] bg-white" onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" onClick={onClose} className="absolute right-2 top-2 z-10 grid size-10 place-items-center bg-white text-black" aria-label="Fechar promocao"><FiX aria-hidden="true" className="text-xl" /></button>
      <div className="relative aspect-[4/5] w-full"><Image src={promotion.imageUrl} alt="Campanha da loja" fill sizes="(max-width: 768px) calc(100vw - 32px), 420px" className="object-cover" priority /></div>
    </section>
  </div>;
}
