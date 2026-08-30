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
  category: string;
  colorLabel: string;
  basePrice: number;
  imageUrls: string[];
  badge?: string;
  totalStockQuantity: number;
  variants: AdministrationProductVariant[];
};
