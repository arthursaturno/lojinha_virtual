import { createServerClient } from "@supabase/ssr";
import { AuthApiError } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { getPublicEnv } from "@/core/config/env";

function clearInvalidAuthCookies(request: NextRequest): NextResponse {
  const response = NextResponse.next({ request });

  request.cookies
    .getAll()
    .filter((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"))
    .forEach((cookie) => response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" }));

  return response;
}

export async function refreshSupabaseSession(request: NextRequest): Promise<NextResponse> {
  const env = getPublicEnv();
  let response = NextResponse.next({ request });

  const supabaseClient = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  try {
    await supabaseClient.auth.getClaims();
  } catch (error) {
    if (error instanceof AuthApiError && error.code === "refresh_token_not_found") {
      return clearInvalidAuthCookies(request);
    }

    throw error;
  }

  return response;
}
