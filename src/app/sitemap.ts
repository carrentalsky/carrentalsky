import type { MetadataRoute } from "next";
import { getPublishedPages } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getPublishedPages();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...pages.map((page) => ({
      url: absoluteUrl(page.canonical_url || `/${page.slug}`),
      lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: page.slug === "about" ? 0.8 : 0.6,
    })),
  ];
}
