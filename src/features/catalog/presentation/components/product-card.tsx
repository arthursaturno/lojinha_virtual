"use client";

import Image from "next/image";

import { formatCurrency } from "@/core/utils/format/currency";
import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";

type ProductCardProps = {
  product: CatalogProduct;
  onOpen(product: CatalogProduct): void;
};

export function ProductCard({ product, onOpen }: ProductCardProps) {
  return (
    <button className="bg-white text-left" onClick={() => onOpen(product)}>
      <div className="relative h-[205px] overflow-hidden bg-[#eee] md:h-[236px]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-200 hover:scale-[1.025]"
        />
        {product.badge ? (
          <span className="absolute bottom-[5px] left-[5px] bg-[var(--color-lime)] px-[5px] py-[3px] text-[8px] font-black">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div>
        <h3 className="mb-1 mt-[9px] text-[11px] font-bold">{product.name}</h3>
        <p className="mb-[7px] text-[10px] text-[var(--color-muted)]">{product.color}</p>
        <strong className="text-[11px]">{formatCurrency(product.price)}</strong>
        <small className="mt-[7px] block text-[8px] font-extrabold text-[var(--color-stock)]">EM ESTOQUE</small>
      </div>
    </button>
  );
}
