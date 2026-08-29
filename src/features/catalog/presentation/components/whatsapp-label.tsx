import { FaWhatsapp } from "react-icons/fa";
import type { ReactNode } from "react";

type WhatsAppLabelProps = {
  children: ReactNode;
};

export function WhatsAppLabel({ children }: WhatsAppLabelProps) {
  return (
    <span className="whatsapp-label">
      <FaWhatsapp aria-hidden="true" />
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
}
