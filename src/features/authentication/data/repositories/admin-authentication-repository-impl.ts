import { Result } from "@/core/result/result";
import type { AdminAuthenticationDataSource } from "@/features/authentication/data/datasources/admin-authentication-datasource";
import { adminSessionToDomain } from "@/features/authentication/data/dtos/admin-session-dto";
import type { AdminSession } from "@/features/authentication/domain/entities/admin-session";
import type {
  AdminAuthenticationRepository,
  AdminLoginCredentials,
} from "@/features/authentication/domain/repositories/admin-authentication-repository";

export class AdminAuthenticationRepositoryImpl implements AdminAuthenticationRepository {
  constructor(private readonly dataSource: AdminAuthenticationDataSource) {}

  async signIn(credentials: AdminLoginCredentials) {
    try {
      const session = await this.dataSource.signIn(credentials);

      return Result.success<AdminSession>(adminSessionToDomain(session));
    } catch (error) {
      return Result.failure<AdminSession>({
        type: "unauthorized",
        message: error instanceof Error ? error.message : "E-mail ou senha invalidos.",
      });
    }
  }

  async getCurrentSession() {
    try {
      const session = await this.dataSource.getCurrentSession();

      return Result.success<AdminSession>(adminSessionToDomain(session));
    } catch (error) {
      return Result.failure<AdminSession>({
        type: "unauthorized",
        message: error instanceof Error ? error.message : "Sessao administrativa nao encontrada.",
      });
    }
  }

  async signOut() {
    try {
      await this.dataSource.signOut();

      return Result.success<void>(undefined);
    } catch {
      return Result.failure<void>({
        type: "unknown",
        message: "Nao foi possivel sair da conta.",
      });
    }
  }
}
