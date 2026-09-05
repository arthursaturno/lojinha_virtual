"use client";

import { CatalogCartLocalStorageDataSourceImpl } from "@/features/catalog/data/datasources/catalog-cart-local-storage-datasource";
import { CatalogCartRepositoryImpl } from "@/features/catalog/data/repositories/catalog-cart-repository-impl";
import { GetCatalogCartUseCase } from "@/features/catalog/domain/usecases/get-catalog-cart-usecase";
import { SaveCatalogCartUseCase } from "@/features/catalog/domain/usecases/save-catalog-cart-usecase";

function createCatalogCartRepository() {
  return new CatalogCartRepositoryImpl(new CatalogCartLocalStorageDataSourceImpl());
}

export function createCatalogCartActions() {
  return {
    get: new GetCatalogCartUseCase(createCatalogCartRepository()),
    save: new SaveCatalogCartUseCase(createCatalogCartRepository()),
  };
}
