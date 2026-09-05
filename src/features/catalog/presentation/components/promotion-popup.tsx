"use client";

import Image from "next/image";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

import type { StorePromotion } from "@/core/promotions/promotion";

type PromotionPopupProps = {
  promotion: StorePromotion | null;
  onClose(): void;
};

export function PromotionPopup({ promotion, onClose }: PromotionPopupProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const imageUrls = promotion?.imageUrls?.length ? promotion.imageUrls : promotion?.imageUrl ? [promotion.imageUrl] : [];
  const currentImage = imageUrls[imageIndex] ?? imageUrls[0];

  if (!promotion || !currentImage) return null;

  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onMouseDown={onClose}>
    <section className="relative w-full max-w-[420px] bg-white" onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" onClick={onClose} className="absolute right-2 top-2 z-10 grid size-10 place-items-center bg-white text-black" aria-label="Fechar promocao"><FiX aria-hidden="true" className="text-xl" /></button>
      <div className="relative aspect-[4/5] w-full"><Image src={currentImage} alt={`Campanha da loja ${imageIndex + 1}`} fill sizes="(max-width: 768px) calc(100vw - 32px), 420px" className="object-cover" priority />{imageUrls.length > 1 ? <><button type="button" onClick={() => setImageIndex((current) => current === 0 ? imageUrls.length - 1 : current - 1)} className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center bg-white text-black" aria-label="Foto anterior"><FiChevronLeft aria-hidden="true" className="text-xl" /></button><button type="button" onClick={() => setImageIndex((current) => current === imageUrls.length - 1 ? 0 : current + 1)} className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center bg-white text-black" aria-label="Proxima foto"><FiChevronRight aria-hidden="true" className="text-xl" /></button><span className="absolute bottom-2 left-2 bg-black/75 px-2 py-1 font-black text-white">{imageIndex + 1}/{imageUrls.length}</span></> : null}</div>
    </section>
  </div>;
}
