import type { SupabaseClient } from "@supabase/supabase-js";

import { StoreSettingsSupabaseDataSource } from "@/features/store-settings/data/datasources/store-settings-supabase-datasource";
import { StoreSettingsRepositoryImpl } from "@/features/store-settings/data/repositories/store-settings-repository-impl";
import { GetStoreSettingsUseCase } from "@/features/store-settings/domain/usecases/get-store-settings-usecase";
import { UpdateStoreSettingsUseCase } from "@/features/store-settings/domain/usecases/update-store-settings-usecase";

function createStoreSettingsRepository(supabaseClient: SupabaseClient) {
  return new StoreSettingsRepositoryImpl(new StoreSettingsSupabaseDataSource(supabaseClient));
}

export function createGetStoreSettingsUseCaseWithClient(supabaseClient: SupabaseClient) {
  return new GetStoreSettingsUseCase(createStoreSettingsRepository(supabaseClient));
}

export function createUpdateStoreSettingsUseCaseWithClient(supabaseClient: SupabaseClient) {
  return new UpdateStoreSettingsUseCase(createStoreSettingsRepository(supabaseClient));
}
