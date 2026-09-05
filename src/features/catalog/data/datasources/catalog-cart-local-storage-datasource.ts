import type { CatalogCartItem } from "@/features/catalog/domain/entities/catalog-cart-item";

const storageKey = "ezzion-imports:catalog-cart";

export interface CatalogCartLocalStorageDataSource {
  get(): CatalogCartItem[];
  set(items: CatalogCartItem[]): void;
}

export class CatalogCartLocalStorageDataSourceImpl implements CatalogCartLocalStorageDataSource {
  get(): CatalogCartItem[] {
    const rawCart = window.localStorage.getItem(storageKey);
    if (!rawCart) return [];
    const parsedCart: unknown = JSON.parse(rawCart);
    return Array.isArray(parsedCart) ? parsedCart as CatalogCartItem[] : [];
  }

  set(items: CatalogCartItem[]): void {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }
}
