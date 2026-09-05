import type {
  CatalogProduct,
  ProductVariant,
} from "@/features/catalog/domain/entities/catalog-product";

export type ProductVariantDto = {
  id: string;
  size: string;
  color: string;
  model: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
};

export type CatalogProductDto = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  brand?: string;
  color: string;
  price: number;
  images: string[];
  stock_quantity: number;
  badge?: string;
  variants: ProductVariantDto[];
};

function variantToDomain(dto: ProductVariantDto): ProductVariant {
  return {
    id: dto.id,
    size: dto.size,
    color: dto.color,
    model: dto.model,
    price: dto.price,
    stockQuantity: dto.stock_quantity,
    isActive: dto.is_active,
  };
}

export function catalogProductToDomain(dto: CatalogProductDto): CatalogProduct {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    description: dto.description,
    category: dto.category,
    brand: dto.brand,
    color: dto.color,
    price: dto.price,
    images: dto.images,
    stockQuantity: dto.stock_quantity,
    badge: dto.badge,
    variants: dto.variants.map(variantToDomain),
  };
}
