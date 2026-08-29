"use client";

import { FilterCheckbox } from "@/features/catalog/presentation/components/filter-checkbox";

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
  maxPrice: number;
  formattedMaxPrice: string;
  onCategoryChange(category: string): void;
  onSizeToggle(size: string): void;
  onColorToggle(color: string): void;
  onModelToggle(model: string): void;
  onMaxPriceChange(value: number): void;
  onClear(): void;
};

const swatchClassByColor: Record<string, string> = {
  Preto: "bg-[#090909]",
  Branco: "border border-[#aaa] bg-white",
  Cinza: "bg-[#b9b9b9]",
  Verde: "bg-[#4c632e]",
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
  maxPrice,
  formattedMaxPrice,
  onCategoryChange,
  onSizeToggle,
  onColorToggle,
  onModelToggle,
  onMaxPriceChange,
  onClear,
}: CatalogFiltersProps) {
  return (
    <aside className={`border-r border-[var(--color-border)] px-6 py-[19px] ${className}`}>
      <div className="flex justify-between text-[9px]">
        <strong>FILTRAR</strong>
        <button className="text-[#777]" onClick={onClear}>
          LIMPAR
        </button>
      </div>

      <h4 className="mb-[11px] mt-6 text-[9px] font-black">CATEGORIA</h4>
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

      <h4 className="mb-[11px] mt-6 text-[9px] font-black">TAMANHO</h4>
      <div className="flex flex-wrap gap-[5px]">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeToggle(size)}
            className={`border px-2 py-[6px] text-[10px] ${
              sizeFilters.includes(size)
                ? "border-[var(--color-lime)] bg-black text-[var(--color-lime)]"
                : "border-[#d7d7d7] bg-white"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <h4 className="mb-[11px] mt-6 text-[9px] font-black">COR</h4>
      <div className="flex gap-[7px]">
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

      <h4 className="mb-[11px] mt-6 text-[9px] font-black">MODELO</h4>
      {models.map((model) => (
        <FilterCheckbox
          key={model}
          label={model}
          checked={modelFilters.includes(model)}
          onChange={() => onModelToggle(model)}
        />
      ))}

      <h4 className="mb-[11px] mt-6 text-[9px] font-black">PRECO</h4>
      <input
        min="150"
        max="450"
        step="10"
        value={maxPrice}
        type="range"
        onChange={(event) => onMaxPriceChange(Number(event.target.value))}
        className="w-full accent-[var(--color-lime)]"
      />
      <p className="mt-2 text-[10px] text-[#666]">Ate {formattedMaxPrice}</p>
    </aside>
  );
}
