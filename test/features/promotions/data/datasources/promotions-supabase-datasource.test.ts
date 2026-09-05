import { describe, expect, it, vi } from "vitest";

import type { StorePromotion } from "@/core/promotions/promotion";
import { PromotionsSupabaseDataSource } from "@/features/promotions/data/datasources/promotions-supabase-datasource";

const promotion: StorePromotion = {
  id: "promotion-1",
  internalName: "Popup",
  kind: "popup",
  imageUrls: ["https://example.supabase.co/storage/v1/object/public/promotion-images/owner-id/campaigns/foto%20especial.webp"],
  isActive: true,
  priority: 0,
};

function createClient(imageUrls: string[]) {
  const remove = vi.fn().mockResolvedValue({ error: null });
  const list = vi.fn().mockResolvedValue({ data: [], error: null });
  const deletePromotion = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
  const selectPromotion = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      maybeSingle: vi.fn().mockResolvedValue({
        data: { image_url: imageUrls[0] ?? null, promotion_images: imageUrls.slice(1).map((image_url) => ({ image_url })) },
        error: null,
      }),
    }),
  });

  return {
    client: {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "owner-id" } }, error: null }) },
      from: vi.fn(() => ({ select: selectPromotion, delete: deletePromotion })),
      storage: { from: vi.fn(() => ({ remove, list })) },
    },
    remove,
    list,
    deletePromotion,
  };
}

describe("PromotionsSupabaseDataSource", () => {
  it("removes every campaign image from Storage before deleting the promotion", async () => {
    const { client, remove, deletePromotion } = createClient(promotion.imageUrls ?? []);
    const dataSource = new PromotionsSupabaseDataSource(client as never);

    await dataSource.delete(promotion);

    expect(remove).toHaveBeenCalledWith(["owner-id/campaigns/foto especial.webp"]);
    expect(deletePromotion).toHaveBeenCalledWith();
  });

  it("also removes the legacy main image stored on the promotion row", async () => {
    const legacyImage = "https://example.supabase.co/storage/v1/object/public/promotion-images/owner-id/campaigns/legacy.webp";
    const { client, remove } = createClient([legacyImage]);
    const dataSource = new PromotionsSupabaseDataSource(client as never);

    await dataSource.delete({ ...promotion, imageUrls: [], imageUrl: undefined });

    expect(remove).toHaveBeenCalledWith(["owner-id/campaigns/legacy.webp"]);
  });

  it("does not delete the promotion when an image URL cannot be mapped to the Storage bucket", async () => {
    const { client, remove, deletePromotion } = createClient(["https://example.com/not-a-promotion-image.webp"]);
    const dataSource = new PromotionsSupabaseDataSource(client as never);

    await expect(dataSource.delete({ ...promotion, imageUrls: ["https://example.com/not-a-promotion-image.webp"] }))
      .rejects.toThrow("Nao foi possivel localizar todas as fotos da promocao no Storage.");

    expect(remove).not.toHaveBeenCalled();
    expect(deletePromotion).not.toHaveBeenCalled();
  });

  it("does not delete the promotion when Storage still lists a removed image", async () => {
    const { client, deletePromotion, list } = createClient(promotion.imageUrls ?? []);
    list.mockResolvedValue({ data: [{ name: "foto especial.webp" }], error: null });
    const dataSource = new PromotionsSupabaseDataSource(client as never);

    await expect(dataSource.delete(promotion)).rejects.toThrow("Nao foi possivel apagar todas as fotos da promocao no Storage.");

    expect(deletePromotion).not.toHaveBeenCalled();
  });
});
