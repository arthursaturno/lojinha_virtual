import type { Result } from "@/core/result/result";
import type { AdminSession } from "@/features/authentication/domain/entities/admin-session";
import type { AdminAuthenticationRepository } from "@/features/authentication/domain/repositories/admin-authentication-repository";

export class GetCurrentAdminSessionUseCase {
  constructor(private readonly repository: AdminAuthenticationRepository) {}

  call(): Promise<Result<AdminSession>> {
    return this.repository.getCurrentSession();
  }
}
