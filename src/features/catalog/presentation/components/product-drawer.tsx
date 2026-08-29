"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiHeadphones, FiMaximize2, FiTruck, FiX } from "react-icons/fi";

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
  orderTotal: number;
  formattedOrderTotal: string;
  onSelectionChange(selection: Partial<ProductSelection>): void;
  onQuantityChange(quantity: number): void;
  onClose(): void;
};

export function ProductDrawer({
  product,
  selection,
  selectedVariant,
  isSelectionReady,
  orderTotal,
  formattedOrderTotal,
  onSelectionChange,
  onQuantityChange,
  onClose,
}: ProductDrawerProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const sizes = Array.from(new Set(product.variants.map((variant) => variant.size)));
  const colors = Array.from(new Set(product.variants.map((variant) => variant.color)));
  const models = Array.from(new Set(product.variants.map((variant) => variant.model)));
  const activePrice = selectedVariant?.price ?? product.price;
  const currentImage = product.images[imageIndex] ?? product.images[0];
  const availableQuantity = selectedVariant?.stockQuantity ?? product.stockQuantity;

  function previousImage() {
    setImageIndex((current) => (current === 0 ? product.images.length - 1 : current - 1));
  }

  function nextImage() {
    setImageIndex((current) => (current + 1) % product.images.length);
  }

  function contactSeller() {
    const message = [
      "Ola! Tenho interesse no seguinte produto:",
      "",
      `Produto: ${product.name}`,
      `Tamanho: ${selection.size}`,
      `Cor: ${selection.color}`,
      `Modelo: ${selection.model}`,
      `Quantidade: ${selection.quantity}`,
      `Valor unitario: ${formatCurrency(activePrice)}`,
      `Total: ${formatCurrency(orderTotal)}`,
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
        <div className="flex h-7 items-center justify-end text-[10px] font-extrabold">
          <button className="grid size-7 place-items-center" onClick={onClose} aria-label="Fechar produto">
            <FiX aria-hidden="true" className="text-[21px]" />
          </button>
        </div>

        <div className="relative mt-[10px] h-[270px] bg-[#eee]">
          <Image src={currentImage} alt={product.name} fill sizes="420px" className="object-cover" />
          <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 text-[9px] font-extrabold text-white">
            {imageIndex + 1}/{product.images.length}
          </div>
          <button
            type="button"
            aria-label="Expandir foto"
            className="absolute right-2 top-2 grid size-9 place-items-center bg-white/90 text-black"
            onClick={() => setIsExpanded(true)}
          >
            <FiMaximize2 aria-hidden="true" />
          </button>
          {product.images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center bg-white/90 text-black"
                onClick={previousImage}
              >
                <FiChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Proxima foto"
                className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center bg-white/90 text-black"
                onClick={nextImage}
              >
                <FiChevronRight aria-hidden="true" />
              </button>
            </>
          ) : null}
        </div>

        <div className="mt-2 grid grid-cols-6 gap-[7px]">
          {product.images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`relative h-12 border ${index === imageIndex ? "border-[var(--color-lime)]" : "border-[#ddd]"}`}
              onClick={() => setImageIndex(index)}
              aria-label={`Ver foto ${index + 1}`}
            >
              <Image src={image} alt="" fill sizes="64px" className="object-cover" />
            </button>
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
        <div className="mt-3 flex items-center justify-between bg-[#f7f7f5] px-3 py-3">
          <span className="text-[10px] font-black">TOTAL ({selection.quantity} PECAS)</span>
          <strong className="text-lg font-black">{formattedOrderTotal}</strong>
        </div>

        <div className="my-[18px] h-px bg-[#ddd]" />
        <h4 className="text-[11px] font-black">ESCOLHA AS VARIACOES</h4>

        <OptionGroup label="TAMANHO" values={sizes} selected={selection.size} onSelect={(size) => onSelectionChange({ size })} />
        <OptionGroup label="COR" values={colors} selected={selection.color} onSelect={(color) => onSelectionChange({ color })} />
        <OptionGroup label="MODELO" values={models} selected={selection.model} onSelect={(model) => onSelectionChange({ model })} />

        <div className="my-[18px] border-y border-[#eee] py-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[11px] font-black">QUANTIDADE</h4>
              <p className="mt-1 text-[10px] text-[#777]">Disponivel: {availableQuantity} pecas</p>
            </div>
            <div className="flex h-10 items-center border border-[#d7d7d7]">
              <button
                type="button"
                className="grid size-10 place-items-center text-lg font-bold disabled:text-[#aaa]"
                disabled={selection.quantity <= 1}
                onClick={() => onQuantityChange(selection.quantity - 1)}
                aria-label="Diminuir quantidade"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={availableQuantity}
                value={selection.quantity}
                onChange={(event) => onQuantityChange(Number(event.target.value))}
                className="h-full w-12 border-x border-[#d7d7d7] text-center text-sm font-extrabold outline-none"
                aria-label="Quantidade de pecas"
              />
              <button
                type="button"
                className="grid size-10 place-items-center text-lg font-bold disabled:text-[#aaa]"
                disabled={selection.quantity >= availableQuantity}
                onClick={() => onQuantityChange(selection.quantity + 1)}
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>
          </div>
        </div>

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
          <TrustItem icon={<FiTruck aria-hidden="true" />} label="Envio para todo o Brasil" />
          <TrustItem icon={<FiHeadphones aria-hidden="true" />} label="Atendimento rapido via WhatsApp" />
        </div>
      </aside>

      {isExpanded ? (
        <div
          className="absolute inset-0 z-40 grid place-items-center bg-black/90 p-4"
          onMouseDown={(event) => {
            event.stopPropagation();
            setIsExpanded(false);
          }}
        >
          <button
            className="absolute right-4 top-4 grid size-10 place-items-center bg-white text-black"
            onClick={() => setIsExpanded(false)}
            aria-label="Fechar imagem expandida"
          >
            <FiX aria-hidden="true" />
          </button>
          {product.images.length > 1 ? (
            <>
              <button
                className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center bg-white text-black"
                onClick={previousImage}
                aria-label="Foto anterior expandida"
              >
                <FiChevronLeft aria-hidden="true" />
              </button>
              <button
                className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center bg-white text-black"
                onClick={nextImage}
                aria-label="Proxima foto expandida"
              >
                <FiChevronRight aria-hidden="true" />
              </button>
            </>
          ) : null}
          <div className="relative h-[80vh] w-full max-w-5xl" onMouseDown={(event) => event.stopPropagation()}>
            <Image src={currentImage} alt={product.name} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      ) : null}
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
