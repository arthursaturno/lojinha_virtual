import type { Result } from "@/core/result/result";
import type { AdminAuthenticationRepository } from "@/features/authentication/domain/repositories/admin-authentication-repository";

export class SignOutAdminUseCase {
  constructor(private readonly repository: AdminAuthenticationRepository) {}

  call(): Promise<Result<void>> {
    return this.repository.signOut();
  }
}
