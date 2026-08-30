"use client";

import Link from "next/link";
import { FiArrowLeft, FiBox, FiMenu, FiSettings, FiSliders, FiX } from "react-icons/fi";

import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { administrationLayout, administrationTypography } from "@/core/theme/tokens";
import { appRoutes } from "@/core/router/app-routes";
import { AdminSignOutButton } from "@/core/ui/components/admin-sign-out-button";

export type AdminSidebarSection = "products" | "filters" | "settings";

type AdminSidebarProps = {
  storeName: string;
  adminEmail: string;
  supabaseConfig: AdminAuthenticationBrowserConfig;
  activeSection: AdminSidebarSection;
  isMobileOpen: boolean;
  onOpenMobile(): void;
  onCloseMobile(): void;
};

type SidebarContentProps = {
  storeName: string;
  adminEmail: string;
  supabaseConfig: AdminAuthenticationBrowserConfig;
  activeSection: AdminSidebarSection;
  hideBrand?: boolean;
};

const navigationItems = [
  {
    label: "Produtos",
    section: "products" as const,
    href: appRoutes.adminProducts,
    icon: FiBox,
  },
    {
    label: "Filtros",
    section: "filters" as const,
    href: appRoutes.adminFilters,
    icon: FiSliders,
  },
  {
    label: "Configuracoes",
    section: "settings" as const,
    href: appRoutes.adminSettings,
    icon: FiSettings,
  },
] as const;

function SidebarContent({
  storeName,
  adminEmail,
  supabaseConfig,
  activeSection,
  hideBrand = false,
}: SidebarContentProps) {
  return (
    <>
      {hideBrand ? null : (
        <div className="max-w-full">
          <strong
            className="block break-words font-display font-normal leading-none tracking-normal text-white"
            style={{ fontSize: administrationTypography.sidebarBrand }}
          >
            {storeName}
          </strong>
        </div>
      )}

      <div className={`${hideBrand ? "mt-0" : "mt-10"} flex flex-1 flex-col`}>
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.section}
              className={`mb-3 flex items-center gap-3 px-3 py-3 text-left font-semibold ${
                activeSection === item.section
                  ? "bg-[var(--color-lime)] text-black"
                  : "border border-[#242424] text-white"
              }`}
              href={item.href}
              style={{ fontSize: administrationTypography.action }}
            >
              <Icon aria-hidden="true" className="text-base" />
              <span>{item.label}</span>
            </Link>
          );
        })}

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
        <AdminSignOutButton
          supabaseConfig={supabaseConfig}
          className="mt-2 w-full border border-[#2f2f2f] px-3 py-3 text-left font-black text-[var(--color-lime)]"
          style={{ fontSize: administrationTypography.action }}
        />
      </div>
    </>
  );
}

export function AdminSidebar({
  storeName,
  adminEmail,
  supabaseConfig,
  activeSection,
  isMobileOpen,
  onOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-[#242424] bg-[#0a0a0a] px-4 text-white md:hidden"
        style={{ height: administrationLayout.topbarHeight }}
      >
        <button
          className="grid size-9 place-items-center border border-[#3a3a3a]"
          onClick={onOpenMobile}
          aria-label="Abrir menu administrativo"
        >
          <FiMenu aria-hidden="true" className="text-lg" />
        </button>
        
      </div>

      <aside
        className="hidden min-h-screen flex-col bg-[#0a0a0a] px-[18px] py-[26px] text-white md:flex"
        style={{ width: administrationLayout.sidebarDesktopWidth }}
      >
        <SidebarContent
          storeName={storeName}
          adminEmail={adminEmail}
          supabaseConfig={supabaseConfig}
          activeSection={activeSection}
        />
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
              <button
                className="grid size-9 place-items-center border border-[#3a3a3a]"
                onClick={onCloseMobile}
                aria-label="Fechar menu administrativo"
              >
                <FiX aria-hidden="true" className="text-lg" />
              </button>
            </div>
            <SidebarContent
              storeName={storeName}
              adminEmail={adminEmail}
              supabaseConfig={supabaseConfig}
              activeSection={activeSection}
              hideBrand
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}
