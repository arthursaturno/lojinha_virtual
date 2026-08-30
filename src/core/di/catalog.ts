import type { SupabaseClient } from "@supabase/supabase-js";
import { CatalogProductsSupabaseDataSource } from "@/features/catalog/data/datasources/catalog-products-supabase-datasource";
import { CatalogProductsRepositoryImpl } from "@/features/catalog/data/repositories/catalog-products-repository-impl";
import { GetCatalogProductsUseCase } from "@/features/catalog/domain/usecases/get-catalog-products-usecase";

export function createCatalogProductsUseCaseWithClient(supabaseClient: SupabaseClient) {
  const repository = new CatalogProductsRepositoryImpl(new CatalogProductsSupabaseDataSource(supabaseClient));

  return new GetCatalogProductsUseCase(repository);
}
