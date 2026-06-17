import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  defaultFaqs,
  defaultHomepageSections,
  defaultPages,
  defaultSettings,
} from "@/lib/seed";
import type { Faq, HomepageSection, MediaItem, PageRecord, SiteSettings } from "@/lib/types";

export async function getSiteSettings(): Promise<SiteSettings> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return defaultSettings;

  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data ?? defaultSettings;
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return defaultHomepageSections;

  const { data } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });

  return data?.length ? data : defaultHomepageSections;
}

export async function getPublishedPage(slug: string): Promise<PageRecord | null> {
  noStore();
  const fallback = defaultPages.find((page) => page.slug === slug && page.status === "published") ?? null;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallback;

  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return data ?? fallback;
}

export async function getAllPages(): Promise<PageRecord[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return defaultPages;

  const { data } = await supabase.from("pages").select("*").order("updated_at", { ascending: false });
  return data?.length ? data : defaultPages;
}

export async function getPublishedPages(): Promise<PageRecord[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return defaultPages.filter((page) => page.status === "published");

  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  return data?.length ? data : defaultPages.filter((page) => page.status === "published");
}

export async function getFaqs(pageSlug?: string, includeDisabled = false): Promise<Faq[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return defaultFaqs
      .filter((faq) => (!pageSlug || faq.page_slug === pageSlug) && (includeDisabled || faq.enabled))
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  let query = supabase.from("faqs").select("*").order("sort_order", { ascending: true });
  if (pageSlug) query = query.eq("page_slug", pageSlug);
  if (!includeDisabled) query = query.eq("enabled", true);

  const { data } = await query;
  return data ?? [];
}

export async function getMediaLibrary(): Promise<MediaItem[]> {
  noStore();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export function getHomepageSection(sections: HomepageSection[], key: HomepageSection["section_key"]) {
  return sections.find((section) => section.section_key === key && section.enabled);
}
