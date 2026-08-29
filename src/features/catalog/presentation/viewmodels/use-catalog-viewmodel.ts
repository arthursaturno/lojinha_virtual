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

  function updateQuery(query: string) {
    setState((current) => ({ ...current, query }));
  }

  function updateCategory(category: string) {
    setState((current) => ({ ...current, category }));
  }

  function updateSort(sort: CatalogSortOption) {
    setState((current) => ({ ...current, sort }));
  }

  function updateSelection(selection: Partial<ProductSelection>) {
    setState((current) => ({
      ...current,
      selection: {
        ...current.selection,
        ...selection,
      },
    }));
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
    }));
    setSizeFilters([]);
    setColorFilters([]);
    setModelFilters([]);
    setMaxPrice(450);
  }

  return {
    state,
    filteredProducts,
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
    formattedMaxPrice: formatCurrency(maxPrice),
    actions: {
      updateQuery,
      updateCategory,
      updateSort,
      updateSelection,
      openProduct,
      closeProduct,
      clearFilters,
      updateMaxPrice: setMaxPrice,
      toggleSizeFilter: (size: string) => setSizeFilters((current) => toggleListValue(current, size)),
      toggleColorFilter: (color: string) => setColorFilters((current) => toggleListValue(current, color)),
      toggleModelFilter: (model: string) => setModelFilters((current) => toggleListValue(current, model)),
    },
  };
}
