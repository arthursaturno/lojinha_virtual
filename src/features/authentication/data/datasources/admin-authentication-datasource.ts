import type { AdminSessionDto } from "@/features/authentication/data/dtos/admin-session-dto";
import type { AdminLoginCredentials } from "@/features/authentication/domain/repositories/admin-authentication-repository";

export interface AdminAuthenticationDataSource {
  signIn(credentials: AdminLoginCredentials): Promise<AdminSessionDto>;
  getCurrentSession(): Promise<AdminSessionDto>;
  signOut(): Promise<void>;
}
