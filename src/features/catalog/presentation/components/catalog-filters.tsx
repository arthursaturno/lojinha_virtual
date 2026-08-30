"use client";

import { FilterCheckbox } from "@/features/catalog/presentation/components/filter-checkbox";
import { catalogTypography } from "@/core/theme/tokens";

type CatalogFiltersProps = {
  className?: string;
  categories: string[];
  categoryCount: Record<string, number>;
  activeCategory: string;
  sizes: string[];
  colors: string[];
  models: string[];
  sizeFilters: string[];
  colorFilters: string[];
  modelFilters: string[];
  onCategoryChange(category: string): void;
  onSizeToggle(size: string): void;
  onColorToggle(color: string): void;
  onModelToggle(model: string): void;
  onClear(): void;
};

const swatchClassByColor: Record<string, string> = {
  Preto: "bg-[#090909]",
  Branco: "border border-[#aaa] bg-white",
  Cinza: "bg-[#b9b9b9]",
  Verde: "bg-[#4c632e]",
  Azul: "bg-[#2563eb]",
  Bege: "bg-[#d7c6a5]",
  Marrom: "bg-[#75452c]",
  Rosa: "bg-[#ec7ba7]",
  Amarelo: "bg-[#f4cf2f]",
  Laranja: "bg-[#ea7a23]",
  Vinho: "bg-[#7f1d36]",
  Vermelho: "bg-[#d32f2f]",
};

export function CatalogFilters({
  className = "",
  categories,
  categoryCount,
  activeCategory,
  sizes,
  colors,
  models,
  sizeFilters,
  colorFilters,
  modelFilters,
  onCategoryChange,
  onSizeToggle,
  onColorToggle,
  onModelToggle,
  onClear,
}: CatalogFiltersProps) {
  return (
    <aside className={`border-r border-[var(--color-border)] px-6 py-[19px] ${className}`}>
      <div className="flex justify-between" style={{ fontSize: catalogTypography.filterItem }}>
        <strong>FILTRAR</strong>
        <button className="text-[#777]" onClick={onClear}>
          LIMPAR
        </button>
      </div>

      <h4 className="mb-[11px] mt-6 font-black" style={{ fontSize: catalogTypography.filterItem }}>CATEGORIA</h4>
      {categories
        .filter((category) => category !== "Todos")
        .map((category) => (
          <FilterCheckbox
            key={category}
            label={`${category} (${categoryCount[category] ?? 0})`}
            checked={activeCategory === category}
            onChange={() => onCategoryChange(activeCategory === category ? "Todos" : category)}
          />
        ))}

      <h4 className="mb-[11px] mt-6 font-black" style={{ fontSize: catalogTypography.filterItem }}>TAMANHO</h4>
      <div className="flex flex-wrap gap-[5px]">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeToggle(size)}
            className={`border px-2 py-[6px] ${
              sizeFilters.includes(size)
                ? "border-[var(--color-lime)] bg-black text-[var(--color-lime)]"
                : "border-[#d7d7d7] bg-white"
            }`}
            style={{ fontSize: catalogTypography.filterItem }}
          >
            {size}
          </button>
        ))}
      </div>

      <h4 className="mb-[11px] mt-6 font-black" style={{ fontSize: catalogTypography.filterItem }}>COR</h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            aria-label={color}
            onClick={() => onColorToggle(color)}
            className={`size-[17px] rounded-full ${swatchClassByColor[color] ?? "bg-[#e7e7e7]"} ${
              colorFilters.includes(color) ? "outline outline-2 outline-[var(--color-lime)] outline-offset-2" : ""
            }`}
          />
        ))}
      </div>

      <h4 className="mb-[11px] mt-6 font-black" style={{ fontSize: catalogTypography.filterItem }}>MODELO</h4>
      {models.map((model) => (
        <FilterCheckbox
          key={model}
          label={model}
          checked={modelFilters.includes(model)}
          onChange={() => onModelToggle(model)}
        />
      ))}

    </aside>
  );
}
