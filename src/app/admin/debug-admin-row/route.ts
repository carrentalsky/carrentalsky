import { NextResponse } from "next/server";
import { lookupAdminApproval } from "@/lib/admin-approval";
import { getSupabaseUrlHost } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.ADMIN_LOGIN_DEBUG !== "1") {
    return NextResponse.json({ enabled: false }, { status: 404 });
  }

  const supabase = await createSupabaseServerClient();
  const authResult = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null }, error: { code: "missing_env", message: "Missing public Supabase env." } };

  const user = authResult.data.user;
  const lookup = user ? await lookupAdminApproval(user.id, user.email) : null;

  return NextResponse.json({
    enabled: true,
    supabaseHost: getSupabaseUrlHost(),
    authUserId: user?.id ?? null,
    authUserEmail: user?.email ?? null,
    authError: authResult.error
      ? {
          code: authResult.error.code,
          message: authResult.error.message,
        }
      : null,
    queryingSchema: lookup?.query.schema ?? "public",
    queryingTable: lookup?.query.table ?? "admin_users",
    exactQuery: lookup?.query ?? null,
    serviceRoleClientUsed: lookup?.adminSupabaseAvailable ?? false,
    userIdColumnExpectedType: lookup?.query.userIdColumnExpectedType ?? "uuid matching auth.users.id",
    rlsEnabledExpected: true,
    rlsNote:
      lookup?.rlsNote ??
      "RLS remains enabled. Service-role queries bypass RLS for this server-only approval check.",
    matchingAdminRows: lookup?.matchingAdminRows ?? [],
    matchingAdminRowCount: lookup?.approvedRowCount ?? 0,
    rowsByUserId: lookup?.rowsByUserId ?? [],
    rowsByUserIdCount: lookup?.userIdOnlyRowCount ?? 0,
    rowsByEmail: lookup?.rowsByEmail ?? [],
    rowsByEmailCount: lookup?.emailRowCount ?? 0,
    approvalExists: lookup?.approvalExists ?? false,
    queryError: lookup?.queryError ?? null,
    userIdOnlyQueryError: lookup?.userIdOnlyQueryError ?? null,
    emailQueryError: lookup?.emailQueryError ?? null,
  });
}
