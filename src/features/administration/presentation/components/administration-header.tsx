type AdministrationHeaderProps = {
  totalProducts: number;
  feedbackMessage?: string;
  onCreateProduct(): void;
};

export function AdministrationHeader({
  totalProducts,
  feedbackMessage,
  onCreateProduct,
}: AdministrationHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-[28px] font-black leading-none text-[var(--color-foreground)]">Produtos</h1>
        <p className="mt-2 text-[12px] font-medium text-[var(--color-muted)]">
          Gerencie seu catalogo com {totalProducts} produtos mapeados no painel.
        </p>
        {feedbackMessage ? (
          <p className="mt-2 text-sm font-semibold text-[var(--color-stock)]">{feedbackMessage}</p>
        ) : null}
      </div>
      <button className="h-11 bg-[var(--color-lime)] px-5 text-[11px] font-black text-black" onClick={onCreateProduct}>
        NOVO PRODUTO
      </button>
    </div>
  );
}
