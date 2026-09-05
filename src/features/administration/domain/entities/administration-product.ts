export type AdministrationProductVariantStatus = "in-stock" | "low-stock";

export type AdministrationProductVariant = {
  id: string;
  size: string;
  color: string;
  model: string;
  price: number;
  stockQuantity: number;
  status: AdministrationProductVariantStatus;
};

export type AdministrationProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  colorLabel: string;
  basePrice: number;
  imageUrls: string[];
  thumbnailUrls?: string[];
  imageCrops?: Array<{ zoom: number; offsetX: number; offsetY: number }>;
  badge?: string;
  isActive: boolean;
  totalStockQuantity: number;
  variants: AdministrationProductVariant[];
};
