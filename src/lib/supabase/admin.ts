import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminEnv, hasSupabaseAdminEnv } from "@/lib/env";
import type { Database } from "@/lib/types";

export function createSupabaseAdminClient() {
  if (!hasSupabaseAdminEnv()) {
    return null;
  }

  const { url, serviceRoleKey } = getSupabaseAdminEnv();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
