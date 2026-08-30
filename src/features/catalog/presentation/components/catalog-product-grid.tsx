"use client";

import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import { catalogTypography } from "@/core/theme/tokens";
import { ProductCard } from "@/features/catalog/presentation/components/product-card";
import type { CatalogSortOption } from "@/features/catalog/presentation/viewmodels/catalog-view-state";

type CatalogProductGridProps = {
  products: CatalogProduct[];
  totalProducts: number;
  sort: CatalogSortOption;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onSortChange(sort: CatalogSortOption): void;
  onPageChange(page: number): void;
  onOpenProduct(product: CatalogProduct): void;
};

export function CatalogProductGrid({
  products,
  totalProducts,
  sort,
  currentPage,
  totalPages,
  pageSize,
  onSortChange,
  onPageChange,
  onOpenProduct,
}: CatalogProductGridProps) {
  const firstItem = totalProducts === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalProducts);

  return (
    <section className="px-3 pb-[90px] md:px-[22px] md:pb-10">
      <div className="flex h-[50px] items-center justify-between md:h-[51px]" style={{ fontSize: catalogTypography.listingItem }}>
        <strong>
          {totalProducts} produtos encontrados
          {totalProducts > 0 ? ` (${firstItem}-${lastItem})` : ""}
        </strong>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as CatalogSortOption)}
          className="border border-[#ddd] bg-white p-2"
          style={{ fontSize: catalogTypography.listingItem }}
        >
          <option value="recent">Mais recentes</option>
          <option value="lowest-price">Menor preco</option>
          <option value="highest-price">Maior preco</option>
        </select>
      </div>

      {products.length ? (
        <div className="grid grid-cols-2 gap-[11px] md:grid-cols-4 md:gap-[14px]">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
          ))}
        </div>
      ) : (
        <div className="px-4 py-20 text-center text-sm">Nenhum produto encontrado.</div>
      )}

      {totalPages > 1 ? (
        <div className="mt-7 flex items-center justify-center gap-2 font-black" style={{ fontSize: catalogTypography.listingItem }}>
          <button
            className="h-9 border border-[#d7d7d7] px-3 disabled:text-[#aaa]"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ANTERIOR
          </button>
          <span className="grid h-9 min-w-9 place-items-center bg-[var(--color-lime)] px-3">
            {currentPage}/{totalPages}
          </span>
          <button
            className="h-9 border border-[#d7d7d7] px-3 disabled:text-[#aaa]"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            PROXIMA
          </button>
        </div>
      ) : null}
    </section>
  );
}
