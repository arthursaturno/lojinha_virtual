"use client";

import { FiSearch, FiShoppingBag } from "react-icons/fi";
import { Brand } from "@/features/catalog/presentation/components/brand";
import { WhatsAppLabel } from "@/features/catalog/presentation/components/whatsapp-label";

type CatalogHeaderProps = {
  storeName: string;
  whatsappPhone: string;
  cartItemCount: number;
  query: string;
  categories: string[];
  activeCategory: string;
  onQueryChange(query: string): void;
  onCategoryChange(category: string): void;
  onOpenCart(): void;
};

export function CatalogHeader({
  storeName,
  whatsappPhone,
  cartItemCount,
  query,
  categories,
  activeCategory,
  onQueryChange,
  onCategoryChange,
  onOpenCart,
}: CatalogHeaderProps) {
  return (
    <>
      <div className="h-[25px] bg-[var(--color-foreground)] px-[14px] py-[7px] text-[9px] font-extrabold tracking-[0.02em] text-white md:h-[29px] md:px-[28px] md:py-[8px]">
        <i className="mr-[7px] inline-block size-[7px] rounded-full bg-[var(--color-lime)]" />
        ENVIO PARA TODO O BRASIL
      </div>

      <header className="grid min-h-[116px] grid-cols-[1fr_auto] items-center gap-[9px] border-t border-[#1e1e1e] bg-[var(--color-foreground)] px-[14px] py-[11px] text-white md:h-[79px] md:min-h-0 md:grid-cols-[150px_minmax(280px,510px)_minmax(230px,1fr)] md:gap-[22px] md:px-[28px] md:py-0">
        <Brand storeName={storeName} />

        <label className="col-span-2 flex h-10 items-center border border-[#333] bg-[#151515] px-[14px] md:col-span-1">
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar produtos, marcas e mais..."
            className="min-w-0 flex-1 bg-transparent text-[11px] text-white outline-none placeholder:text-[#868686]"
          />
          <FiSearch aria-hidden="true" className="text-[18px]" />
        </label>

        <div className="hidden items-center justify-end gap-2 md:flex">
          <button className="topbar-whatsapp" onClick={() => window.open(`https://wa.me/${whatsappPhone}`, "_blank", "noopener,noreferrer")}>
            <WhatsAppLabel>FALAR NO WHATSAPP</WhatsAppLabel>
          </button>
          <button
            type="button"
            className="relative grid size-10 place-items-center border border-[var(--color-lime)] text-[var(--color-lime)]"
            onClick={onOpenCart}
            aria-label={`Abrir carrinho com ${cartItemCount} ${cartItemCount === 1 ? "item" : "itens"}`}
          >
            <FiShoppingBag aria-hidden="true" className="text-lg" />
            {cartItemCount > 0 ? (
              <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-[var(--color-lime)] text-[10px] font-black text-black">
                {cartItemCount}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      <nav className="flex h-12 items-center gap-[25px] overflow-auto border-y border-[#242424] bg-[var(--color-foreground)] px-[14px] md:gap-11 md:px-8">
        {categories
          .filter((category) => category !== "Todos")
          .map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`h-full whitespace-nowrap border-b-2 text-[11px] font-extrabold uppercase ${
                activeCategory === category
                  ? "border-[var(--color-lime)] text-[var(--color-lime)]"
                  : "border-transparent text-white"
              }`}
            >
              {category}
            </button>
          ))}
      </nav>
    </>
  );
}
