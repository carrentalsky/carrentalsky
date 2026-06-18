import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function logAdminLookupError(error: { message?: string; code?: string } | null | undefined) {
  if (process.env.ADMIN_LOGIN_DEBUG !== "1" || !error) return;

  console.warn("[admin-auth]", "admin approval lookup failed", {
    message: error.message,
    code: error.code,
  });
}

function logAdminLookupDebug(label: string, details: Record<string, unknown>) {
  if (process.env.ADMIN_LOGIN_DEBUG !== "1") return;
  console.warn("[admin-auth]", label, details);
}

export async function getCurrentAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const adminSupabase = createSupabaseAdminClient();
  if (!adminSupabase) {
    logAdminLookupDebug("service role client missing", {
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
    return null;
  }

  const { data: admin, error } = await adminSupabase
    .from("admin_users")
    .select("user_id, email, approved")
    .eq("user_id", user.id)
    .eq("approved", true)
    .maybeSingle();

  if (error) {
    logAdminLookupError(error);
  }

  if (!error && !admin) {
    logAdminLookupDebug("admin approval row not found", {
      userId: user.id,
      email: user.email,
    });
  }

  return !error && admin ? { user, admin } : null;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
