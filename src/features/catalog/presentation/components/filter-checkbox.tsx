type FilterCheckboxProps = {
  label: string;
  checked: boolean;
  onChange(): void;
};

export function FilterCheckbox({ label, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="my-2 flex cursor-pointer items-center gap-[7px]" style={{ fontSize: catalogTypography.filterItem }}>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`grid size-3 place-items-center border text-[9px] leading-none ${
          checked
            ? "border-[var(--color-foreground)] bg-[var(--color-foreground)] text-[var(--color-lime)]"
            : "border-[#9b9b9b] text-transparent"
        }`}
      >
        ✓
      </span>
      <span>{label}</span>
    </label>
  );
}
import { catalogTypography } from "@/core/theme/tokens";
