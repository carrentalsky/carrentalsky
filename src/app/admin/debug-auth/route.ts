import { NextResponse, type NextRequest } from "next/server";
import { lookupAdminApproval } from "@/lib/admin-approval";
import { getSupabaseUrlHost } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function cookieNames(request: NextRequest) {
  return request.cookies.getAll().map((cookie) => cookie.name);
}

function supabaseCookieNames(request: NextRequest) {
  return cookieNames(request).filter((name) => name.startsWith("sb-") || name.includes("auth-token"));
}

export async function GET(request: NextRequest) {
  if (process.env.ADMIN_LOGIN_DEBUG !== "1") {
    return NextResponse.json({ enabled: false }, { status: 404 });
  }

  const supabase = await createSupabaseServerClient();
  const authResult = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null }, error: { code: "missing_env", message: "Missing public Supabase env." } };

  const user = authResult.data.user;
  const approvalLookup = user ? await lookupAdminApproval(user.id, user.email) : null;

  return NextResponse.json({
    enabled: true,
    supabaseHost: getSupabaseUrlHost(),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    cookieNames: cookieNames(request),
    supabaseCookieNames: supabaseCookieNames(request),
    authenticated: Boolean(user),
    userId: user?.id ?? null,
    email: user?.email ?? null,
    authError: authResult.error
      ? {
          code: authResult.error.code,
          message: authResult.error.message,
        }
      : null,
    approvalExists: approvalLookup?.approvalExists ?? false,
    approvalError: approvalLookup?.queryError ?? null,
  });
}
