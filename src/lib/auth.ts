import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function logAdminLookupError(error: { message?: string; code?: string } | null | undefined) {
  if (process.env.ADMIN_LOGIN_DEBUG !== "1" || !error) return;

  console.warn("[admin-auth]", "admin approval lookup failed", {
    message: error.message,
    code: error.code,
  });
}

export async function getCurrentAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("user_id, email, approved")
    .eq("user_id", user.id)
    .eq("approved", true)
    .maybeSingle();

  if (error) {
    logAdminLookupError(error);
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
