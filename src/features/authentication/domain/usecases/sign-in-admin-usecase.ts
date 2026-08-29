import { Result } from "@/core/result/result";
import type { AdminSession } from "@/features/authentication/domain/entities/admin-session";
import type {
  AdminAuthenticationRepository,
  AdminLoginCredentials,
} from "@/features/authentication/domain/repositories/admin-authentication-repository";

export class SignInAdminUseCase {
  constructor(private readonly repository: AdminAuthenticationRepository) {}

  call(credentials: AdminLoginCredentials): Promise<Result<AdminSession>> {
    if (!credentials.email.trim() || !credentials.password.trim()) {
      return Promise.resolve(
        Result.failure<AdminSession>({
          type: "validation",
          message: "Informe e-mail e senha para entrar.",
        }),
      );
    }

    return this.repository.signIn({
      email: credentials.email.trim(),
      password: credentials.password,
    });
  }
}
