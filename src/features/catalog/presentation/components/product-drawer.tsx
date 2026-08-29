"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { FiHeadphones, FiPackage, FiTruck, FiX } from "react-icons/fi";

import { storeConfig } from "@/core/theme/tokens";
import { formatCurrency } from "@/core/utils/format/currency";
import type {
  CatalogProduct,
  ProductVariant,
} from "@/features/catalog/domain/entities/catalog-product";
import { OptionGroup } from "@/features/catalog/presentation/components/option-group";
import { WhatsAppLabel } from "@/features/catalog/presentation/components/whatsapp-label";
import type { ProductSelection } from "@/features/catalog/presentation/viewmodels/catalog-view-state";

type ProductDrawerProps = {
  product: CatalogProduct;
  selection: ProductSelection;
  selectedVariant: ProductVariant | null;
  isSelectionReady: boolean;
  onSelectionChange(selection: Partial<ProductSelection>): void;
  onClose(): void;
};

export function ProductDrawer({
  product,
  selection,
  selectedVariant,
  isSelectionReady,
  onSelectionChange,
  onClose,
}: ProductDrawerProps) {
  const sizes = Array.from(new Set(product.variants.map((variant) => variant.size)));
  const colors = Array.from(new Set(product.variants.map((variant) => variant.color)));
  const models = Array.from(new Set(product.variants.map((variant) => variant.model)));
  const activePrice = selectedVariant?.price ?? product.price;

  function contactSeller() {
    const message = [
      "Ola! Tenho interesse no seguinte produto:",
      "",
      `Produto: ${product.name}`,
      `Tamanho: ${selection.size}`,
      `Cor: ${selection.color}`,
      `Modelo: ${selection.model}`,
      `Preco: ${formatCurrency(activePrice)}`,
      `Link: ${window.location.href}`,
      "",
      "Gostaria de saber mais informacoes.",
    ].join("\n");

    window.open(
      `https://wa.me/${storeConfig.whatsappPhone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="fixed inset-0 z-30 bg-black/55" onMouseDown={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-full overflow-auto bg-white px-[14px] py-[14px] md:w-[420px] md:px-[25px] md:py-[17px]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex h-7 items-center justify-between text-[10px] font-extrabold">
          <span>FECHAR</span>
          <button className="grid size-7 place-items-center" onClick={onClose} aria-label="Fechar produto">
            <FiX aria-hidden="true" className="text-[21px]" />
          </button>
        </div>

        <div className="relative mt-[10px] h-[270px] bg-[#eee]">
          <Image src={product.images[0]} alt={product.name} fill sizes="420px" className="object-cover" />
        </div>

        <div className="mt-2 grid grid-cols-4 gap-[7px]">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="relative h-12 border border-[#ddd]">
              <Image src={product.images[0]} alt="" fill sizes="96px" className="object-cover" />
            </div>
          ))}
        </div>

        <span className="mt-[10px] inline-block bg-[var(--color-lime)] px-[5px] py-[3px] text-[8px] font-black">
          {product.badge ?? "NOVO"}
        </span>
        <h2 className="my-2 text-xl font-extrabold">{product.name}</h2>
        <div className="text-2xl font-black">{formatCurrency(activePrice)}</div>
        <p className="text-[11px] leading-normal text-[#555]">
          a vista no PIX ou ate <b>6x de {formatCurrency(activePrice / 6)}</b> sem juros
        </p>

        <div className="my-[18px] h-px bg-[#ddd]" />
        <h4 className="text-[11px] font-black">ESCOLHA AS VARIACOES</h4>

        <OptionGroup label="TAMANHO" values={sizes} selected={selection.size} onSelect={(size) => onSelectionChange({ size })} />
        <OptionGroup label="COR" values={colors} selected={selection.color} onSelect={(color) => onSelectionChange({ color })} />
        <OptionGroup label="MODELO" values={models} selected={selection.model} onSelect={(model) => onSelectionChange({ model })} />

        <p className="my-[22px] text-[10px] text-[var(--color-stock)]">
          ● {selectedVariant?.stockQuantity === 0 ? "Sem estoque" : "Em estoque"}
          <span className="ml-[22px] text-[#777]">Envio imediato</span>
        </p>

        <button
          disabled={!isSelectionReady}
          onClick={contactSeller}
          className="flex w-full items-center justify-center gap-[9px] bg-[var(--color-lime)] p-[14px] text-sm font-black disabled:bg-[#e9e9e9] disabled:text-[#999]"
        >
          <WhatsAppLabel>{isSelectionReady ? "FALAR NO WHATSAPP" : "SELECIONE AS VARIACOES"}</WhatsAppLabel>
        </button>

        <small className="mt-[10px] block text-center text-[9px] text-[#777]">Tire duvidas e garanta o seu.</small>

        <div className="mt-[18px] grid grid-cols-3 border-t border-[#eee] pb-[50px] pt-4 text-center text-[8px] leading-tight">
          <TrustItem icon={<FiPackage aria-hidden="true" />} label="Produtos 100% originais" />
          <TrustItem icon={<FiTruck aria-hidden="true" />} label="Envio para todo o Brasil" />
          <TrustItem icon={<FiHeadphones aria-hidden="true" />} label="Atendimento rapido via WhatsApp" />
        </div>
      </aside>
    </div>
  );
}

function TrustItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-1">
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
