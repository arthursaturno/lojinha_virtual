import type { NextRequest } from "next/server";

import { refreshSupabaseSession } from "@/core/network/supabase/proxy";

export async function proxy(request: NextRequest) {
  return refreshSupabaseSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
