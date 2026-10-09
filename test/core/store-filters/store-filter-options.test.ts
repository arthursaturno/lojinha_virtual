import { describe, expect, it } from "vitest";

import {
  getStorefrontProductPriority,
  prioritizeStorefrontCategories,
} from "@/core/store-filters/store-filter-options";

describe("prioritizeStorefrontCategories", () => {
  it("shows shirts, polos, shorts and bermudas before the remaining categories", () => {
    expect(prioritizeStorefrontCategories(["Camisetas", "BERMUDAS", "Tenis", "Polos", "Camisa", "SHORTS"])).toEqual([
      "Camisetas",
      "Polos",
      "Camisa",
      "SHORTS",
      "BERMUDAS",
      "Tenis",
    ]);
  });

  it("prioritizes Camisa Polo unless it is a team shirt", () => {
    expect(getStorefrontProductPriority("Polos", "Camisa polo de linho")).toBe(0);
    expect(getStorefrontProductPriority("Polos", "Polo lisa")).toBe(0);
    expect(getStorefrontProductPriority("Polos", "Camisa polo de time Flamengo")).toBe(Number.MAX_SAFE_INTEGER);
  });
});
