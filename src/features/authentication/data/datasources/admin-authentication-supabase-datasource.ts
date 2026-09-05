import type { SupabaseClient } from "@supabase/supabase-js";

import type { AdminAuthenticationDataSource } from "@/features/authentication/data/datasources/admin-authentication-datasource";
import type { AdminSessionDto } from "@/features/authentication/data/dtos/admin-session-dto";
import type { AdminLoginCredentials } from "@/features/authentication/domain/repositories/admin-authentication-repository";

const authTimeoutInMs = 12000;

function withTimeout<T>(promise: PromiseLike<T>, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = globalThis.setTimeout(() => {
      reject(new Error(message));
    }, authTimeoutInMs);

    promise.then(
      (value) => {
        globalThis.clearTimeout(timeout);
        resolve(value);
      },
      (error: unknown) => {
        globalThis.clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

export class AdminAuthenticationSupabaseDataSource implements AdminAuthenticationDataSource {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly allowedAdminEmail?: string,
  ) {}

  private isAllowedAdminEmail(email: string) {
    return email.trim().toLowerCase() === this.allowedAdminEmail?.trim().toLowerCase();
  }

  async signIn(credentials: AdminLoginCredentials): Promise<AdminSessionDto> {
    const { data, error } = await withTimeout(
      this.supabaseClient.auth.signInWithPassword(credentials),
      "Tempo limite excedido ao conectar no Supabase.",
    );

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user?.email) {
      throw new Error("Usuario autenticado nao retornado pelo Supabase.");
    }

    if (this.allowedAdminEmail && !this.isAllowedAdminEmail(data.user.email)) {
      await this.supabaseClient.auth.signOut();
      throw new Error("Esta conta nao tem permissao para acessar o painel.");
    }

    return {
      admin_id: data.user.id,
      email: data.user.email,
    };
  }

  async getCurrentSession(): Promise<AdminSessionDto> {
    const { data, error } = await withTimeout(
      this.supabaseClient.auth.getUser(),
      "Tempo limite excedido ao validar a sessao.",
    );
    const user = data.user;

    if (error) {
      throw new Error(error.message);
    }

    if (!user?.email) {
      throw new Error("Sessao administrativa nao encontrada.");
    }

    if (!this.allowedAdminEmail || !this.isAllowedAdminEmail(user.email)) {
      await this.supabaseClient.auth.signOut();
      throw new Error("Esta conta nao tem permissao para acessar o painel.");
    }

    return {
      admin_id: user.id,
      email: user.email,
    };
  }

  async signOut(): Promise<void> {
    const { error } = await withTimeout(this.supabaseClient.auth.signOut(), "Tempo limite excedido ao sair.");

    if (error) {
      throw error;
    }
  }
}
