import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ezzion Imports",
  description: "Catalogo virtual da Ezzion Imports",
  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body>{children}</body>
    </html>
  );
}
