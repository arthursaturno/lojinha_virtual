import { describe, expect, it } from "vitest";

import {
  getStorefrontProductPriority,
  prioritizeStorefrontCategories,
} from "@/core/store-filters/store-filter-options";

describe("prioritizeStorefrontCategories", () => {
  it("shows Camisetas, Camisas, Shorts and Bermudas before the remaining categories", () => {
    expect(prioritizeStorefrontCategories(["Camisetas", "BERMUDAS", "Tenis", "Camisa", "SHORTS"])).toEqual([
      "Camisetas",
      "Camisa",
      "SHORTS",
      "BERMUDAS",
      "Tenis",
    ]);
  });

  it("prioritizes Camisa Polo unless it is a team shirt", () => {
    expect(getStorefrontProductPriority("Polos", "Camisa polo de linho")).toBe(0);
    expect(getStorefrontProductPriority("Polos", "Camisa polo de time Flamengo")).toBe(Number.MAX_SAFE_INTEGER);
  });
});
