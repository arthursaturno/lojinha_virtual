import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import type { CatalogCartItem } from "@/features/catalog/domain/entities/catalog-cart-item";
import type { PromotionCouponValidation } from "@/core/promotions/promotion";

export type CatalogStatus = "initial" | "loading" | "success" | "failure";

export type CatalogSortOption = "recent" | "lowest-price" | "highest-price";

export type ProductSelection = {
  size: string;
  color: string;
  model: string;
  quantity: number;
};

export type CatalogViewState = {
  status: CatalogStatus;
  products: CatalogProduct[];
  query: string;
  category: string;
  selectedProduct: CatalogProduct | null;
  selection: ProductSelection;
  sort: CatalogSortOption;
  currentPage: number;
  cartItems: CatalogCartItem[];
  cartMessage?: string;
  couponCode: string;
  couponValidation?: PromotionCouponValidation;
  errorMessage?: string;
};

export const initialCatalogViewState: CatalogViewState = {
  status: "initial",
  products: [],
  query: "",
  category: "Todos",
  selectedProduct: null,
  selection: {
    size: "",
    color: "",
    model: "",
    quantity: 1,
  },
  sort: "recent",
  currentPage: 1,
  cartItems: [],
  couponCode: "",
};
