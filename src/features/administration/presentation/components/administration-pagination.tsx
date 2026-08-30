import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { administrationTypography } from "@/core/theme/tokens";

type AdministrationPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange(page: number): void;
};

export function AdministrationPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: AdministrationPaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  return (
    <nav className="mt-4 flex flex-wrap items-center justify-between gap-3" aria-label="Paginacao de produtos">
      <p className="font-semibold text-[var(--color-muted)]" style={{ fontSize: administrationTypography.tableItem }}>
        Pagina {currentPage} de {totalPages} - {totalItems} produtos
      </p>
      <div className="flex items-center gap-2">
        <button type="button" className="grid size-10 place-items-center border border-[var(--color-border)] bg-white disabled:cursor-not-allowed disabled:opacity-40" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Pagina anterior">
          <FiChevronLeft aria-hidden="true" />
        </button>
        <span className="grid h-10 min-w-10 place-items-center border border-black bg-[var(--color-lime)] px-3 font-black" style={{ fontSize: administrationTypography.tableItem }}>
          {currentPage}
        </span>
        <button type="button" className="grid size-10 place-items-center border border-[var(--color-border)] bg-white disabled:cursor-not-allowed disabled:opacity-40" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Proxima pagina">
          <FiChevronRight aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
