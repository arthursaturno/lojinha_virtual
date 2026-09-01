"use client";

import { useEffect, useRef } from "react";

import { administrationTypography } from "@/core/theme/tokens";

type AppConfirmationDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isConfirming?: boolean;
  onCancel(): void;
  onConfirm(): void;
};

export function AppConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  isConfirming = false,
  onCancel,
  onConfirm,
}: AppConfirmationDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isConfirming) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isConfirming, isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-black/55 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isConfirming) {
          onCancel();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-message"
        className="w-full max-w-md border border-[var(--color-border)] bg-white p-5 shadow-xl"
      >
        <h2 id="confirmation-dialog-title" className="font-black" style={{ fontSize: administrationTypography.sectionTitle }}>
          {title}
        </h2>
        <p id="confirmation-dialog-message" className="mt-2 text-[var(--color-muted)]" style={{ fontSize: administrationTypography.body }}>
          {message}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            className="h-11 border-2 border-[var(--color-foreground)] bg-white px-4 font-black text-[var(--color-foreground)]"
            style={{ fontSize: administrationTypography.action }}
            onClick={onCancel}
            disabled={isConfirming}
          >
            CANCELAR
          </button>
          <button
            type="button"
            className="h-11 bg-[var(--color-lime)] px-4 font-black text-black disabled:cursor-not-allowed disabled:opacity-60"
            style={{ fontSize: administrationTypography.action }}
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "SAINDO..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
