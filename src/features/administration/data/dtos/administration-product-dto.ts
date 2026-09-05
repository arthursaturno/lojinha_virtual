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
  description: string;
  category: string;
  brand: string;
  color_label: string;
  base_price: number;
  image_urls: string[];
  thumbnail_urls?: string[];
  image_crops?: Array<{ zoom: number; offset_x: number; offset_y: number }>;
  badge?: string;
  is_active: boolean;
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
    description: dto.description,
    category: dto.category,
    brand: dto.brand,
    colorLabel: dto.color_label,
    basePrice: dto.base_price,
    imageUrls: dto.image_urls,
    thumbnailUrls: dto.thumbnail_urls,
    imageCrops: dto.image_crops?.map((crop) => ({ zoom: crop.zoom, offsetX: crop.offset_x, offsetY: crop.offset_y })),
    badge: dto.badge,
    isActive: dto.is_active,
    totalStockQuantity: dto.total_stock_quantity,
    variants: dto.variants.map(administrationProductVariantToDomain),
  };
}
