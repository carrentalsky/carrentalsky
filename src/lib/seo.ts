import type { Metadata } from "next";
import type { Faq, PageRecord } from "@/lib/types";

export function absoluteUrl(path?: string | null) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://carrentalsky.com").replace(/\/$/, "");
  if (!path) return base;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function metadataFromPage(page: PageRecord): Metadata {
  const canonical = page.canonical_url || `/${page.slug}`;
  const title = page.meta_title || page.title;
  const description = page.meta_description || page.excerpt || undefined;
  const image = page.og_image_url || page.hero_image_url || "/brand/logo-light.png";

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(canonical),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      siteName: "CarRentalSky",
      images: image ? [{ url: absoluteUrl(image) }] : undefined,
      type: "website",
    },
    robots: {
      index: page.robots_index,
      follow: page.robots_index,
    },
  };
}

export function faqJsonLd(faqs: Faq[]) {
  if (!faqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
