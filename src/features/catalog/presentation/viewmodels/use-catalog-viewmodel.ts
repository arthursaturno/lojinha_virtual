"use client";

import { useMemo, useState } from "react";

import { formatCurrency } from "@/core/utils/format/currency";
import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import type {
  CatalogSortOption,
  CatalogViewState,
  ProductSelection,
} from "@/features/catalog/presentation/viewmodels/catalog-view-state";
import { initialCatalogViewState } from "@/features/catalog/presentation/viewmodels/catalog-view-state";

const allCategory = "Todos";
const mainCategory = "Roupas";
const pageSize = 10;
const catalogCategories = [mainCategory, "Camisetas", "Jaquetas", "Tenis", "Acessorios", "Bolsas", allCategory];

function toggleListValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function useCatalogViewModel(initialProducts: CatalogProduct[]) {
  const [state, setState] = useState<CatalogViewState>({
    ...initialCatalogViewState,
    status: "success",
    products: initialProducts,
  });
  const [sizeFilters, setSizeFilters] = useState<string[]>([]);
  const [colorFilters, setColorFilters] = useState<string[]>([]);
  const [modelFilters, setModelFilters] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(450);

  const categories = useMemo(() => catalogCategories, []);

  const availableSizes = useMemo(
    () => Array.from(new Set(initialProducts.flatMap((product) => product.variants.map((variant) => variant.size)))),
    [initialProducts],
  );

  const availableColors = useMemo(
    () => Array.from(new Set(initialProducts.flatMap((product) => product.variants.map((variant) => variant.color)))),
    [initialProducts],
  );

  const availableModels = useMemo(
    () => Array.from(new Set(initialProducts.flatMap((product) => product.variants.map((variant) => variant.model)))),
    [initialProducts],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = state.query.trim().toLowerCase();

    const filtered = state.products.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        state.category === allCategory || state.category === mainCategory || product.category === state.category;
      const matchesPrice = product.price <= maxPrice;
      const matchesSize =
        sizeFilters.length === 0 ||
        product.variants.some((variant) => sizeFilters.includes(variant.size) && variant.stockQuantity > 0);
      const matchesColor =
        colorFilters.length === 0 ||
        product.variants.some((variant) => colorFilters.includes(variant.color) && variant.stockQuantity > 0);
      const matchesModel =
        modelFilters.length === 0 ||
        product.variants.some((variant) => modelFilters.includes(variant.model) && variant.stockQuantity > 0);

      return matchesQuery && matchesCategory && matchesPrice && matchesSize && matchesColor && matchesModel;
    });

    if (state.sort === "lowest-price") {
      return [...filtered].sort((first, second) => first.price - second.price);
    }

    if (state.sort === "highest-price") {
      return [...filtered].sort((first, second) => second.price - first.price);
    }

    return filtered;
  }, [colorFilters, maxPrice, modelFilters, sizeFilters, state]);

  const categoryCount = useMemo(
    () =>
      categories.reduce<Record<string, number>>((counts, category) => {
        counts[category] =
          category === allCategory || category === mainCategory
            ? initialProducts.length
            : initialProducts.filter((product) => product.category === category).length;

        return counts;
      }, {}),
    [categories, initialProducts],
  );
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(state.currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return filteredProducts.slice(start, start + pageSize);
  }, [currentPage, filteredProducts]);

  const selectedVariant = useMemo(() => {
    const product = state.selectedProduct;

    if (!product) {
      return null;
    }

    return (
      product.variants.find(
        (variant) =>
          variant.size === state.selection.size &&
          variant.color === state.selection.color &&
          variant.model === state.selection.model &&
          variant.isActive,
      ) ?? null
    );
  }, [state.selectedProduct, state.selection]);

  const isSelectionReady = Boolean(
    state.selection.size &&
      state.selection.color &&
      state.selection.model &&
      selectedVariant &&
      selectedVariant.stockQuantity > 0,
  );
  const activeUnitPrice = selectedVariant?.price ?? state.selectedProduct?.price ?? 0;
  const orderTotal = activeUnitPrice * state.selection.quantity;

  function updateQuery(query: string) {
    setState((current) => ({ ...current, query, currentPage: 1 }));
  }

  function updateCategory(category: string) {
    setState((current) => ({ ...current, category, currentPage: 1 }));
  }

  function updateSort(sort: CatalogSortOption) {
    setState((current) => ({ ...current, sort, currentPage: 1 }));
  }

  function resetToFirstPage() {
    setState((current) => ({ ...current, currentPage: 1 }));
  }

  function updateCurrentPage(currentPage: number) {
    setState((current) => ({
      ...current,
      currentPage: Math.min(Math.max(1, currentPage), totalPages),
    }));
  }

  function updateSelection(selection: Partial<ProductSelection>) {
    setState((current) => {
      const nextSelection = {
        ...current.selection,
        ...selection,
      };
      const nextVariant = current.selectedProduct?.variants.find(
        (item) =>
          item.size === nextSelection.size &&
          item.color === nextSelection.color &&
          item.model === nextSelection.model &&
          item.isActive,
      );
      const maxQuantity = Math.max(1, nextVariant?.stockQuantity ?? current.selectedProduct?.stockQuantity ?? 1);

      return {
        ...current,
        selection: {
          ...nextSelection,
          quantity: Math.min(nextSelection.quantity, maxQuantity),
        },
      };
    });
  }

  function updateQuantity(quantity: number) {
    setState((current) => {
      const variant = current.selectedProduct?.variants.find(
        (item) =>
          item.size === current.selection.size &&
          item.color === current.selection.color &&
          item.model === current.selection.model &&
          item.isActive,
      );
      const maxQuantity = Math.max(1, variant?.stockQuantity ?? current.selectedProduct?.stockQuantity ?? 1);
      const nextQuantity = Math.min(Math.max(1, quantity), maxQuantity);

      return {
        ...current,
        selection: {
          ...current.selection,
          quantity: nextQuantity,
        },
      };
    });
  }

  function openProduct(product: CatalogProduct) {
    setState((current) => ({
      ...current,
      selectedProduct: product,
      selection: initialCatalogViewState.selection,
    }));
  }

  function closeProduct() {
    setState((current) => ({
      ...current,
      selectedProduct: null,
      selection: initialCatalogViewState.selection,
    }));
  }

  function clearFilters() {
    setState((current) => ({
      ...current,
      query: "",
      category: "Roupas",
      sort: "recent",
      currentPage: 1,
    }));
    setSizeFilters([]);
    setColorFilters([]);
    setModelFilters([]);
    setMaxPrice(450);
  }

  function updateMaxPrice(value: number) {
    setMaxPrice(value);
    resetToFirstPage();
  }

  function toggleSizeFilter(size: string) {
    setSizeFilters((current) => toggleListValue(current, size));
    resetToFirstPage();
  }

  function toggleColorFilter(color: string) {
    setColorFilters((current) => toggleListValue(current, color));
    resetToFirstPage();
  }

  function toggleModelFilter(model: string) {
    setModelFilters((current) => toggleListValue(current, model));
    resetToFirstPage();
  }

  return {
    state,
    filteredProducts,
    paginatedProducts,
    pageSize,
    totalPages,
    currentPage,
    categories,
    categoryCount,
    availableSizes,
    availableColors,
    availableModels,
    sizeFilters,
    colorFilters,
    modelFilters,
    maxPrice,
    selectedVariant,
    isSelectionReady,
    activeUnitPrice,
    orderTotal,
    formattedOrderTotal: formatCurrency(orderTotal),
    formattedMaxPrice: formatCurrency(maxPrice),
    actions: {
      updateQuery,
      updateCategory,
      updateSort,
      updateCurrentPage,
      updateSelection,
      updateQuantity,
      openProduct,
      closeProduct,
      clearFilters,
      updateMaxPrice,
      toggleSizeFilter,
      toggleColorFilter,
      toggleModelFilter,
    },
  };
}
