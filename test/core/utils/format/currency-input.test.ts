import { describe, expect, it } from "vitest";

import { formatCurrencyInput, parseCurrencyInput } from "@/core/utils/format/currency-input";

describe("currency input", () => {
  it("formats and parses cent values in Brazilian real", () => {
    expect(formatCurrencyInput("15000")).toBe("150,00");
    expect(parseCurrencyInput("150,00")).toBe(150);
  });
});
