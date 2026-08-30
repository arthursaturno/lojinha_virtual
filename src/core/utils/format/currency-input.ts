function sanitizeCurrencyDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 9);
}

export function formatCurrencyInput(value: string): string {
  const digits = sanitizeCurrencyDigits(value);

  if (!digits) {
    return "";
  }

  const cents = digits.padStart(3, "0");
  const integerPart = cents.slice(0, -2);
  const decimalPart = cents.slice(-2);
  const normalizedInteger = Number(integerPart).toLocaleString("pt-BR");

  return `${normalizedInteger},${decimalPart}`;
}
