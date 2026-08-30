"use client";

import { useMemo, useState } from "react";

import { formatCurrencyInput } from "@/core/utils/format/currency-input";
import { distributeStockQuantity } from "@/core/utils/numbers/distribute-stock-quantity";
import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import type { CreateAdministrationProductUseCase } from "@/features/administration/domain/usecases/create-administration-product-usecase";
import type { DeleteAdministrationProductUseCase } from "@/features/administration/domain/usecases/delete-administration-product-usecase";
import type { DeleteAdministrationProductImagesUseCase } from "@/features/administration/domain/usecases/delete-administration-product-images-usecase";
import type { UpdateAdministrationProductUseCase } from "@/features/administration/domain/usecases/update-administration-product-usecase";
import type { AdministrationProductImageUpload } from "@/features/administration/domain/entities/administration-product-image-upload";
import type { UploadAdministrationProductImageUseCase } from "@/features/administration/domain/usecases/upload-administration-product-image-usecase";
import {
  emptyAdministrationProductDraft,
  initialAdministrationDashboardViewState,
  administrationProductsPerPage,
  type AdministrationDashboardViewState,
  type AdministrationImageCrop,
  type AdministrationProductDraft,
} from "@/features/administration/presentation/viewmodels/administration-dashboard-view-state";

function createDefaultImageCrop(): AdministrationImageCrop {
  return { zoom: 1, offsetX: 0, offsetY: 0 };
}

function createDraftFromProduct(product: AdministrationProduct | undefined): AdministrationProductDraft {
  const imageUrls = product?.imageUrls.slice(0, 3) ?? [];
  const thumbnailUrls = product?.thumbnailUrls?.slice(0, 3) ?? [];
  const sizes = product ? Array.from(new Set(product.variants.map((variant) => variant.size))) : [];
  const colors = product ? Array.from(new Set(product.variants.map((variant) => variant.color))) : [];
  const models = product ? Array.from(new Set(product.variants.map((variant) => variant.model))) : [];

  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "",
    basePrice: product ? formatCurrencyInput(String(Math.round(product.basePrice * 100))) : "",
    isActive: product?.isActive ?? true,
    totalStockQuantity: product?.totalStockQuantity ?? 0,
    sizes,
    colors,
    models,
    imageUrls: [imageUrls[0] ?? "", imageUrls[1] ?? "", imageUrls[2] ?? ""],
    thumbnailUrls: [thumbnailUrls[0] ?? "", thumbnailUrls[1] ?? "", thumbnailUrls[2] ?? ""],
    imageCrops: [
      product?.imageCrops?.[0] ?? createDefaultImageCrop(),
      product?.imageCrops?.[1] ?? createDefaultImageCrop(),
      product?.imageCrops?.[2] ?? createDefaultImageCrop(),
    ],
  };
}

function parseCurrencyInput(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".");

  return Number(normalized || "0");
}

function createProductFromDraft(
  draft: AdministrationProductDraft,
  selectedProductId: string | null,
): AdministrationProduct {
  const sizes = draft.sizes.length > 0 ? draft.sizes : ["UN"];
  const colors = draft.colors.length > 0 ? draft.colors : ["Padrao"];
  const models = draft.models.length > 0 ? draft.models : ["Basico"];
  const price = parseCurrencyInput(draft.basePrice);
  const variantOptions = sizes.flatMap((size) =>
    colors.flatMap((color) => models.map((model) => ({ size, color, model }))),
  );
  const stockQuantities = distributeStockQuantity(draft.totalStockQuantity, variantOptions.length);

  return {
    id: selectedProductId ?? `draft-${Date.now()}`,
    name: draft.name.trim() || "Novo produto",
    description: draft.description.trim(),
    category: draft.category || "Sem categoria",
    colorLabel: draft.colors[0] ?? "Sem cor",
    basePrice: price,
    imageUrls: draft.imageUrls.filter(Boolean),
    thumbnailUrls: draft.imageUrls.reduce<string[]>((thumbnails, imageUrl, index) => {
      if (imageUrl) thumbnails.push(draft.thumbnailUrls[index] || imageUrl);
      return thumbnails;
    }, []),
    imageCrops: draft.imageUrls.reduce<AdministrationImageCrop[]>((crops, imageUrl, index) => {
      if (imageUrl) crops.push(draft.imageCrops[index]);
      return crops;
    }, []),
    badge: draft.isActive ? "ATIVO" : "PAUSADO",
    isActive: draft.isActive,
    totalStockQuantity: draft.totalStockQuantity,
    variants: variantOptions.map((variant, index) => ({
          id: `${selectedProductId ?? "draft"}-${index}`,
          size: variant.size,
          color: variant.color,
          model: variant.model,
          price,
          stockQuantity: stockQuantities[index],
          status: stockQuantities[index] > 3 ? "in-stock" : "low-stock",
        })),
  };
}

type AdministrationProductActions = {
  create: CreateAdministrationProductUseCase;
  update: UpdateAdministrationProductUseCase;
  delete: DeleteAdministrationProductUseCase;
  deleteImages: DeleteAdministrationProductImagesUseCase;
  uploadImage: UploadAdministrationProductImageUseCase;
};

function isStoredProductImage(imageUrl: string): boolean {
  return imageUrl.startsWith("http");
}

export function useAdministrationDashboardViewModel(
  initialProducts: AdministrationProduct[],
  productActions?: AdministrationProductActions,
) {
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
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [state.products, state.query]);

  const selectedProduct =
    filteredProducts.find((product) => product.id === state.selectedProductId) ??
    state.products.find((product) => product.id === state.selectedProductId) ??
    null;

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / administrationProductsPerPage));
  const currentPage = Math.min(state.currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * administrationProductsPerPage,
    currentPage * administrationProductsPerPage,
  );

  function updateQuery(query: string) {
    setState((current) => ({ ...current, query, currentPage: 1 }));
  }

  function dismissFeedback() {
    setState((current) => ({ ...current, feedbackMessage: undefined }));
  }

  function setCurrentPage(page: number) {
    setState((current) => ({ ...current, currentPage: Math.max(1, Math.min(page, totalPages)) }));
  }

  function openExistingProduct(productId: string) {
    const nextProduct = state.products.find((product) => product.id === productId);

    setState((current) => ({
      ...current,
      selectedProductId: productId,
      isProductDrawerOpen: true,
      editorMode: "edit",
      saveStatus: "idle",
      feedbackMessage: undefined,
      pendingImageDeletionUrls: [],
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
      feedbackMessage: undefined,
      pendingImageDeletionUrls: [],
      draft: emptyAdministrationProductDraft,
    }));
  }

  function closeProductDrawer() {
    setState((current) => ({
      ...current,
      isProductDrawerOpen: false,
      saveStatus: "idle",
      feedbackMessage: undefined,
    }));
  }

  function updateDraftField<K extends "name" | "category" | "description">(
    field: K,
    value: AdministrationProductDraft[K],
  ) {
    setState((current) => ({
      ...current,
      saveStatus: "idle",
      feedbackMessage: undefined,
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
      feedbackMessage: undefined,
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
      feedbackMessage: undefined,
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
      feedbackMessage: undefined,
      draft: {
        ...current.draft,
        totalStockQuantity: Math.max(0, current.draft.totalStockQuantity - 1),
      },
    }));
  }

  function toggleDraftActive() {
    setState((current) => ({
      ...current,
      saveStatus: "idle",
      feedbackMessage: undefined,
      draft: {
        ...current.draft,
        isActive: !current.draft.isActive,
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
        feedbackMessage: undefined,
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
      const nextThumbnailUrls: [string, string, string] = [...current.draft.thumbnailUrls] as [
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
      nextThumbnailUrls[index] = value;
      nextImageCrops[index] = createDefaultImageCrop();

      return {
        ...current,
        saveStatus: "idle",
        feedbackMessage: undefined,
        pendingImageDeletionUrls:
          current.draft.imageUrls[index] !== value && isStoredProductImage(current.draft.imageUrls[index])
            ? [...new Set([...current.pendingImageDeletionUrls, current.draft.imageUrls[index]])]
            : current.pendingImageDeletionUrls,
        draft: {
          ...current.draft,
          imageUrls: nextImageUrls,
          thumbnailUrls: nextThumbnailUrls,
          imageCrops: nextImageCrops,
        },
      };
    });
  }

  function updateDraftImageCrop(index: 0 | 1 | 2, patch: Partial<AdministrationImageCrop>) {
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
        feedbackMessage: undefined,
        draft: {
          ...current.draft,
          imageCrops: nextImageCrops,
        },
      };
    });
  }

  async function uploadDraftImage(index: 0 | 1 | 2, upload: AdministrationProductImageUpload) {
    if (!productActions) {
      return false;
    }

    setState((current) => ({ ...current, saveStatus: "loading", feedbackMessage: undefined }));
    const result = await productActions.uploadImage.call(upload);
    if (!result.ok) {
      setState((current) => ({ ...current, saveStatus: "failure", feedbackMessage: result.failure.message }));
      return false;
    }

    setState((current) => {
      const previousImageUrl = current.draft.imageUrls[index];
      const imageUrls = [...current.draft.imageUrls] as [string, string, string];
      const thumbnailUrls = [...current.draft.thumbnailUrls] as [string, string, string];
      imageUrls[index] = result.data.detailUrl;
      thumbnailUrls[index] = result.data.thumbnailUrl;
      return {
        ...current,
        saveStatus: "idle",
        feedbackMessage: undefined,
        pendingImageDeletionUrls:
          previousImageUrl && previousImageUrl !== result.data.detailUrl && isStoredProductImage(previousImageUrl)
            ? [...new Set([...current.pendingImageDeletionUrls, previousImageUrl])]
            : current.pendingImageDeletionUrls,
        draft: { ...current.draft, imageUrls, thumbnailUrls },
      };
    });
    return true;
  }

  function reportImageUploadFailure(message: string) {
    setState((current) => ({ ...current, saveStatus: "failure", feedbackMessage: message }));
  }

  async function saveSelections() {
    if (productActions) {
      const product = createProductFromDraft(state.draft, state.selectedProductId);
      const imageUrlsToDelete = state.pendingImageDeletionUrls;
      setState((current) => ({ ...current, saveStatus: "loading", feedbackMessage: undefined }));
      const result = await (state.editorMode === "create" ? productActions.create : productActions.update).call(product);

      if (!result.ok) {
        setState((current) => ({ ...current, saveStatus: "failure", feedbackMessage: result.failure.message }));
        return;
      }

      const deleteImagesResult = await productActions.deleteImages.call(imageUrlsToDelete);

      setState((current) => {
        const nextProducts = current.editorMode === "create"
          ? [result.data, ...current.products]
          : current.products.map((item) => (item.id === result.data.id ? result.data : item));
        return { ...current, products: nextProducts, currentPage: current.editorMode === "create" ? 1 : current.currentPage, selectedProductId: result.data.id, editorMode: "edit", saveStatus: deleteImagesResult.ok ? "saved" : "failure", feedbackMessage: deleteImagesResult.ok ? (current.editorMode === "create" ? "Produto criado com sucesso." : "Produto atualizado com sucesso.") : deleteImagesResult.failure.message, pendingImageDeletionUrls: deleteImagesResult.ok ? [] : current.pendingImageDeletionUrls };
      });
      return;
    }

    setState((current) => {
      const nextProduct = createProductFromDraft(current.draft, current.selectedProductId);
      const nextProducts =
        current.editorMode === "create"
          ? [nextProduct, ...current.products]
          : current.products.map((product) => (product.id === nextProduct.id ? nextProduct : product));

      return {
        ...current,
        products: nextProducts,
        currentPage: current.editorMode === "create" ? 1 : current.currentPage,
        selectedProductId: nextProduct.id,
        editorMode: "edit",
        saveStatus: "saved",
        feedbackMessage:
          current.editorMode === "create"
            ? "Produto criado no MVP local."
            : "Produto atualizado no MVP local.",
      };
    });
  }

  async function deleteSelectedProduct() {
    if (productActions && state.selectedProductId) {
      const selectedProductImages = state.products.find((product) => product.id === state.selectedProductId)?.imageUrls ?? [];
      setState((current) => ({ ...current, saveStatus: "loading", feedbackMessage: undefined }));
      const result = await productActions.delete.call(state.selectedProductId);
      if (!result.ok) {
        setState((current) => ({ ...current, saveStatus: "failure", feedbackMessage: result.failure.message }));
        return;
      }
      const deleteImagesResult = await productActions.deleteImages.call(selectedProductImages);
      if (!deleteImagesResult.ok) {
        setState((current) => ({ ...current, saveStatus: "failure", feedbackMessage: deleteImagesResult.failure.message }));
        return;
      }
    }

    setState((current) => {
      if (!current.selectedProductId) {
        return current;
      }

      return {
        ...current,
        products: current.products.filter((product) => product.id !== current.selectedProductId),
        currentPage: Math.max(
          1,
          Math.min(
            current.currentPage,
            Math.ceil((current.products.length - 1) / administrationProductsPerPage) || 1,
          ),
        ),
        selectedProductId: null,
        isProductDrawerOpen: false,
        editorMode: "create",
        saveStatus: "idle",
        draft: emptyAdministrationProductDraft,
        feedbackMessage: "Produto removido do MVP local.",
      };
    });
  }

  return {
    state,
    filteredProducts,
    paginatedProducts,
    currentPage,
    totalPages,
    selectedProduct,
    actions: {
      updateQuery,
      dismissFeedback,
      setCurrentPage,
      openExistingProduct,
      openNewProductDrawer,
      closeProductDrawer,
      updateDraftField,
      updateDraftPrice,
      incrementDraftStock,
      decrementDraftStock,
      toggleDraftActive,
      toggleDraftListField,
      updateDraftImage,
      uploadDraftImage,
      reportImageUploadFailure,
      updateDraftImageCrop,
      saveSelections,
      deleteSelectedProduct,
    },
  };
}
