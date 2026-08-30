import type {
  AdministrationProduct,
  AdministrationProductVariant,
  AdministrationProductVariantStatus,
} from "@/features/administration/domain/entities/administration-product";

export type AdministrationProductVariantDto = {
  id: string;
  size: string;
  color: string;
  model: string;
  price: number;
  stock_quantity: number;
  status: AdministrationProductVariantStatus;
};

export type AdministrationProductDto = {
  id: string;
  name: string;
  category: string;
  color_label: string;
  base_price: number;
  image_urls: string[];
  badge?: string;
  total_stock_quantity: number;
  variants: AdministrationProductVariantDto[];
};

function administrationProductVariantToDomain(
  dto: AdministrationProductVariantDto,
): AdministrationProductVariant {
  return {
    id: dto.id,
    size: dto.size,
    color: dto.color,
    model: dto.model,
    price: dto.price,
    stockQuantity: dto.stock_quantity,
    status: dto.status,
  };
}

export function administrationProductToDomain(dto: AdministrationProductDto): AdministrationProduct {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category,
    colorLabel: dto.color_label,
    basePrice: dto.base_price,
    imageUrls: dto.image_urls,
    badge: dto.badge,
    totalStockQuantity: dto.total_stock_quantity,
    variants: dto.variants.map(administrationProductVariantToDomain),
  };
}
