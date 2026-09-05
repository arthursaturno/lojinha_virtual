import { getPublicEnv } from "@/core/config/env";
import { AdminLoginPage } from "@/features/authentication/presentation/pages/admin-login-page";

export default function AdminLoginRoute() {
  const env = getPublicEnv();

  return (
    <AdminLoginPage
      supabaseConfig={{
        supabaseUrl: env.supabaseUrl,
        supabaseAnonKey: env.supabaseAnonKey,
      }}
    />
  );
}
