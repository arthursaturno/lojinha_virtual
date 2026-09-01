import { describe, expect, it } from "vitest";

import { getProductImageCropOffsetPercentage } from "@/core/utils/images/create-product-image-upload";

describe("getProductImageCropOffsetPercentage", () => {
  it("maps the crop control range to the preview and canvas offset range", () => {
    expect(getProductImageCropOffsetPercentage(-80)).toBe(-12);
    expect(getProductImageCropOffsetPercentage(0)).toBe(0);
    expect(getProductImageCropOffsetPercentage(80)).toBe(12);
  });
});
