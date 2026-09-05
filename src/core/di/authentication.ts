import type { SupabaseClient } from "@supabase/supabase-js";

import { AdminAuthenticationSupabaseDataSource } from "@/features/authentication/data/datasources/admin-authentication-supabase-datasource";
import { AdminAuthenticationRepositoryImpl } from "@/features/authentication/data/repositories/admin-authentication-repository-impl";
import { GetCurrentAdminSessionUseCase } from "@/features/authentication/domain/usecases/get-current-admin-session-usecase";
import { SignInAdminUseCase } from "@/features/authentication/domain/usecases/sign-in-admin-usecase";
import { SignOutAdminUseCase } from "@/features/authentication/domain/usecases/sign-out-admin-usecase";

function createAdminAuthenticationRepository(supabaseClient: SupabaseClient, adminEmail?: string) {
  const dataSource = new AdminAuthenticationSupabaseDataSource(supabaseClient, adminEmail);

  return new AdminAuthenticationRepositoryImpl(dataSource);
}

export function createSignInAdminUseCaseWithClient(supabaseClient: SupabaseClient, adminEmail?: string) {
  const repository = createAdminAuthenticationRepository(supabaseClient, adminEmail);

  return new SignInAdminUseCase(repository);
}

export function createGetCurrentAdminSessionUseCaseWithClient(supabaseClient: SupabaseClient, adminEmail: string) {
  const repository = createAdminAuthenticationRepository(supabaseClient, adminEmail);

  return new GetCurrentAdminSessionUseCase(repository);
}

export function createSignOutAdminUseCaseWithClient(supabaseClient: SupabaseClient, adminEmail?: string) {
  const repository = createAdminAuthenticationRepository(supabaseClient, adminEmail);

  return new SignOutAdminUseCase(repository);
}
