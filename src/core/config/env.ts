type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export type ServerEnv = PublicEnv & {
  adminEmail: string;
};

function getRequiredEnv(...names: string[]): string {
  const value = names.map((name) => process.env[name]).find(Boolean);

  if (!value) {
    throw new Error(`Missing required environment variable: ${names.join(" or ")}`);
  }

  return value;
}

export function normalizeSupabaseProjectUrl(value: string): string {
  const url = new URL(value.trim());

  return `${url.protocol}//${url.host}`;
}

export function getPublicEnv(): PublicEnv {
  return {
    supabaseUrl: normalizeSupabaseProjectUrl(getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL")),
    supabaseAnonKey: getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  };
}

export function getServerEnv(): ServerEnv {
  return {
    ...getPublicEnv(),
    adminEmail: getRequiredEnv("ADMIN_EMAIL", "NEXT_PUBLIC_ADMIN_EMAIL"),
  };
}
