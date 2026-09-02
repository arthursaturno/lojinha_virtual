import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";
import type { AdministrationProductImageUpload } from "@/features/administration/domain/entities/administration-product-image-upload";

export type AdministrationDashboardStatus = "initial" | "loading" | "success" | "failure";
export type AdministrationSaveStatus = "idle" | "loading" | "saved" | "failure";
export type AdministrationEditorMode = "create" | "edit";
export const administrationProductsPerPage = 10;

export const administrationCategoryOptions = [
  "Camisetas",
  "Camisas",
  "Regatas",
  "Polos",
  "Blusas",
  "Moletons",
  "Calcas",
  "Bermudas",
  "Shorts",
  "Jaquetas",
  "Casacos",
  "Conjuntos",
  "Vestidos",
  "Saias",
  "Tenis",
  "Sapatos",
  "Sandalias",
  "Bolsas",
  "Acessorios",
] as const;

export const administrationSizeOptions = [
  "PP",
  "P",
  "M",
  "G",
  "GG",
  "XG",
  "UN",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
] as const;
export const administrationColorOptions = [
  "Preto",
  "Branco",
  "Cinza",
  "Verde",
  "Azul",
  "Bege",
  "Marrom",
  "Rosa",
  "Amarelo",
  "Laranja",
  "Vinho",
  "Vermelho",
] as const;
export const administrationModelOptions = [
  "Oversized",
  "Street",
  "Utility",
  "Basico",
  "Slim",
  "Regular",
  "Linho",
  "Social",
  "Casual",
  "Esportivo",
  "Cargo",
] as const;

export type AdministrationImageCrop = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

export const administrationProductImageSlots = [0, 1, 2, 3, 4] as const;
export type AdministrationImageSlot = (typeof administrationProductImageSlots)[number];
export type AdministrationImageSlots<T> = [T, T, T, T, T];

export type AdministrationProductDraft = {
  storageProductId?: string;
  name: string;
  description: string;
  category: string;
  basePrice: string;
  isActive: boolean;
  totalStockQuantity: number;
  sizes: string[];
  colors: string[];
  models: string[];
  imageUrls: AdministrationImageSlots<string>;
  thumbnailUrls: AdministrationImageSlots<string>;
  imageCrops: AdministrationImageSlots<AdministrationImageCrop>;
};

export type AdministrationDashboardViewState = {
  status: AdministrationDashboardStatus;
  query: string;
  currentPage: number;
  selectedProductId: string | null;
  isProductDrawerOpen: boolean;
  editorMode: AdministrationEditorMode;
  saveStatus: AdministrationSaveStatus;
  draft: AdministrationProductDraft;
  products: AdministrationProduct[];
  pendingImageUploads: AdministrationImageSlots<AdministrationProductImageUpload | undefined>;
  pendingImageDeletionUrls: string[];
  errorMessage?: string;
  feedbackMessage?: string;
};

export const emptyAdministrationProductDraft: AdministrationProductDraft = {
  name: "",
  description: "",
  category: "",
  basePrice: "",
  isActive: true,
  totalStockQuantity: 0,
  sizes: [],
  colors: [],
  models: [],
  imageUrls: ["", "", "", "", ""],
  thumbnailUrls: ["", "", "", "", ""],
  imageCrops: [
    { zoom: 1, offsetX: 0, offsetY: 0 },
    { zoom: 1, offsetX: 0, offsetY: 0 },
    { zoom: 1, offsetX: 0, offsetY: 0 },
    { zoom: 1, offsetX: 0, offsetY: 0 },
    { zoom: 1, offsetX: 0, offsetY: 0 },
  ],
};

export const initialAdministrationDashboardViewState: AdministrationDashboardViewState = {
  status: "initial",
  query: "",
  currentPage: 1,
  selectedProductId: null,
  isProductDrawerOpen: false,
  editorMode: "edit",
  saveStatus: "idle",
  draft: emptyAdministrationProductDraft,
  products: [],
  pendingImageUploads: [undefined, undefined, undefined, undefined, undefined],
  pendingImageDeletionUrls: [],
};
