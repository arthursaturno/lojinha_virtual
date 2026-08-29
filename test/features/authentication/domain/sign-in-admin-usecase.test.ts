import { describe, expect, it, vi } from "vitest";

import { Result } from "@/core/result/result";
import type { AdminAuthenticationRepository } from "@/features/authentication/domain/repositories/admin-authentication-repository";
import { SignInAdminUseCase } from "@/features/authentication/domain/usecases/sign-in-admin-usecase";

function makeRepository(): AdminAuthenticationRepository {
  return {
    signIn: vi.fn(),
    getCurrentSession: vi.fn(),
    signOut: vi.fn(),
  };
}

describe("SignInAdminUseCase", () => {
  it("signs in admin with valid credentials", async () => {
    const repository = makeRepository();
    vi.mocked(repository.signIn).mockResolvedValue(Result.success({ adminId: "admin-id", email: "admin@ezzionimports.com" }));
    const useCase = new SignInAdminUseCase(repository);

    const result = await useCase.call({
      email: " admin@ezzionimports.com ",
      password: "secret",
    });

    expect(result.ok).toBe(true);
    expect(repository.signIn).toHaveBeenCalledWith({
      email: "admin@ezzionimports.com",
      password: "secret",
    });
  });

  it("returns validation failure without calling repository when credentials are empty", async () => {
    const repository = makeRepository();
    const useCase = new SignInAdminUseCase(repository);

    const result = await useCase.call({
      email: "",
      password: "",
    });

    expect(result.ok).toBe(false);
    expect(repository.signIn).not.toHaveBeenCalled();
  });
});
