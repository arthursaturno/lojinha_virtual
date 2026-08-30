"use client";

import Image from "next/image";

import { administrationTypography } from "@/core/theme/tokens";
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
        <table className="w-full min-w-[920px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="px-4 py-3 text-left font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.tableHeading }}>PRODUTO</th>
              <th className="px-4 py-3 text-left font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.tableHeading }}>CATEGORIA</th>
              <th className="px-4 py-3 text-left font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.tableHeading }}>STATUS</th>
              <th className="px-4 py-3 text-left font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.tableHeading }}>VARIANTES</th>
              <th className="px-4 py-3 text-left font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.tableHeading }}>ESTOQUE</th>
              <th className="px-4 py-3 text-left font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.tableHeading }}>PRECO</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className={`cursor-pointer transition-colors hover:bg-[#f4fbdc] focus-visible:bg-[#f4fbdc] ${
                  selectedProductId === product.id ? "bg-[#f8ffe3]" : "bg-white"
                }`}
                onClick={() => onOpenProduct(product.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpenProduct(product.id);
                  }
                }}
                tabIndex={0}
                aria-label={`Editar ${product.name}`}
              >
                <td className="border-t border-[#ededed] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-[42px] overflow-hidden bg-[#ececec]">
                      <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <strong className="block font-black text-[var(--color-foreground)]" style={{ fontSize: administrationTypography.tableItem }}>{product.name}</strong>
                      <span className="block text-[var(--color-muted)]" style={{ fontSize: administrationTypography.tableItem }}>{product.colorLabel}</span>
                      <span className="mt-1 line-clamp-2 max-w-[280px] text-[#7a7a7a]" style={{ fontSize: administrationTypography.tableItem }}>
                        {product.description}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="border-t border-[#ededed] px-4 py-3" style={{ fontSize: administrationTypography.tableItem }}>{product.category}</td>
                <td className="border-t border-[#ededed] px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 font-black ${
                      product.isActive ? "bg-[#f0ffd0] text-black" : "bg-[#f0f0f0] text-[#666]"
                    }`}
                    style={{ fontSize: administrationTypography.tableItem }}
                  >
                    {product.isActive ? "ATIVO" : "INATIVO"}
                  </span>
                </td>
                <td className="border-t border-[#ededed] px-4 py-3" style={{ fontSize: administrationTypography.tableItem }}>{product.variants.length}</td>
                <td className="border-t border-[#ededed] px-4 py-3 font-black text-[var(--color-stock)]" style={{ fontSize: administrationTypography.tableItem }}>
                  {product.totalStockQuantity}
                </td>
                <td className="border-t border-[#ededed] px-4 py-3 font-black" style={{ fontSize: administrationTypography.tableItem }}>
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
