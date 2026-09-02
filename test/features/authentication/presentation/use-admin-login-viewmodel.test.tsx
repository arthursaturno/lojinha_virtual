import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Result } from "@/core/result/result";
import type { SignInAdminUseCase } from "@/features/authentication/domain/usecases/sign-in-admin-usecase";
import { useAdminLoginViewModel } from "@/features/authentication/presentation/viewmodels/use-admin-login-viewmodel";

function makeUseCase(result: Awaited<ReturnType<SignInAdminUseCase["call"]>>): SignInAdminUseCase {
  return {
    call: vi.fn().mockResolvedValue(result),
  } as unknown as SignInAdminUseCase;
}

describe("useAdminLoginViewModel", () => {
  it("emits signed-in effect after successful login", async () => {
    const useCase = makeUseCase(Result.success({ adminId: "admin-id", email: "admin@ezzionimports.com" }));
    const { result } = renderHook(() => useAdminLoginViewModel(() => useCase));

    act(() => result.current.actions.updateEmail("admin@ezzionimports.com"));
    act(() => result.current.actions.updatePassword("secret"));
    await act(() => result.current.actions.submit());

    expect(result.current.state.status).toBe("success");
    expect(result.current.state.effect?.type).toBe("signed-in");
    expect(result.current.state.password).toBe("");
  });

  it("shows error message after failed login", async () => {
    const useCase = makeUseCase(
      Result.failure({
        type: "unauthorized",
        message: "E-mail ou senha invalidos.",
      }),
    );
    const { result } = renderHook(() => useAdminLoginViewModel(() => useCase));

    act(() => result.current.actions.updateEmail("admin@ezzionimports.com"));
    act(() => result.current.actions.updatePassword("wrong"));
    await act(() => result.current.actions.submit());

    expect(result.current.state.status).toBe("failure");
    expect(result.current.state.errorMessage).toBe("E-mail ou senha invalidos.");
  });

  it("shows configuration error when use case factory fails", async () => {
    const { result } = renderHook(() =>
      useAdminLoginViewModel(() => {
        throw new Error("missing-env");
      }),
    );

    await act(() => result.current.actions.submit());

    expect(result.current.state.status).toBe("failure");
    expect(result.current.state.errorMessage).toBe(
      "Configuracao nao encontrada.",
    );
  });

  it("ignores a second submit while authentication is pending", async () => {
    let finishSignIn: ((result: Awaited<ReturnType<SignInAdminUseCase["call"]>>) => void) | undefined;
    const useCase = {
      call: vi.fn(
        () => new Promise<Awaited<ReturnType<SignInAdminUseCase["call"]>>>((resolve) => {
          finishSignIn = resolve;
        }),
      ),
    } as unknown as SignInAdminUseCase;
    const { result } = renderHook(() => useAdminLoginViewModel(() => useCase));

    act(() => result.current.actions.updateEmail("admin@ezzionimports.com"));
    act(() => result.current.actions.updatePassword("secret"));

    await act(async () => {
      const firstSubmit = result.current.actions.submit();
      const secondSubmit = result.current.actions.submit();
      finishSignIn?.(Result.success({ adminId: "admin-id", email: "admin@ezzionimports.com" }));
      await Promise.all([firstSubmit, secondSubmit]);
    });

    expect(useCase.call).toHaveBeenCalledTimes(1);
  });
});
