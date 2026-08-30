"use client";

import Image from "next/image";

import { formatCurrency } from "@/core/utils/format/currency";
import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";

type AdministrationProductsTableProps = {
  products: AdministrationProduct[];
  selectedProductId: string | null;
  onOpenProduct(productId: string): void;
};

export function AdministrationProductsTable({
  products,
  selectedProductId,
  onOpenProduct,
}: AdministrationProductsTableProps) {
  return (
    <section className="mt-5 overflow-hidden border border-[var(--color-border)] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="px-4 py-3 text-left text-[8px] font-black text-[var(--color-muted)]">PRODUTO</th>
              <th className="px-4 py-3 text-left text-[8px] font-black text-[var(--color-muted)]">CATEGORIA</th>
              <th className="px-4 py-3 text-left text-[8px] font-black text-[var(--color-muted)]">VARIANTES</th>
              <th className="px-4 py-3 text-left text-[8px] font-black text-[var(--color-muted)]">ESTOQUE</th>
              <th className="px-4 py-3 text-left text-[8px] font-black text-[var(--color-muted)]">PRECO</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className={selectedProductId === product.id ? "bg-[#f8ffe3]" : "bg-white"}
                onClick={() => onOpenProduct(product.id)}
              >
                <td className="border-t border-[#ededed] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-[42px] overflow-hidden bg-[#ececec]">
                      <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <strong className="block text-[11px] font-black text-[var(--color-foreground)]">{product.name}</strong>
                      <span className="text-[10px] text-[var(--color-muted)]">{product.colorLabel}</span>
                    </div>
                  </div>
                </td>
                <td className="border-t border-[#ededed] px-4 py-3 text-[11px]">{product.category}</td>
                <td className="border-t border-[#ededed] px-4 py-3 text-[11px]">{product.variants.length}</td>
                <td className="border-t border-[#ededed] px-4 py-3 text-[11px] font-black text-[var(--color-stock)]">
                  {product.totalStockQuantity}
                </td>
                <td className="border-t border-[#ededed] px-4 py-3 text-[11px] font-black">
                  {formatCurrency(product.basePrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
