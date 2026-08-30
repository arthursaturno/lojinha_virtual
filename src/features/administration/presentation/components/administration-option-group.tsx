"use client";

type AdministrationOptionGroupProps = {
  label: string;
  values: string[];
  selectedValue: string;
  onSelect(value: string): void;
};

export function AdministrationOptionGroup({
  label,
  values,
  selectedValue,
  onSelect,
}: AdministrationOptionGroupProps) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 text-[9px] font-black">{label}</legend>
      <div className="flex flex-wrap gap-[7px]">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            className={`border px-3 py-2 text-[10px] ${
              selectedValue === value
                ? "border-[var(--color-lime)] bg-black text-[var(--color-lime)]"
                : "border-[#d7d7d7] bg-white text-[var(--color-foreground)]"
            }`}
            onClick={() => onSelect(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
