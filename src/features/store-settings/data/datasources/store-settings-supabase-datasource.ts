import type { SupabaseClient } from "@supabase/supabase-js";

import type { StoreSettings } from "@/features/store-settings/domain/entities/store-settings";
import type { StoreSettingsDto } from "@/features/store-settings/data/dtos/store-settings-dto";

export interface StoreSettingsDataSource {
  get(): Promise<StoreSettingsDto | null>;
  upsert(settings: StoreSettings): Promise<StoreSettingsDto>;
}

export class StoreSettingsSupabaseDataSource implements StoreSettingsDataSource {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async get(): Promise<StoreSettingsDto | null> {
    const { data, error } = await this.supabaseClient
      .from("store_settings")
      .select("store_name, whatsapp_phone")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async upsert(settings: StoreSettings): Promise<StoreSettingsDto> {
    const { data: userData, error: userError } = await this.supabaseClient.auth.getUser();

    if (userError || !userData.user) {
      throw new Error("Sessao administrativa nao encontrada.");
    }

    const { data: existingSettings, error: existingSettingsError } = await this.supabaseClient
      .from("store_settings")
      .select("id")
      .eq("id", 1)
      .maybeSingle();

    if (existingSettingsError) {
      throw new Error(existingSettingsError.message);
    }

    if (existingSettings) {
      const { data, error } = await this.supabaseClient
        .from("store_settings")
        .update({ store_name: settings.storeName, whatsapp_phone: settings.whatsappPhone })
        .eq("id", 1)
        .select("store_name, whatsapp_phone")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "Nao foi possivel salvar as configuracoes.");
      }

      return data;
    }

    const { data, error } = await this.supabaseClient
      .from("store_settings")
      .insert({
        id: 1,
        owner_id: userData.user.id,
        store_name: settings.storeName,
        whatsapp_phone: settings.whatsappPhone,
      })
      .select("store_name, whatsapp_phone")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Nao foi possivel salvar as configuracoes.");
    }

    return data;
  }
}
