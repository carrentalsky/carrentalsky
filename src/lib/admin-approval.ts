import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const adminApprovalQueryDescription = {
  schema: "public",
  table: "admin_users",
  select: "user_id, email, approved",
  filters: ["user_id = authUserId", "approved = true"],
  userIdColumnExpectedType: "uuid matching auth.users.id",
  usesServiceRoleClient: true,
};

export type AdminApprovalLookup = {
  adminSupabaseAvailable: boolean;
  query: typeof adminApprovalQueryDescription & { authUserId: string };
  approvalExists: boolean;
  matchingAdminRows: Array<{ user_id: string; email: string; approved: boolean }>;
  rowsByUserId: Array<{ user_id: string; email: string; approved: boolean }>;
  rowsByEmail: Array<{ user_id: string; email: string; approved: boolean }>;
  approvedRowCount: number;
  userIdOnlyRowCount: number;
  emailRowCount: number;
  queryError: { code?: string; message?: string } | null;
  userIdOnlyQueryError: { code?: string; message?: string } | null;
  emailQueryError: { code?: string; message?: string } | null;
  rlsNote: string;
};

function safeError(error: { code?: string; message?: string } | null) {
  return error ? { code: error.code, message: error.message } : null;
}

export async function lookupAdminApproval(authUserId: string, email?: string | null): Promise<AdminApprovalLookup> {
  const adminSupabase = createSupabaseAdminClient();
  const query = { ...adminApprovalQueryDescription, authUserId };

  if (!adminSupabase) {
    return {
      adminSupabaseAvailable: false,
      query,
      approvalExists: false,
      matchingAdminRows: [],
      rowsByUserId: [],
      rowsByEmail: [],
      approvedRowCount: 0,
      userIdOnlyRowCount: 0,
      emailRowCount: 0,
      queryError: { code: "missing_service_role", message: "SUPABASE_SERVICE_ROLE_KEY is not configured." },
      userIdOnlyQueryError: null,
      emailQueryError: null,
      rlsNote: "RLS remains enabled. Service-role queries bypass RLS for this server-only approval check.",
    };
  }

  const approvedQuery = adminSupabase
    .schema("public")
    .from("admin_users")
    .select("user_id, email, approved")
    .eq("user_id", authUserId)
    .eq("approved", true);

  const userIdOnlyQuery = adminSupabase
    .schema("public")
    .from("admin_users")
    .select("user_id, email, approved")
    .eq("user_id", authUserId);

  const emailQuery = email
    ? adminSupabase
        .schema("public")
        .from("admin_users")
        .select("user_id, email, approved")
        .eq("email", email)
    : null;

  const [approvedResult, userIdOnlyResult, emailResult] = await Promise.all([
    approvedQuery,
    userIdOnlyQuery,
    emailQuery ?? Promise.resolve({ data: [], error: null }),
  ]);

  const matchingAdminRows = approvedResult.data ?? [];
  const rowsByUserId = userIdOnlyResult.data ?? [];
  const rowsByEmail = emailResult.data ?? [];

  return {
    adminSupabaseAvailable: true,
    query,
    approvalExists: matchingAdminRows.length > 0,
    matchingAdminRows,
    rowsByUserId,
    rowsByEmail,
    approvedRowCount: matchingAdminRows.length,
    userIdOnlyRowCount: rowsByUserId.length,
    emailRowCount: rowsByEmail.length,
    queryError: safeError(approvedResult.error),
    userIdOnlyQueryError: safeError(userIdOnlyResult.error),
    emailQueryError: safeError(emailResult.error),
    rlsNote: "RLS remains enabled. Service-role queries bypass RLS for this server-only approval check.",
  };
}
