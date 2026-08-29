import type { AdminSession } from "@/features/authentication/domain/entities/admin-session";

export type AdminLoginStatus = "initial" | "loading" | "success" | "failure";

export type AdminLoginEffect =
  | {
      type: "signed-in";
      session: AdminSession;
    }
  | null;

export type AdminLoginViewState = {
  status: AdminLoginStatus;
  email: string;
  password: string;
  errorMessage: string;
  effect: AdminLoginEffect;
};

export const initialAdminLoginViewState: AdminLoginViewState = {
  status: "initial",
  email: "",
  password: "",
  errorMessage: "",
  effect: null,
};
