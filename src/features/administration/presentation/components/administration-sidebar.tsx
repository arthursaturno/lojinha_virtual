"use client";

import Link from "next/link";
import { FiArrowLeft, FiBox, FiMenu, FiX } from "react-icons/fi";

import { administrationLayout, administrationTypography } from "@/core/theme/tokens";
import { appRoutes } from "@/core/router/app-routes";
import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { AdministrationSignOutButton } from "@/features/administration/presentation/components/administration-sign-out-button";

type AdministrationSidebarProps = {
  adminEmail: string;
  supabaseConfig: AdminAuthenticationBrowserConfig;
  isMobileOpen: boolean;
  onOpenMobile(): void;
  onCloseMobile(): void;
};

type SidebarContentProps = {
  adminEmail: string;
  supabaseConfig: AdminAuthenticationBrowserConfig;
  hideBrand?: boolean;
};

function SidebarContent({ adminEmail, supabaseConfig, hideBrand = false }: SidebarContentProps) {
  return (
    <>
      {hideBrand ? null : (
        <div className="flex flex-col leading-[0.78]">
          <strong
            className="font-display font-normal tracking-normal text-white"
            style={{ fontSize: administrationTypography.sidebarBrand }}
          >
            EZZION
          </strong>
          <span
            className="ml-[54px] font-black text-[var(--color-lime)]"
            style={{ fontSize: administrationTypography.sidebarSubBrand }}
          >
            IMPORTS
          </span>
        </div>
      )}

      <div className={`${hideBrand ? "mt-0" : "mt-10"} flex flex-1 flex-col`}>
        {/* Menu reduzido por enquanto: manter somente Produtos, Ver Loja e Sair ate definirmos as demais secoes do painel. */}
        <button
          className="mb-5 flex items-center gap-3 bg-[var(--color-lime)] px-3 py-3 text-left font-semibold text-black"
          style={{ fontSize: administrationTypography.action }}
          type="button"
        >
          <FiBox aria-hidden="true" className="text-sm" />
          <span>Produtos</span>
        </button>

        <p
          className="mt-auto break-all px-3 font-semibold leading-relaxed text-[#7f7f7f]"
          style={{ fontSize: administrationTypography.email }}
        >
          {adminEmail}
        </p>
        <Link
          className="mt-4 flex items-center gap-2 px-3 py-3 font-black text-[var(--color-lime)]"
          style={{ fontSize: administrationTypography.action }}
          href={appRoutes.storefront}
        >
          <FiArrowLeft aria-hidden="true" className="text-sm" />
          <span>VER LOJA</span>
        </Link>
        <AdministrationSignOutButton
          supabaseConfig={supabaseConfig}
          className="mt-2 w-full border border-[#2f2f2f] px-3 py-3 text-left font-black text-[var(--color-lime)]"
          style={{ fontSize: administrationTypography.action }}
        />
      </div>
    </>
  );
}

export function AdministrationSidebar({
  adminEmail,
  supabaseConfig,
  isMobileOpen,
  onOpenMobile,
  onCloseMobile,
}: AdministrationSidebarProps) {
  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-[#242424] bg-[#0a0a0a] px-4 text-white md:hidden"
        style={{ height: administrationLayout.topbarHeight }}
      >
        <button className="grid size-9 place-items-center border border-[#3a3a3a]" onClick={onOpenMobile} aria-label="Abrir menu administrativo">
          <FiMenu aria-hidden="true" className="text-lg" />
        </button>
        <div className="text-center">
          <strong
            className="font-display block font-normal leading-none tracking-normal"
            style={{ fontSize: administrationTypography.sidebarBrand }}
          >
            EZZION
          </strong>
          <span
            className="block font-black text-[var(--color-lime)]"
            style={{ fontSize: administrationTypography.sidebarSubBrand }}
          >
            IMPORTS
          </span>
        </div>
        <Link className="grid size-9 place-items-center text-[var(--color-lime)]" href={appRoutes.storefront} aria-label="Voltar para a loja">
          <FiArrowLeft aria-hidden="true" className="text-lg" />
        </Link>
      </div>

      <aside
        className="hidden min-h-screen flex-col bg-[#0a0a0a] px-[18px] py-[26px] text-white md:flex"
        style={{ width: administrationLayout.sidebarDesktopWidth }}
      >
        <SidebarContent adminEmail={adminEmail} supabaseConfig={supabaseConfig} />
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/55 md:hidden" onMouseDown={onCloseMobile}>
          <aside
            className="h-full overflow-auto bg-[#0a0a0a] px-5 py-5 text-white"
            style={{
              width: administrationLayout.sidebarMobileWidth,
              maxWidth: administrationLayout.sidebarMobileMaxWidth,
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <strong
                className="font-black text-[var(--color-lime)]"
                style={{ fontSize: administrationTypography.action }}
              >
                MENU ADMIN
              </strong>
              <button className="grid size-9 place-items-center border border-[#3a3a3a]" onClick={onCloseMobile} aria-label="Fechar menu administrativo">
                <FiX aria-hidden="true" className="text-lg" />
              </button>
            </div>
            <SidebarContent adminEmail={adminEmail} supabaseConfig={supabaseConfig} hideBrand />
          </aside>
        </div>
      ) : null}
    </>
  );
}
