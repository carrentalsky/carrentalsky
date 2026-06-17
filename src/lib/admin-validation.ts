import { z } from "zod";

const urlOrPath = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || "");

export const siteSettingsSchema = z.object({
  website_name: z.string().trim().min(2),
  logo_light_url: urlOrPath,
  logo_dark_url: urlOrPath,
  favicon_url: urlOrPath,
  contact_email: z.string().trim().email(),
  header_cta_text: z.string().trim().min(1),
  header_cta_link: z.string().trim().min(1),
  footer_description: z.string().trim().min(10),
  social_links: z.record(z.string(), z.string()).default({}),
});

export const homepageSectionSchema = z.object({
  section_key: z.enum(["hero", "seo", "how_it_works", "popular_locations"]),
  title: z.string().trim().min(2),
  subtitle: z.string().trim().optional().default(""),
  image_url: urlOrPath,
  cta_text: z.string().trim().optional().default(""),
  cta_link: z.string().trim().optional().default(""),
  sort_order: z.coerce.number().int().min(0).default(0),
  enabled: z.boolean().default(false),
  content: z.record(z.string(), z.unknown()).default({}),
});

export const pageSchema = z.object({
  id: z.string().trim().optional(),
  title: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  excerpt: z.string().trim().optional().default(""),
  content: z.string().trim().min(1),
  hero_image_url: urlOrPath,
  meta_title: z.string().trim().optional().default(""),
  meta_description: z.string().trim().optional().default(""),
  canonical_url: z.string().trim().optional().default(""),
  og_image_url: urlOrPath,
  robots_index: z.boolean().default(true),
  status: z.enum(["published", "draft"]),
});

export const faqSchema = z.object({
  id: z.string().trim().optional(),
  page_slug: z.string().trim().min(1),
  question: z.string().trim().min(3),
  answer: z.string().trim().min(3),
  sort_order: z.coerce.number().int().min(0).default(0),
  enabled: z.boolean().default(false),
});
