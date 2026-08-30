"use client";

import Image from "next/image";

import { catalogProductImageAspectRatio } from "@/core/theme/catalog";
import { catalogTypography } from "@/core/theme/tokens";
import { formatCurrency } from "@/core/utils/format/currency";
import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";

type ProductCardProps = {
  product: CatalogProduct;
  onOpen(product: CatalogProduct): void;
};

export function ProductCard({ product, onOpen }: ProductCardProps) {
  return (
    <button className="bg-white text-left" onClick={() => onOpen(product)}>
      <div
        className="relative overflow-hidden bg-[#eee]"
        style={{ aspectRatio: catalogProductImageAspectRatio }}
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-200 hover:scale-[1.025]"
          />
        ) : null}
        {product.badge ? (
          <span className="absolute bottom-[5px] left-[5px] bg-[var(--color-lime)] px-[5px] py-[3px] font-black" style={{ fontSize: catalogTypography.listingItem }}>
            {product.badge}
          </span>
        ) : null}
      </div>
      <div>
        <h3 className="mb-1 mt-[9px] font-bold" style={{ fontSize: catalogTypography.listingItem }}>{product.name}</h3>
        <p className="mb-[7px] text-[var(--color-muted)]" style={{ fontSize: catalogTypography.listingItem }}>{product.color}</p>
        <strong style={{ fontSize: catalogTypography.listingItem }}>{formatCurrency(product.price)}</strong>
        <small className="mt-[7px] block font-extrabold text-[var(--color-stock)]" style={{ fontSize: catalogTypography.listingItem }}>EM ESTOQUE</small>
      </div>
    </button>
  );
}
