export type StoreFilterType = "category" | "size" | "color" | "model";

export type StoreFilterOptions = Record<StoreFilterType, string[]>;

const storefrontCategoryPriority = new Map([
  ["camisa", 0],
  ["camisas", 0],
  ["short", 1],
  ["shorts", 1],
  ["bermuda", 2],
  ["bermudas", 2],
]);

function normalizeStorefrontText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

export const predefinedStoreFilterOptions: StoreFilterOptions = {
  category: ["Camisetas", "Camisas", "Regatas", "Polos", "Blusas", "Moletons", "Calcas", "Bermudas", "Shorts", "Jaquetas", "Casacos", "Conjuntos", "Vestidos", "Saias", "Tenis", "Sapatos", "Sandalias", "Bolsas", "Acessorios"],
  size: ["PP", "P", "M", "G", "GG", "XG", "UN", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
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

export function prioritizeStorefrontCategories(categories: string[]): string[] {
  return [...categories].sort((first, second) => {
    const firstPriority = getStorefrontCategoryPriority(first);
    const secondPriority = getStorefrontCategoryPriority(second);

    return firstPriority - secondPriority;
  });
}

export function getStorefrontCategoryPriority(category: string): number {
  return storefrontCategoryPriority.get(normalizeStorefrontText(category)) ?? Number.MAX_SAFE_INTEGER;
}

export function getStorefrontProductPriority(category: string, productName: string): number {
  const normalizedProductName = normalizeStorefrontText(productName);
  const isPoloShirt = normalizedProductName.includes("camisa polo");
  const isTeamShirt = (getStorefrontCategoryPriority(category) === 0 || isPoloShirt) && /\btime\b/.test(normalizedProductName);

  if (isTeamShirt) return Number.MAX_SAFE_INTEGER;
  if (isPoloShirt) return 0;

  return getStorefrontCategoryPriority(category);
}
