import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";

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
  errorMessage?: string;
};

export const initialCatalogViewState: CatalogViewState = {
  status: "initial",
  products: [],
  query: "",
  category: "Roupas",
  selectedProduct: null,
  selection: {
    size: "",
    color: "",
    model: "",
    quantity: 1,
  },
  sort: "recent",
  currentPage: 1,
};
