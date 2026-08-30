export function distributeStockQuantity(totalQuantity: number, variantCount: number): number[] {
  if (variantCount <= 0) {
    return [];
  }

  const normalizedTotal = Math.max(0, Math.floor(totalQuantity));
  const baseQuantity = Math.floor(normalizedTotal / variantCount);
  const remainingQuantity = normalizedTotal % variantCount;

  return Array.from(
    { length: variantCount },
    (_, index) => baseQuantity + (index < remainingQuantity ? 1 : 0),
  );
}
