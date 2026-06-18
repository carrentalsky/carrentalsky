"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/types";
import {
  faqSchema,
  homepageSectionSchema,
  pageSchema,
  siteSettingsSchema,
} from "@/lib/admin-validation";

function parseJsonField(value: FormDataEntryValue | null, fallback: Record<string, unknown> = {}) {
  if (!value || typeof value !== "string" || !value.trim()) return fallback;
  return JSON.parse(value) as Record<string, unknown>;
}

function boolField(formData: FormData, name: string) {
  return formData.get(name) === "on" || formData.get(name) === "true";
}

function nullable(value: string) {
  return value.trim() ? value.trim() : null;
}

function slugifyFileName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").toLowerCase();
  return base.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "image";
}

function logAdminAuthError(
  label: string,
  error: { message?: string; status?: number; code?: string } | null | undefined,
) {
  if (process.env.ADMIN_LOGIN_DEBUG !== "1" || !error) return;

  console.warn("[admin-login]", label, {
    message: error.message,
    status: error.status,
    code: error.code,
  });
}

function logAdminAuthDebug(label: string, details: Record<string, unknown>) {
  if (process.env.ADMIN_LOGIN_DEBUG !== "1") return;
  console.warn("[admin-login]", label, details);
}

function classifyAuthError(error: { message?: string; status?: number; code?: string } | null | undefined) {
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

async function getAuthedSupabase() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error("Supabase environment variables are not configured.");
  }
  return supabase;
}

export async function signInAdmin(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=missing-env");

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    logAdminAuthError("signInWithPassword failed", error);
    redirect(`/admin/login?error=${classifyAuthError(error)}`);
  }

  const {
    data: { user: sessionUser },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !sessionUser || sessionUser.id !== data.user.id) {
    logAdminAuthError("auth.getUser after sign-in failed", sessionError);
    await supabase.auth.signOut();
    redirect("/admin/login?error=session-check-failed");
  }

  const adminSupabase = createSupabaseAdminClient();
  if (!adminSupabase) {
    logAdminAuthDebug("service role client missing", {
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
    await supabase.auth.signOut();
    redirect("/admin/login?error=missing-env");
  }

  const { data: admin, error: adminError } = await adminSupabase
    .from("admin_users")
    .select("user_id, email, approved")
    .eq("user_id", sessionUser.id)
    .eq("approved", true)
    .maybeSingle();

  if (adminError) {
    logAdminAuthError("admin approval lookup failed", adminError);
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-approved");
  }

  if (!admin) {
    logAdminAuthDebug("admin approval row not found", {
      userId: sessionUser.id,
      email: sessionUser.email,
    });
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-approved");
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

export async function updateSiteSettings(formData: FormData) {
  const supabase = await getAuthedSupabase();
  const payload = siteSettingsSchema.parse({
    website_name: formData.get("website_name"),
    logo_light_url: formData.get("logo_light_url"),
    logo_dark_url: formData.get("logo_dark_url"),
    favicon_url: formData.get("favicon_url"),
    contact_email: formData.get("contact_email"),
    header_cta_text: formData.get("header_cta_text"),
    header_cta_link: formData.get("header_cta_link"),
    footer_description: formData.get("footer_description"),
    social_links: parseJsonField(formData.get("social_links")),
  });

  const { error } = await supabase.from("site_settings").upsert({ id: 1, ...payload });
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/admin/site-settings");
}

export async function updateHomepageSection(formData: FormData) {
  const supabase = await getAuthedSupabase();
  const payload = homepageSectionSchema.parse({
    section_key: formData.get("section_key"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    image_url: formData.get("image_url"),
    cta_text: formData.get("cta_text"),
    cta_link: formData.get("cta_link"),
    sort_order: formData.get("sort_order"),
    enabled: boolField(formData, "enabled"),
    content: parseJsonField(formData.get("content")),
  });

  const { error } = await supabase
    .from("homepage_sections")
    .upsert({ ...payload, content: payload.content as Json }, { onConflict: "section_key" });

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/admin/homepage");
}

export async function upsertPage(formData: FormData) {
  const supabase = await getAuthedSupabase();
  const payload = pageSchema.parse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    hero_image_url: formData.get("hero_image_url"),
    meta_title: formData.get("meta_title"),
    meta_description: formData.get("meta_description"),
    canonical_url: formData.get("canonical_url"),
    og_image_url: formData.get("og_image_url"),
    robots_index: boolField(formData, "robots_index"),
    status: formData.get("status"),
  });

  const id = payload.id || crypto.randomUUID();
  const { error } = await supabase.from("pages").upsert({
    ...payload,
    id,
    excerpt: nullable(payload.excerpt),
    hero_image_url: nullable(payload.hero_image_url),
    meta_title: nullable(payload.meta_title),
    meta_description: nullable(payload.meta_description),
    canonical_url: nullable(payload.canonical_url),
    og_image_url: nullable(payload.og_image_url),
  });

  if (error) throw error;

  revalidatePath("/");
  revalidatePath(`/${payload.slug}`);
  revalidatePath("/admin/pages");
}

export async function deletePage(formData: FormData) {
  const supabase = await getAuthedSupabase();
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!id) return;

  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) throw error;

  revalidatePath(`/${slug}`);
  revalidatePath("/admin/pages");
}

export async function upsertFaq(formData: FormData) {
  const supabase = await getAuthedSupabase();
  const payload = faqSchema.parse({
    id: formData.get("id") || undefined,
    page_slug: formData.get("page_slug"),
    question: formData.get("question"),
    answer: formData.get("answer"),
    sort_order: formData.get("sort_order"),
    enabled: boolField(formData, "enabled"),
  });

  const { error } = await supabase.from("faqs").upsert({
    ...payload,
    id: payload.id || crypto.randomUUID(),
  });

  if (error) throw error;

  revalidatePath("/");
  revalidatePath(`/${payload.page_slug}`);
  revalidatePath("/admin/faqs");
}

export async function deleteFaq(formData: FormData) {
  const supabase = await getAuthedSupabase();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/admin/faqs");
}

export async function uploadMedia(formData: FormData) {
  const { user } = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase environment variables are not configured.");

  const file = formData.get("file");
  const altText = String(formData.get("alt_text") ?? "").trim();
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please choose an image file.");
  }

  const { default: sharp } = await import("sharp");
  const input = Buffer.from(await file.arrayBuffer());
  const source = sharp(input, { failOn: "none" }).rotate();
  const metadata = await source.metadata();
  const output = await source.webp({ quality: 82, effort: 5 }).toBuffer();
  const safeName = `${Date.now()}-${slugifyFileName(file.name)}.webp`;
  const path = `uploads/${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("website-images")
    .upload(path, output, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: publicUrl } = supabase.storage.from("website-images").getPublicUrl(path);

  const { error: insertError } = await supabase.from("media_library").insert({
    id: crypto.randomUUID(),
    file_name: safeName,
    original_file_name: file.name,
    url: publicUrl.publicUrl,
    bucket: "website-images",
    path,
    mime_type: "image/webp",
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    size_before: file.size,
    size_after: output.byteLength,
    alt_text: altText || null,
    uploaded_by: user.id,
  });

  if (insertError) throw insertError;

  revalidatePath("/admin/media");
}
