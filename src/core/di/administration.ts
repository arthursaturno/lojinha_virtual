import type { SupabaseClient } from "@supabase/supabase-js";
import { AdministrationProductsSupabaseDataSource } from "@/features/administration/data/datasources/administration-products-supabase-datasource";
import { AdministrationProductsRepositoryImpl } from "@/features/administration/data/repositories/administration-products-repository-impl";
import { CreateAdministrationProductUseCase } from "@/features/administration/domain/usecases/create-administration-product-usecase";
import { DeleteAdministrationProductUseCase } from "@/features/administration/domain/usecases/delete-administration-product-usecase";
import { DeleteAdministrationProductImagesUseCase } from "@/features/administration/domain/usecases/delete-administration-product-images-usecase";
import { GetAdministrationProductsUseCase } from "@/features/administration/domain/usecases/get-administration-products-usecase";
import { UpdateAdministrationProductUseCase } from "@/features/administration/domain/usecases/update-administration-product-usecase";
import { UploadAdministrationProductImageUseCase } from "@/features/administration/domain/usecases/upload-administration-product-image-usecase";

function createAdministrationProductsRepository(supabaseClient: SupabaseClient) {
  return new AdministrationProductsRepositoryImpl(new AdministrationProductsSupabaseDataSource(supabaseClient));
}

export function createAdministrationProductsUseCaseWithClient(supabaseClient: SupabaseClient) { return new GetAdministrationProductsUseCase(createAdministrationProductsRepository(supabaseClient)); }
export function createCreateAdministrationProductUseCaseWithClient(supabaseClient: SupabaseClient) { return new CreateAdministrationProductUseCase(createAdministrationProductsRepository(supabaseClient)); }
export function createUpdateAdministrationProductUseCaseWithClient(supabaseClient: SupabaseClient) { return new UpdateAdministrationProductUseCase(createAdministrationProductsRepository(supabaseClient)); }
export function createDeleteAdministrationProductUseCaseWithClient(supabaseClient: SupabaseClient) { return new DeleteAdministrationProductUseCase(createAdministrationProductsRepository(supabaseClient)); }
export function createDeleteAdministrationProductImagesUseCaseWithClient(supabaseClient: SupabaseClient) { return new DeleteAdministrationProductImagesUseCase(createAdministrationProductsRepository(supabaseClient)); }
export function createUploadAdministrationProductImageUseCaseWithClient(supabaseClient: SupabaseClient) { return new UploadAdministrationProductImageUseCase(createAdministrationProductsRepository(supabaseClient)); }
