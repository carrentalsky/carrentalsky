import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv, getSupabaseUrlHost, hasSupabaseEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/types";

export const dynamic = "force-dynamic";

type SafeAuthError = {
  message?: string;
  status?: number;
  code?: string;
} | null | undefined;

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

function debugLog(label: string, details: Record<string, unknown>) {
  if (process.env.ADMIN_LOGIN_DEBUG !== "1") return;

  console.warn("[admin-login-route]", label, {
    supabaseHost: getSupabaseUrlHost(),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    ...details,
  });
}

function debugError(label: string, error: SafeAuthError) {
  if (process.env.ADMIN_LOGIN_DEBUG !== "1" || !error) return;

  console.warn("[admin-login-route]", label, {
    message: error.message,
    status: error.status,
    code: error.code,
  });
}

function classifyAuthError(error: SafeAuthError) {
  const message = error?.message?.toLowerCase() ?? "";
  const code = error?.code?.toLowerCase() ?? "";

  if (code.includes("email_not_confirmed") || message.includes("email not confirmed")) {
    return "email-not-confirmed";
  }

  if (
    error?.status === 401 ||
    error?.status === 403 ||
    code.includes("api") ||
    message.includes("api key") ||
    message.includes("invalid key") ||
    message.includes("project")
  ) {
    return "supabase-config";
  }

  return "invalid";
}

function cookieNames(request: NextRequest) {
  return request.cookies.getAll().map((cookie) => cookie.name);
}

function supabaseCookieNames(request: NextRequest) {
  return cookieNames(request).filter((name) => name.startsWith("sb-") || name.includes("auth-token"));
}

function redirectWithCookies(request: NextRequest, path: string, cookiesToSet: CookieToSet[]) {
  const response = NextResponse.redirect(new URL(path, request.url), { status: 303 });
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}

export async function GET() {
  return new NextResponse("admin auth login route is deployed", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function POST(request: NextRequest) {
  const cookiesToSet: CookieToSet[] = [];

  debugLog("action called", {
    requestCookieNames: cookieNames(request),
    requestSupabaseCookieNames: supabaseCookieNames(request),
  });

  if (!hasSupabaseEnv()) {
    debugLog("missing public Supabase env", {
      finalRedirect: "/admin/login?error=missing-env",
    });
    return redirectWithCookies(request, "/admin/login?error=missing-env", cookiesToSet);
  }

  const { url, anonKey } = getSupabaseEnv();
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(newCookies) {
        newCookies.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          cookiesToSet.push({ name, value, options });
        });
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    debugError("signInWithPassword failed", error);
    debugLog("redirect decision", {
      setCookieNames: cookiesToSet.map((cookie) => cookie.name),
      finalRedirect: `/admin/login?error=${classifyAuthError(error)}`,
    });
    return redirectWithCookies(request, `/admin/login?error=${classifyAuthError(error)}`, cookiesToSet);
  }

  debugLog("signInWithPassword succeeded", {
    userId: data.user.id,
    email: data.user.email,
    setCookieNames: cookiesToSet.map((cookie) => cookie.name),
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.id !== data.user.id) {
    debugError("auth.getUser after sign-in failed", userError);
    await supabase.auth.signOut();
    debugLog("redirect decision", {
      userId: data.user.id,
      email: data.user.email,
      setCookieNames: cookiesToSet.map((cookie) => cookie.name),
      finalRedirect: "/admin/login?error=session-check-failed",
    });
    return redirectWithCookies(request, "/admin/login?error=session-check-failed", cookiesToSet);
  }

  debugLog("getUser result", {
    userId: user.id,
    email: user.email,
    setCookieNames: cookiesToSet.map((cookie) => cookie.name),
  });

  const adminSupabase = createSupabaseAdminClient();
  if (!adminSupabase) {
    await supabase.auth.signOut();
    debugLog("service role client missing", {
      userId: user.id,
      email: user.email,
      setCookieNames: cookiesToSet.map((cookie) => cookie.name),
      finalRedirect: "/admin/login?error=missing-service-role",
    });
    return redirectWithCookies(request, "/admin/login?error=missing-service-role", cookiesToSet);
  }

  const { data: admin, error: adminError } = await adminSupabase
    .from("admin_users")
    .select("user_id, email, approved")
    .eq("user_id", user.id)
    .eq("approved", true)
    .maybeSingle();

  if (adminError) {
    debugError("admin approval query failed", adminError);
    await supabase.auth.signOut();
    debugLog("redirect decision", {
      userId: user.id,
      email: user.email,
      approvalExists: false,
      setCookieNames: cookiesToSet.map((cookie) => cookie.name),
      finalRedirect: "/admin/login?error=not-approved",
    });
    return redirectWithCookies(request, "/admin/login?error=not-approved", cookiesToSet);
  }

  if (!admin) {
    await supabase.auth.signOut();
    debugLog("admin approval result", {
      userId: user.id,
      email: user.email,
      approvalExists: false,
      setCookieNames: cookiesToSet.map((cookie) => cookie.name),
      finalRedirect: "/admin/login?error=not-approved",
    });
    return redirectWithCookies(request, "/admin/login?error=not-approved", cookiesToSet);
  }

  debugLog("admin approval result", {
    userId: user.id,
    email: user.email,
    approvalExists: true,
    setCookieNames: cookiesToSet.map((cookie) => cookie.name),
    finalRedirect: "/admin",
  });

  return redirectWithCookies(request, "/admin", cookiesToSet);
}
