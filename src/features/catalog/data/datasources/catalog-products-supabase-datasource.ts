import type { SupabaseClient } from "@supabase/supabase-js";

import type { CatalogProductDto } from "@/features/catalog/data/dtos/catalog-product-dto";

export type CatalogProductsDataSource = { findAll(): Promise<CatalogProductDto[]> };

type ProductRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  base_price: number;
  product_images: Array<{ image_url: string; position: number }>;
  product_variants: Array<{ id: string; size: string; color: string; model: string; price: number; stock_quantity: number; is_active: boolean }>;
};

export class CatalogProductsSupabaseDataSource implements CatalogProductsDataSource {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async findAll(): Promise<CatalogProductDto[]> {
    const { data, error } = await this.supabaseClient
      .from("products")
      .select("id, name, description, category, brand, base_price, product_images(image_url, position), product_variants(id, size, color, model, price, stock_quantity, is_active)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as unknown as ProductRow[]).map((product) => {
      const variants = product.product_variants ?? [];
      return {
        id: product.id,
        slug: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        color: variants[0]?.color ?? "Sem cor",
        price: Number(product.base_price),
        images: [...(product.product_images ?? [])].sort((left, right) => left.position - right.position).map((image) => image.image_url),
        stock_quantity: variants.reduce((total, variant) => total + variant.stock_quantity, 0),
        badge: "NOVO",
        variants: variants.map((variant) => ({ id: variant.id, size: variant.size, color: variant.color, model: variant.model, price: Number(variant.price), stock_quantity: variant.stock_quantity, is_active: variant.is_active })),
      };
    });
  }
}
