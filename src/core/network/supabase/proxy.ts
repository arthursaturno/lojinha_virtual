import { createServerClient } from "@supabase/ssr";
import { AuthApiError } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { getServerEnv } from "@/core/config/env";

function clearAuthCookies(request: NextRequest, response: NextResponse): NextResponse {

  request.cookies
    .getAll()
    .filter((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"))
    .forEach((cookie) => response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" }));

  return response;
}

function redirectToAdminLogin(request: NextRequest): NextResponse {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";

  return clearAuthCookies(request, NextResponse.redirect(loginUrl));
}

export async function refreshSupabaseSession(request: NextRequest): Promise<NextResponse> {
  const env = getServerEnv();
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
    const { data } = await supabaseClient.auth.getClaims();
    const email = typeof data?.claims?.email === "string" ? data.claims.email : "";
    const isAdmin = email.toLowerCase() === env.adminEmail.trim().toLowerCase();
    const isLoginRoute = request.nextUrl.pathname === "/admin/login";

    if (!isLoginRoute && !isAdmin) {
      return redirectToAdminLogin(request);
    }
  } catch (error) {
    if (error instanceof AuthApiError && error.code === "refresh_token_not_found") {
      return request.nextUrl.pathname === "/admin/login"
        ? clearAuthCookies(request, NextResponse.next({ request }))
        : redirectToAdminLogin(request);
    }

    throw error;
  }

  return response;
}
