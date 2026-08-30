"use client";

import { useMemo, useState } from "react";

import { formatCurrencyInput } from "@/core/utils/format/currency-input";
import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import {
  emptyAdministrationProductDraft,
  initialAdministrationDashboardViewState,
  type AdministrationImageCrop,
  type AdministrationDashboardViewState,
  type AdministrationProductDraft,
} from "@/features/administration/presentation/viewmodels/administration-dashboard-view-state";

function createDraftFromProduct(product: AdministrationProduct | undefined): AdministrationProductDraft {
  const imageUrls = product?.imageUrls.slice(0, 3) ?? [];
  const sizes = product ? Array.from(new Set(product.variants.map((variant) => variant.size))) : [];
  const colors = product ? Array.from(new Set(product.variants.map((variant) => variant.color))) : [];
  const models = product ? Array.from(new Set(product.variants.map((variant) => variant.model))) : [];

  return {
    name: product?.name ?? "",
    category: product?.category ?? "",
    basePrice: product ? formatCurrencyInput(String(Math.round(product.basePrice * 100))) : "",
    totalStockQuantity: product?.totalStockQuantity ?? 0,
    sizes,
    colors,
    models,
    imageUrls: [imageUrls[0] ?? "", imageUrls[1] ?? "", imageUrls[2] ?? ""],
    imageCrops: [
      { zoom: 1, offsetX: 0, offsetY: 0 },
      { zoom: 1, offsetX: 0, offsetY: 0 },
      { zoom: 1, offsetX: 0, offsetY: 0 },
    ],
  };
}

export function useAdministrationDashboardViewModel(initialProducts: AdministrationProduct[]) {
  const [state, setState] = useState<AdministrationDashboardViewState>(() => ({
    ...initialAdministrationDashboardViewState,
    status: "success",
    products: initialProducts,
  }));

  const filteredProducts = useMemo(() => {
    const normalizedQuery = state.query.trim().toLowerCase();

    return state.products.filter((product) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [state.products, state.query]);

  const selectedProduct =
    filteredProducts.find((product) => product.id === state.selectedProductId) ??
    state.products.find((product) => product.id === state.selectedProductId) ??
    null;

  function updateQuery(query: string) {
    setState((current) => ({ ...current, query }));
  }

  function openExistingProduct(productId: string) {
    const nextProduct = state.products.find((product) => product.id === productId);

    setState((current) => ({
      ...current,
      selectedProductId: productId,
      isProductDrawerOpen: true,
      editorMode: "edit",
      saveStatus: "idle",
      draft: createDraftFromProduct(nextProduct),
    }));
  }

  function openNewProductDrawer() {
    setState((current) => ({
      ...current,
      selectedProductId: null,
      isProductDrawerOpen: true,
      editorMode: "create",
      saveStatus: "idle",
      draft: emptyAdministrationProductDraft,
    }));
  }

  function closeProductDrawer() {
    setState((current) => ({
      ...current,
      isProductDrawerOpen: false,
      saveStatus: "idle",
    }));
  }

  function updateDraftField<K extends "name" | "category">(
    field: K,
    value: AdministrationProductDraft[K],
  ) {
    setState((current) => ({
      ...current,
      saveStatus: "idle",
      draft: {
        ...current.draft,
        [field]: value,
      },
    }));
  }

  function updateDraftPrice(value: string) {
    setState((current) => ({
      ...current,
      saveStatus: "idle",
      draft: {
        ...current.draft,
        basePrice: formatCurrencyInput(value),
      },
    }));
  }

  function incrementDraftStock() {
    setState((current) => ({
      ...current,
      saveStatus: "idle",
      draft: {
        ...current.draft,
        totalStockQuantity: current.draft.totalStockQuantity + 1,
      },
    }));
  }

  function decrementDraftStock() {
    setState((current) => ({
      ...current,
      saveStatus: "idle",
      draft: {
        ...current.draft,
        totalStockQuantity: Math.max(0, current.draft.totalStockQuantity - 1),
      },
    }));
  }

  function toggleDraftListField(field: "sizes" | "colors" | "models", value: string) {
    setState((current) => {
      const currentValues = current.draft[field];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...current,
        saveStatus: "idle",
        draft: {
          ...current.draft,
          [field]: nextValues,
        },
      };
    });
  }

  function updateDraftImage(index: 0 | 1 | 2, value: string) {
    setState((current) => {
      const nextImageUrls: [string, string, string] = [...current.draft.imageUrls] as [
        string,
        string,
        string,
      ];
      const nextImageCrops = [...current.draft.imageCrops] as [
        AdministrationImageCrop,
        AdministrationImageCrop,
        AdministrationImageCrop,
      ];

      nextImageUrls[index] = value;
      nextImageCrops[index] = { zoom: 1, offsetX: 0, offsetY: 0 };

      return {
        ...current,
        saveStatus: "idle",
        draft: {
          ...current.draft,
          imageUrls: nextImageUrls,
          imageCrops: nextImageCrops,
        },
      };
    });
  }

  function updateDraftImageCrop(
    index: 0 | 1 | 2,
    patch: Partial<AdministrationImageCrop>,
  ) {
    setState((current) => {
      const nextImageCrops = [...current.draft.imageCrops] as [
        AdministrationImageCrop,
        AdministrationImageCrop,
        AdministrationImageCrop,
      ];

      nextImageCrops[index] = {
        ...nextImageCrops[index],
        ...patch,
      };

      return {
        ...current,
        saveStatus: "idle",
        draft: {
          ...current.draft,
          imageCrops: nextImageCrops,
        },
      };
    });
  }

  function saveSelections() {
    setState((current) => ({ ...current, saveStatus: "saved" }));
  }

  return {
    state,
    filteredProducts,
    selectedProduct,
    actions: {
      updateQuery,
      openExistingProduct,
      openNewProductDrawer,
      closeProductDrawer,
      updateDraftField,
      updateDraftPrice,
      incrementDraftStock,
      decrementDraftStock,
      toggleDraftListField,
      updateDraftImage,
      updateDraftImageCrop,
      saveSelections,
    },
  };
}
