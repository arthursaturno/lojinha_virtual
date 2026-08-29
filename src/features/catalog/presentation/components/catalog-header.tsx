"use client";

import { FiSearch } from "react-icons/fi";

import { storeConfig } from "@/core/theme/tokens";
import { Brand } from "@/features/catalog/presentation/components/brand";
import { WhatsAppLabel } from "@/features/catalog/presentation/components/whatsapp-label";

type CatalogHeaderProps = {
  query: string;
  categories: string[];
  activeCategory: string;
  onQueryChange(query: string): void;
  onCategoryChange(category: string): void;
};

export function CatalogHeader({
  query,
  categories,
  activeCategory,
  onQueryChange,
  onCategoryChange,
}: CatalogHeaderProps) {
  return (
    <>
      <div className="h-[25px] bg-[var(--color-foreground)] px-[14px] py-[7px] text-[9px] font-extrabold tracking-[0.02em] text-white md:h-[29px] md:px-[28px] md:py-[8px]">
        <i className="mr-[7px] inline-block size-[7px] rounded-full bg-[var(--color-lime)]" />
        ENVIO PARA TODO O BRASIL
      </div>

      <header className="grid min-h-[116px] grid-cols-[1fr_auto] items-center gap-[9px] border-t border-[#1e1e1e] bg-[var(--color-foreground)] px-[14px] py-[11px] text-white md:h-[79px] md:min-h-0 md:grid-cols-[150px_minmax(280px,510px)_180px] md:gap-[22px] md:px-[28px] md:py-0">
        <Brand />

        <label className="col-span-2 flex h-10 items-center border border-[#333] bg-[#151515] px-[14px] md:col-span-1">
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar produtos, marcas e mais..."
            className="min-w-0 flex-1 bg-transparent text-[11px] text-white outline-none placeholder:text-[#868686]"
          />
          <FiSearch aria-hidden="true" className="text-[18px]" />
        </label>

        <button
          className="topbar-whatsapp hidden md:flex"
          onClick={() => window.open(`https://wa.me/${storeConfig.whatsappPhone}`, "_blank", "noopener,noreferrer")}
        >
          <WhatsAppLabel>FALAR NO WHATSAPP</WhatsAppLabel>
        </button>
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
