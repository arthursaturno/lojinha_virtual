"use client";

import { FiLock, FiMail, FiUser } from "react-icons/fi";

type AdminLoginFormProps = {
  email: string;
  password: string;
  status: "initial" | "loading" | "success" | "failure";
  errorMessage: string;
  isSubmitDisabled: boolean;
  onEmailChange(email: string): void;
  onPasswordChange(password: string): void;
  onSubmit(): void;
};

export function AdminLoginForm({
  email,
  password,
  status,
  errorMessage,
  isSubmitDisabled,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginFormProps) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[var(--color-foreground)] px-5 py-10 text-white">
      <form
        className="w-full max-w-[380px] border border-[#242424] bg-[#101010] px-5 py-7 shadow-[0_18px_60px_rgba(0,0,0,.28)] md:px-7"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 grid size-14 place-items-center rounded-full bg-[var(--color-lime)] text-black">
            <FiUser aria-hidden="true" className="text-3xl" />
          </div>
          <strong className="font-display text-[42px] font-normal leading-none tracking-normal">EZZION</strong>
          <span className="text-[13px] font-black text-[var(--color-lime)]">IMPORTS</span>
          <p className="mt-4 text-[12px] font-semibold text-[#bdbdbd]">Acesso administrativo</p>
        </div>

        <label className="mb-4 block">
          <span className="mb-2 block text-[10px] font-black">LOGIN</span>
          <span className="flex h-12 items-center border border-[#303030] bg-[#151515] px-3">
            <FiMail aria-hidden="true" className="mr-3 text-lg text-[var(--color-lime)]" />
            <input
              value={email}
              type="email"
              autoComplete="email"
              onChange={(event) => onEmailChange(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#777]"
              placeholder="E-mail"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-[10px] font-black">SENHA</span>
          <span className="flex h-12 items-center border border-[#303030] bg-[#151515] px-3">
            <FiLock aria-hidden="true" className="mr-3 text-lg text-[var(--color-lime)]" />
            <input
              value={password}
              type="password"
              autoComplete="current-password"
              onChange={(event) => onPasswordChange(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#777]"
              placeholder="Digite sua senha"
            />
          </span>
        </label>

        {errorMessage ? <p className="mt-4 text-[12px] font-semibold text-red-300">{errorMessage}</p> : null}

        <button
          className="mt-6 h-12 w-full bg-[var(--color-lime)] text-[12px] font-black text-black disabled:opacity-70"
          disabled={isSubmitDisabled}
          type="submit"
        >
          {status === "success" ? "REDIRECIONANDO..." : null}
          {status === "loading" ? "ENTRANDO..." : null}
          {status !== "loading" && status !== "success" ? "ENTRAR NO PAINEL" : null}
        </button>
      </form>
    </section>
  );
}
