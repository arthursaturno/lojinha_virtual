import type { Result } from "@/core/result/result";
import type { AdminSession } from "@/features/authentication/domain/entities/admin-session";

export type AdminLoginCredentials = {
  email: string;
  password: string;
};

export interface AdminAuthenticationRepository {
  signIn(credentials: AdminLoginCredentials): Promise<Result<AdminSession>>;
  getCurrentSession(): Promise<Result<AdminSession>>;
  signOut(): Promise<Result<void>>;
}
