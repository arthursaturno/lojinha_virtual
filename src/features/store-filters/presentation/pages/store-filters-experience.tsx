"use client";

import { useMemo, useState } from "react";

import type { AdminAuthenticationBrowserConfig } from "@/core/di/authentication-browser";
import { createSupabaseBrowserClient } from "@/core/network/supabase/browser-client";
import {
  predefinedStoreFilterOptions,
  type StoreFilterOptions,
  type StoreFilterType,
} from "@/core/store-filters/store-filter-options";
import { administrationLayout, administrationTypography } from "@/core/theme/tokens";
import { AdminSidebar } from "@/core/ui/components/admin-sidebar";
import { AppToast } from "@/core/ui/components/app-toast";

type Props = {
  storeName: string;
  adminEmail: string;
  supabaseConfig: AdminAuthenticationBrowserConfig;
  initialOptions: StoreFilterOptions;
};

const labels: Record<StoreFilterType, string> = {
  category: "CATEGORIAS",
  size: "TAMANHOS",
  color: "CORES",
  model: "MODELAGENS",
};

export function StoreFiltersExperience({ storeName, adminEmail, supabaseConfig, initialOptions }: Props) {
  const client = useMemo(() => createSupabaseBrowserClient(supabaseConfig), [supabaseConfig]);
  const [options, setOptions] = useState(initialOptions);
  const [toast, setToast] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  function toggle(type: StoreFilterType, value: string) {
    setOptions((current) => ({
      ...current,
      [type]: current[type].includes(value)
        ? current[type].filter((item) => item !== value)
        : [...current[type], value],
    }));
  }
  async function save() {
    const { data: auth } = await client.auth.getUser();
    if (!auth.user) {
      setToast("Sessao administrativa nao encontrada.");
      return;
    }

    const rows = (Object.keys(options) as StoreFilterType[]).flatMap((filterType) =>
      options[filterType].map((value, position) => ({
        owner_id: auth.user.id,
        filter_type: filterType,
        value,
        position,
      })),
    );
    const { error: removeError } = await client.from("store_filter_options").delete().eq("owner_id", auth.user.id);
    const { error: insertError } = rows.length ? await client.from("store_filter_options").insert(rows) : { error: null };
    setToast(removeError || insertError ? "Nao foi possivel salvar os filtros." : "Filtros salvos com sucesso.");
  }
  return <div className="min-h-screen bg-[#f7f7f5] md:grid" style={{ gridTemplateColumns: `minmax(${administrationLayout.sidebarDesktopWidth}, ${administrationLayout.sidebarDesktopWidth}) minmax(0, 1fr)` }}>
    <AdminSidebar storeName={storeName} adminEmail={adminEmail} supabaseConfig={supabaseConfig} activeSection="filters" isMobileOpen={mobileOpen} onOpenMobile={() => setMobileOpen(true)} onCloseMobile={() => setMobileOpen(false)} />
    <main className="px-4 pb-8 pt-[72px] md:px-8 md:py-8"><span className="font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.eyebrow }}>ADMINISTRACAO</span><h1 className="mt-2 font-black" style={{ fontSize: "2rem" }}>Filtros da loja</h1><p className="mt-1 text-[var(--color-muted)]" style={{ fontSize: administrationTypography.body }}>Escolha quais opcoes aparecem na navegacao e no filtro lateral.</p>{(Object.keys(predefinedStoreFilterOptions) as StoreFilterType[]).map((type) => <section key={type} className="mt-5 border border-[var(--color-border)] bg-white p-4"><h2 className="font-black" style={{ fontSize: administrationTypography.sectionTitle }}>{labels[type]}</h2><div className="mt-3 flex flex-wrap gap-2">{predefinedStoreFilterOptions[type].map((value) => <button type="button" key={value} onClick={() => toggle(type, value)} className={`border px-3 py-2 font-black ${options[type].includes(value) ? "border-black bg-[var(--color-lime)]" : "border-[var(--color-border)] bg-white"}`} style={{ fontSize: administrationTypography.action }}>{value}</button>)}</div></section>)}<div className="mt-5 flex justify-end"><button type="button" onClick={save} className="h-11 bg-[var(--color-lime)] px-5 font-black" style={{ fontSize: administrationTypography.action }}>SALVAR FILTROS</button></div></main>{toast ? <AppToast tone={toast.includes("sucesso") ? "success" : "error"} message={toast} onDismiss={() => setToast(null)} /> : null}</div>;
}
