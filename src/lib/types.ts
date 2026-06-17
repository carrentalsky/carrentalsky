export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type SiteSettings = {
  id: number;
  website_name: string;
  logo_light_url: string;
  logo_dark_url: string;
  favicon_url: string;
  contact_email: string;
  header_cta_text: string;
  header_cta_link: string;
  footer_description: string;
  social_links: Record<string, string>;
  created_at?: string;
  updated_at?: string;
};

export type PageStatus = "draft" | "published";

export type PageRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  hero_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  robots_index: boolean;
  status: PageStatus;
  created_at?: string;
  updated_at?: string;
};

export type HomepageSection = {
  id: string;
  section_key: "hero" | "seo" | "how_it_works" | "popular_locations";
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  content: Json;
  sort_order: number;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Faq = {
  id: string;
  page_slug: string;
  question: string;
  answer: string;
  sort_order: number;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
};

export type MediaItem = {
  id: string;
  file_name: string;
  original_file_name: string;
  url: string;
  bucket: string;
  path: string;
  mime_type: string;
  width: number | null;
  height: number | null;
  size_before: number;
  size_after: number;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at?: string;
};

export type AdminUser = {
  id: string;
  user_id: string;
  email: string;
  approved: boolean;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      site_settings: {
        Row: SiteSettings;
        Insert: Partial<SiteSettings>;
        Update: Partial<SiteSettings>;
        Relationships: [];
      };
      pages: {
        Row: PageRecord;
        Insert: Partial<PageRecord>;
        Update: Partial<PageRecord>;
        Relationships: [];
      };
      homepage_sections: {
        Row: HomepageSection;
        Insert: Partial<HomepageSection>;
        Update: Partial<HomepageSection>;
        Relationships: [];
      };
      faqs: {
        Row: Faq;
        Insert: Partial<Faq>;
        Update: Partial<Faq>;
        Relationships: [];
      };
      media_library: {
        Row: MediaItem;
        Insert: Partial<MediaItem>;
        Update: Partial<MediaItem>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUser;
        Insert: Partial<AdminUser>;
        Update: Partial<AdminUser>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
