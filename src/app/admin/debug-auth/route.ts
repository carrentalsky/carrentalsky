import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseUrlHost } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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
  const adminSupabase = createSupabaseAdminClient();
  const authResult = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null }, error: { code: "missing_env", message: "Missing public Supabase env." } };

  const user = authResult.data.user;
  const approvalResult =
    adminSupabase && user
      ? await adminSupabase
          .from("admin_users")
          .select("user_id, email, approved")
          .eq("user_id", user.id)
          .eq("approved", true)
          .maybeSingle()
      : { data: null, error: null };

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
    approvalExists: Boolean(approvalResult.data),
    approvalError: approvalResult.error
      ? {
          code: approvalResult.error.code,
          message: approvalResult.error.message,
        }
      : null,
  });
}
