export type StoreFilterType = "category" | "size" | "color" | "model";

export type StoreFilterOptions = Record<StoreFilterType, string[]>;

export const predefinedStoreFilterOptions: StoreFilterOptions = {
  category: ["Camisetas", "Camisas", "Regatas", "Polos", "Blusas", "Moletons", "Calcas", "Bermudas", "Shorts", "Jaquetas", "Casacos", "Conjuntos", "Vestidos", "Saias", "Tenis", "Sapatos", "Sandalias", "Bolsas", "Acessorios"],
  size: ["PP", "P", "M", "G", "GG", "XG", "UN"],
  color: ["Preto", "Branco", "Cinza", "Verde", "Azul", "Bege", "Marrom", "Rosa", "Amarelo", "Laranja", "Vinho", "Vermelho"],
  model: ["Oversized", "Street", "Utility", "Basico", "Slim", "Regular", "Linho", "Social", "Casual", "Esportivo", "Cargo"],
};

export function createDefaultStoreFilterOptions(): StoreFilterOptions {
  return {
    category: [...predefinedStoreFilterOptions.category],
    size: [...predefinedStoreFilterOptions.size],
    color: [...predefinedStoreFilterOptions.color],
    model: [...predefinedStoreFilterOptions.model],
  };
}
