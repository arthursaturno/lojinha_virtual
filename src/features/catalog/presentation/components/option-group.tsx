"use client";

type OptionGroupProps = {
  label: string;
  values: string[];
  selected: string;
  onSelect(value: string): void;
};

export function OptionGroup({ label, values, selected, onSelect }: OptionGroupProps) {
  return (
    <fieldset className="my-4 border-0 p-0">
      <legend className="mb-2 text-[9px] font-extrabold">{label} *</legend>
      <div className="flex flex-wrap gap-[7px]">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            className={`border px-2 py-[6px] text-[10px] ${
              selected === value
                ? "border-[var(--color-lime)] shadow-[inset_0_0_0_1px_var(--color-lime)]"
                : "border-[#d7d7d7]"
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
