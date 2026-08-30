"use client";

import { FiSearch } from "react-icons/fi";

type AdministrationSearchBarProps = {
  query: string;
  onQueryChange(query: string): void;
};

export function AdministrationSearchBar({ query, onQueryChange }: AdministrationSearchBarProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 md:flex-row">
      <label className="flex h-12 w-full min-w-0 items-center border border-[var(--color-border)] bg-white px-4 md:flex-1">
        <FiSearch aria-hidden="true" className="mr-3 text-lg text-[var(--color-muted)]" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#858585]"
          placeholder="Buscar produto..."
        />
      </label>
     
    </div>
  );
}
