"use client";

import { useState } from "react";

import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { administrationLayout, administrationTypography } from "@/core/theme/tokens";
import { AdminSidebar } from "@/core/ui/components/admin-sidebar";
import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import { StoreSettingsForm } from "@/features/store-settings/presentation/components/store-settings-form";
import { useStoreSettingsViewModel } from "@/features/store-settings/presentation/viewmodels/use-store-settings-viewmodel";

type StoreSettingsExperienceProps = {
  settings: StoreSettings;
  adminEmail: string;
  supabaseConfig: AdminAuthenticationBrowserConfig;
};

export function StoreSettingsExperience({ settings, adminEmail, supabaseConfig }: StoreSettingsExperienceProps) {
  const { state, actions } = useStoreSettingsViewModel(settings);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f5] md:grid" style={{ gridTemplateColumns: `minmax(${administrationLayout.sidebarDesktopWidth}, ${administrationLayout.sidebarDesktopWidth}) minmax(0, 1fr)` }}>
      <AdminSidebar adminEmail={adminEmail} supabaseConfig={supabaseConfig} activeSection="settings" isMobileOpen={isMobileSidebarOpen} onOpenMobile={() => setIsMobileSidebarOpen(true)} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
      <main className="px-4 pb-8 pt-[72px] md:px-8 md:py-8">
        <span className="font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.eyebrow }}>ADMINISTRACAO</span>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-black text-[var(--color-foreground)]" style={{ fontSize: "clamp(1.5rem, 1.35rem + 0.8vw, 2rem)" }}>Configuracoes da loja</h1>
            <p className="mt-1 text-[var(--color-muted)]" style={{ fontSize: administrationTypography.body }}>Defina o nome exibido e o WhatsApp usado para atendimento.</p>
          </div>
          {state.feedbackMessage ? <p className="font-black text-green-700" style={{ fontSize: administrationTypography.action }}>{state.feedbackMessage}</p> : null}
        </div>
        <StoreSettingsForm settings={state.settings} saveStatus={state.saveStatus} onFieldChange={actions.updateField} onSave={actions.save} />
      </main>
    </div>
  );
}
