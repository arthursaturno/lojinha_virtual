"use client";

import Image from "next/image";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";

import { catalogProductImageAspectRatio } from "@/core/theme/catalog";
import { administrationLayout, administrationTypography } from "@/core/theme/tokens";
import { getProductImageCropOffsetPercentage, productImageCropOffsetLimit } from "@/core/utils/images/create-product-image-upload";

export type ImageCrop = { zoom: number; offsetX: number; offsetY: number };

type ImageCropModalProps = {
  imageUrl: string;
  crop: ImageCrop;
  title: string;
  isApplying: boolean;
  onCropChange(patch: Partial<ImageCrop>): void;
  onCancel(): void;
  onApply(): void;
};

export function ImageCropModal({ imageUrl, crop, title, isApplying, onCropChange, onCancel, onApply }: ImageCropModalProps) {
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  return <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 p-4 overscroll-contain" onMouseDown={onCancel}>
    <div className="mx-auto my-4 w-full border border-[var(--color-border)] bg-[#f7f7f5] p-4 md:my-8 md:p-6" style={{ maxWidth: administrationLayout.cropModalMaxWidth }} onMouseDown={(event) => event.stopPropagation()}>
      <div className="mb-4 flex items-start justify-between gap-4"><div><span className="font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.eyebrow }}>AJUSTE DE FOTO</span><h3 className="mt-1 font-black text-[var(--color-foreground)]" style={{ fontSize: "clamp(1.25rem, 1.16rem + 0.35vw, 1.5rem)" }}>{title}</h3></div><button type="button" className="grid size-10 place-items-center border border-[var(--color-border)] bg-white" onClick={onCancel} aria-label="Fechar ajuste da foto"><FiX aria-hidden="true" className="text-lg" /></button></div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="relative w-full overflow-hidden border border-[var(--color-border)] bg-[#f3f3f3]" style={{ aspectRatio: catalogProductImageAspectRatio }}><Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) calc(100vw - 32px), 720px" className="object-cover" style={{ transform: `translate(${getProductImageCropOffsetPercentage(crop.offsetX)}%, ${getProductImageCropOffsetPercentage(crop.offsetY)}%) scale(${crop.zoom})`, transformOrigin: "center" }} unoptimized /></div><div className="border border-[var(--color-border)] bg-white p-4 md:p-5" style={{ maxWidth: administrationLayout.cropControlsWidth }}><div className="grid gap-4"><label><span className="mb-1 block font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.fieldLabel }}>ZOOM DO RECORTE</span><input type="range" min="1" max="2.6" step="0.1" value={crop.zoom} onChange={(event) => onCropChange({ zoom: Number(event.target.value) })} className="w-full accent-black" /></label><label><span className="mb-1 block font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.fieldLabel }}>AJUSTE HORIZONTAL</span><input type="range" min={-productImageCropOffsetLimit} max={productImageCropOffsetLimit} step="2" value={crop.offsetX} onChange={(event) => onCropChange({ offsetX: Number(event.target.value) })} className="w-full accent-black" /></label><label><span className="mb-1 block font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.fieldLabel }}>AJUSTE VERTICAL</span><input type="range" min={-productImageCropOffsetLimit} max={productImageCropOffsetLimit} step="2" value={crop.offsetY} onChange={(event) => onCropChange({ offsetY: Number(event.target.value) })} className="w-full accent-black" /></label></div><div className="mt-5 flex justify-end gap-2"><button type="button" className="h-11 border border-[var(--color-border)] bg-white px-4 font-black" style={{ fontSize: administrationTypography.action }} onClick={onCancel}>CANCELAR</button><button type="button" className="h-11 bg-[var(--color-lime)] px-4 font-black text-black" style={{ fontSize: administrationTypography.action }} onClick={onApply} disabled={isApplying}>{isApplying ? "PREPARANDO..." : "USAR RECORTE"}</button></div></div></div>
    </div>
  </div>;
}
