import { createClient } from "@supabase/supabase-js";

import { getPublicEnv } from "@/core/config/env";

const env = getPublicEnv();

export const supabase = createClient(
  env.supabaseUrl,
  env.supabaseAnonKey,
);
