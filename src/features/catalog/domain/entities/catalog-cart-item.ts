export type CatalogCartItem = {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  imageUrl?: string;
  size: string;
  color: string;
  model: string;
  unitPrice: number;
  quantity: number;
  availableQuantity: number;
};
