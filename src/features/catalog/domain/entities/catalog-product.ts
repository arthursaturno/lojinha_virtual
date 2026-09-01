export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  model: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  isActive: boolean;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stockQuantity: number;
  badge?: string;
  promotionLabel?: string;
  variants: ProductVariant[];
};
