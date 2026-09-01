import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppConfirmationDialog } from "@/core/ui/components/app-confirmation-dialog";

describe("AppConfirmationDialog", () => {
  it("calls the provided callback when the user confirms", () => {
    const onConfirm = vi.fn();

    render(
      <AppConfirmationDialog
        isOpen
        title="Sair do painel?"
        message="Confirme a saida."
        confirmLabel="SAIR"
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "SAIR" }));

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("closes when the user cancels", () => {
    const onCancel = vi.fn();

    render(
      <AppConfirmationDialog
        isOpen
        title="Sair do painel?"
        message="Confirme a saida."
        confirmLabel="SAIR"
        onCancel={onCancel}
        onConfirm={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "CANCELAR" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
