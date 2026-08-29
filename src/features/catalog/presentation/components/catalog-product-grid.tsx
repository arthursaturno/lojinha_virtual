"use client";

import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import { ProductCard } from "@/features/catalog/presentation/components/product-card";
import type { CatalogSortOption } from "@/features/catalog/presentation/viewmodels/catalog-view-state";

type CatalogProductGridProps = {
  products: CatalogProduct[];
  sort: CatalogSortOption;
  onSortChange(sort: CatalogSortOption): void;
  onOpenProduct(product: CatalogProduct): void;
};

export function CatalogProductGrid({
  products,
  sort,
  onSortChange,
  onOpenProduct,
}: CatalogProductGridProps) {
  return (
    <section className="px-3 pb-[90px] md:px-[22px] md:pb-10">
      <div className="flex h-[50px] items-center justify-between text-[10px] md:h-[51px]">
        <strong>{products.length} produtos encontrados</strong>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as CatalogSortOption)}
          className="border border-[#ddd] bg-white p-2 text-[10px]"
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
    </section>
  );
}
