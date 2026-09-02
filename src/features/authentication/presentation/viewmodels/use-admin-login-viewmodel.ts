"use client";

import { useRef, useState } from "react";

import type { SignInAdminUseCase } from "@/features/authentication/domain/usecases/sign-in-admin-usecase";
import {
  initialAdminLoginViewState,
  type AdminLoginViewState,
} from "@/features/authentication/presentation/viewmodels/admin-login-view-state";

type SignInAdminUseCaseFactory = () => SignInAdminUseCase;

export function useAdminLoginViewModel(createSignInAdminUseCase: SignInAdminUseCaseFactory) {
  const [state, setState] = useState<AdminLoginViewState>(initialAdminLoginViewState);
  const isSubmittingRef = useRef(false);

  function updateEmail(email: string) {
    setState((current) => ({ ...current, email, errorMessage: "", status: "initial" }));
  }

  function updatePassword(password: string) {
    setState((current) => ({ ...current, password, errorMessage: "", status: "initial" }));
  }

  async function submit() {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setState((current) => ({ ...current, status: "loading", errorMessage: "", effect: null }));

    let signInAdminUseCase: SignInAdminUseCase;

    try {
      signInAdminUseCase = createSignInAdminUseCase();
    } catch {
      setState((current) => ({
        ...current,
        status: "failure",
        errorMessage: "Configuracao nao encontrada.",
      }));
      isSubmittingRef.current = false;
      return;
    }

    try {
      const result = await signInAdminUseCase.call({
        email: state.email,
        password: state.password,
      });

      if (!result.ok) {
        setState((current) => ({
          ...current,
          status: "failure",
          errorMessage: result.failure.message,
        }));
        return;
      }

      setState((current) => ({
        ...current,
        status: "success",
        password: "",
        effect: {
          type: "signed-in",
          session: result.data,
        },
      }));
    } finally {
      isSubmittingRef.current = false;
    }
  }

  function clearEffect() {
    setState((current) => ({ ...current, effect: null }));
  }

  return {
    state,
    isSubmitDisabled: state.status === "loading" || state.status === "success",
    actions: {
      updateEmail,
      updatePassword,
      submit,
      clearEffect,
    },
  };
}
