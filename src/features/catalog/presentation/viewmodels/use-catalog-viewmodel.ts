"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { formatCurrency } from "@/core/utils/format/currency";
import type { PromotionCartBenefit, PromotionCartValidation } from "@/core/promotions/promotion";
import type { Result } from "@/core/result/result";
import type { StoreFilterOptions } from "@/core/store-filters/store-filter-options";
import type { CatalogProduct } from "@/features/catalog/domain/entities/catalog-product";
import type { CatalogCartItem } from "@/features/catalog/domain/entities/catalog-cart-item";
import type { GetCatalogCartUseCase } from "@/features/catalog/domain/usecases/get-catalog-cart-usecase";
import type { SaveCatalogCartUseCase } from "@/features/catalog/domain/usecases/save-catalog-cart-usecase";
import type {
  CatalogSortOption,
  CatalogViewState,
  ProductSelection,
} from "@/features/catalog/presentation/viewmodels/catalog-view-state";
import { initialCatalogViewState } from "@/features/catalog/presentation/viewmodels/catalog-view-state";

const allCategory = "Todos";
const pageSize = 10;

function toggleListValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function toPromotionItems(items: CatalogCartItem[]) {
  return items.map((item) => ({ variantId: item.variantId, quantity: item.quantity }));
}

type CatalogCartActions = {
  get: Pick<GetCatalogCartUseCase, "call">;
  save: Pick<SaveCatalogCartUseCase, "call">;
};

type CatalogPromotionActions = {
  listAvailableCartBenefits: {
    call(input: { items: Array<{ variantId: string; quantity: number }> }): Promise<Result<PromotionCartBenefit[]>>;
  };
  validateCartBenefit: {
    call(input: { promotionId?: string; items: Array<{ variantId: string; quantity: number }> }): Promise<Result<PromotionCartValidation>>;
  };
};

export function useCatalogViewModel(
  initialProducts: CatalogProduct[],
  configuredFilters?: StoreFilterOptions,
  cartActions?: CatalogCartActions,
  promotionActions?: CatalogPromotionActions,
) {
  const [state, setState] = useState<CatalogViewState>({
    ...initialCatalogViewState,
    status: "success",
    products: initialProducts,
  });
  const [sizeFilters, setSizeFilters] = useState<string[]>([]);
  const [colorFilters, setColorFilters] = useState<string[]>([]);
  const [modelFilters, setModelFilters] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(450);
  const hasCartMutationRef = useRef(false);

  const refreshAvailableCartBenefits = useCallback(async (items: CatalogCartItem[]) => {
    if (!promotionActions || !items.length) {
      setState((current) => ({ ...current, availableCartBenefits: [], selectedCartBenefitId: undefined, promotionValidation: undefined }));
      return;
    }

    const result = await promotionActions.listAvailableCartBenefits.call({ items: toPromotionItems(items) });
    if (!result.ok) {
      setState((current) => ({ ...current, cartMessage: result.failure.message }));
      return;
    }

    const validationResult = await promotionActions.validateCartBenefit.call({
      items: toPromotionItems(items),
    });

    setState((current) => ({
      ...current,
      availableCartBenefits: result.data,
      selectedCartBenefitId: undefined,
      promotionValidation: validationResult.ok ? validationResult.data : undefined,
    }));
  }, [promotionActions]);

  useEffect(() => {
    if (!cartActions) return;

    void cartActions.get.call().then((result) => {
      if (!result.ok) {
        setState((current) => ({ ...current, cartMessage: result.failure.message }));
        return;
      }
      if (hasCartMutationRef.current) return;
      setState((current) => ({ ...current, cartItems: result.data }));
      void refreshAvailableCartBenefits(result.data);
    });
  }, [cartActions, refreshAvailableCartBenefits]);

  const categories = useMemo(
    () => {
      const configuredCategories = configuredFilters?.category ?? initialProducts.map((product) => product.category);

      return [...new Set([...configuredCategories.filter(Boolean), allCategory])];
    },
    [configuredFilters, initialProducts],
  );

  const availableSizes = useMemo(
    () => (configuredFilters?.size ?? Array.from(new Set(initialProducts.flatMap((product) => product.variants.map((variant) => variant.size))))),
    [configuredFilters, initialProducts],
  );

  const availableColors = useMemo(
    () => (configuredFilters?.color ?? Array.from(new Set(initialProducts.flatMap((product) => product.variants.map((variant) => variant.color))))),
    [configuredFilters, initialProducts],
  );

  const availableModels = useMemo(
    () => (configuredFilters?.model ?? Array.from(new Set(initialProducts.flatMap((product) => product.variants.map((variant) => variant.model))))),
    [configuredFilters, initialProducts],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = state.query.trim().toLowerCase();

    const filtered = state.products.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory = state.category === allCategory || product.category === state.category;
      const matchesSize =
        sizeFilters.length === 0 ||
        product.variants.some((variant) => sizeFilters.includes(variant.size));
      const matchesColor =
        colorFilters.length === 0 ||
        product.variants.some((variant) => colorFilters.includes(variant.color));
      const matchesModel =
        modelFilters.length === 0 ||
        product.variants.some((variant) => modelFilters.includes(variant.model));

      return product.stockQuantity > 0 && matchesQuery && matchesCategory && matchesSize && matchesColor && matchesModel;
    });

    if (state.sort === "lowest-price") {
      return [...filtered].sort((first, second) => first.price - second.price);
    }

    if (state.sort === "highest-price") {
      return [...filtered].sort((first, second) => second.price - first.price);
    }

    return filtered;
  }, [colorFilters, modelFilters, sizeFilters, state]);

  const categoryCount = useMemo(
    () =>
      categories.reduce<Record<string, number>>((counts, category) => {
        counts[category] =
          category === allCategory
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
      (state.selectedProduct?.stockQuantity ?? 0) > 0,
  );
  const selectedProductBasePrice = state.selectedProduct?.originalPrice ?? state.selectedProduct?.price ?? 0;
  const selectedProductPromotionRatio = selectedProductBasePrice > 0
    ? (state.selectedProduct?.price ?? 0) / selectedProductBasePrice
    : 1;
  const activeUnitPrice = (selectedVariant?.price ?? state.selectedProduct?.price ?? 0) * selectedProductPromotionRatio;
  const orderTotal = activeUnitPrice * state.selection.quantity;
  const cartTotal = state.cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const checkoutTotal = state.promotionValidation ? state.promotionValidation.finalTotal : cartTotal;

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
      const maxQuantity = Math.max(1, current.selectedProduct?.stockQuantity ?? 1);

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
      const maxQuantity = Math.max(1, current.selectedProduct?.stockQuantity ?? 1);
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

  function persistCart(items: CatalogCartItem[]) {
    hasCartMutationRef.current = true;
    if (!cartActions) return;

    void cartActions.save.call(items).then((result) => {
      if (!result.ok) {
        setState((current) => ({ ...current, cartMessage: result.failure.message }));
      }
    });
  }

  function addCurrentProductToCart() {
    const product = state.selectedProduct;
    if (!product || !selectedVariant || !isSelectionReady) return;
    const itemId = `${product.id}:${selectedVariant.id}`;
    const cartItem: CatalogCartItem = {
      id: itemId,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      imageUrl: product.images[0],
      size: state.selection.size,
      color: state.selection.color,
      model: state.selection.model,
      unitPrice: activeUnitPrice,
      quantity: state.selection.quantity,
      availableQuantity: product.stockQuantity,
    };
    const currentItem = state.cartItems.find((item) => item.id === itemId);
    const nextItems = currentItem
      ? state.cartItems.map((item) => item.id === itemId ? { ...item, quantity: Math.min(item.availableQuantity, item.quantity + cartItem.quantity) } : item)
      : [...state.cartItems, cartItem];
    setState((current) => ({ ...current, cartItems: nextItems, promotionValidation: undefined, cartMessage: "Produto adicionado ao carrinho." }));
    persistCart(nextItems);
    void refreshAvailableCartBenefits(nextItems);
  }

  function updateCartItemQuantity(itemId: string, quantity: number) {
    const nextItems = state.cartItems.map((item) => item.id === itemId ? { ...item, quantity: Math.min(item.availableQuantity, Math.max(1, quantity)) } : item);
    setState((current) => ({ ...current, cartItems: nextItems, promotionValidation: undefined }));
    persistCart(nextItems);
    void refreshAvailableCartBenefits(nextItems);
  }

  function removeCartItem(itemId: string) {
    const nextItems = state.cartItems.filter((item) => item.id !== itemId);
    setState((current) => ({ ...current, cartItems: nextItems, promotionValidation: undefined }));
    persistCart(nextItems);
    void refreshAvailableCartBenefits(nextItems);
  }

  function clearCartMessage() {
    setState((current) => ({ ...current, cartMessage: undefined }));
  }

  async function selectCartBenefit(promotionId?: string): Promise<PromotionCartValidation | null> {
    if (!promotionActions) {
      setState((current) => ({ ...current, cartMessage: "As promocoes ainda nao estao configuradas." }));
      return null;
    }
    const result = await promotionActions.validateCartBenefit.call({
      promotionId,
      items: toPromotionItems(state.cartItems),
    });
    if (!result.ok) {
      setState((current) => ({ ...current, cartMessage: result.failure.message }));
      return null;
    }
    const promotionValidation = result.data;
    setState((current) => ({
      ...current,
      selectedCartBenefitId: promotionValidation.isValid ? promotionId : undefined,
      promotionValidation,
      cartMessage: promotionValidation.message,
    }));
    return promotionValidation;
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
      category: allCategory,
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
    cartTotal,
    checkoutTotal,
    formattedCartTotal: formatCurrency(checkoutTotal),
    formattedMaxPrice: formatCurrency(maxPrice),
    actions: {
      updateQuery,
      updateCategory,
      updateSort,
      updateCurrentPage,
      updateSelection,
      updateQuantity,
      addCurrentProductToCart,
      updateCartItemQuantity,
      removeCartItem,
      clearCartMessage,
      selectCartBenefit,
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
