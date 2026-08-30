import type { AdministrationProduct } from "@/features/administration/domain/entities/administration-product";

export type AdministrationDashboardStatus = "initial" | "loading" | "success" | "failure";
export type AdministrationSaveStatus = "idle" | "saved";
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

export const administrationSizeOptions = ["PP", "P", "M", "G", "GG", "XG", "UN"] as const;
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

export type AdministrationProductDraft = {
  name: string;
  description: string;
  category: string;
  basePrice: string;
  isActive: boolean;
  totalStockQuantity: number;
  sizes: string[];
  colors: string[];
  models: string[];
  imageUrls: [string, string, string];
  imageCrops: [
    AdministrationImageCrop,
    AdministrationImageCrop,
    AdministrationImageCrop,
  ];
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
  imageUrls: ["", "", ""],
  imageCrops: [
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
};
