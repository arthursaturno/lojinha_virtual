"use client";

import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";

import { administrationTypography } from "@/core/theme/tokens";

export type AppToastTone = "success" | "error";

type AppToastProps = {
  tone: AppToastTone;
  message: string;
  onDismiss(): void;
};

export function AppToast({ tone, message, onDismiss }: AppToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onDismiss, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [onDismiss]);

  const Icon = tone === "success" ? FiCheckCircle : FiAlertCircle;

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex w-[min(360px,calc(100vw-32px))] items-start gap-3 border bg-white p-4 shadow-lg" role="status" aria-live="polite">
      <Icon aria-hidden="true" className={tone === "success" ? "mt-0.5 text-[var(--color-success)]" : "mt-0.5 text-[var(--color-error)]"} />
      <p className="flex-1 font-semibold text-[var(--color-foreground)]" style={{ fontSize: administrationTypography.body }}>{message}</p>
      <button type="button" className="grid size-7 place-items-center text-[var(--color-muted)]" onClick={onDismiss} aria-label="Fechar mensagem">
        <FiX aria-hidden="true" />
      </button>
    </div>
  );
}
