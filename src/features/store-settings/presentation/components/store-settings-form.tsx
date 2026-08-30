import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import { administrationTypography } from "@/core/theme/tokens";
import type { StoreSettingsSaveStatus } from "@/features/store-settings/presentation/viewmodels/store-settings-view-state";

type StoreSettingsFormProps = {
  settings: StoreSettings;
  saveStatus: StoreSettingsSaveStatus;
  onFieldChange(field: keyof StoreSettings, value: string): void;
  onSave(): void;
};

export function StoreSettingsForm({ settings, saveStatus, onFieldChange, onSave }: StoreSettingsFormProps) {
  return (
    <div className="mt-6 grid gap-5">
      <section className="border border-[var(--color-border)] bg-white p-4 md:p-5">
        <h2 className="font-black" style={{ fontSize: administrationTypography.sectionTitle }}>DADOS DA LOJA</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.fieldLabel }}>NOME DA LOJA</span>
            <input className="h-11 w-full border border-[var(--color-border)] bg-white px-3 outline-none" style={{ fontSize: administrationTypography.body }} value={settings.storeName} placeholder="Nome exibido para clientes" onChange={(event) => onFieldChange("storeName", event.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block font-black text-[var(--color-muted)]" style={{ fontSize: administrationTypography.fieldLabel }}>WHATSAPP DE ATENDIMENTO</span>
            <input className="h-11 w-full border border-[var(--color-border)] bg-white px-3 outline-none" style={{ fontSize: administrationTypography.body }} value={settings.whatsappPhone} placeholder="5581999999999" inputMode="tel" onChange={(event) => onFieldChange("whatsappPhone", event.target.value)} />
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="button" className="h-11 bg-[var(--color-lime)] px-5 font-black text-black" style={{ fontSize: administrationTypography.action }} onClick={onSave}>
          {saveStatus === "saved" ? "SALVO OK" : "SALVAR CONFIGURACOES"}
        </button>
      </div>
    </div>
  );
}
