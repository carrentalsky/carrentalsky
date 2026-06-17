create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.approved = true
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  website_name text not null default 'CarRentalSky',
  logo_light_url text not null default '/brand/logo-light.png',
  logo_dark_url text not null default '/brand/logo-dark.png',
  favicon_url text not null default '/favicon.ico',
  contact_email text not null default 'hello@carrentalsky.com',
  header_cta_text text not null default 'Contact us',
  header_cta_link text not null default '/contact',
  footer_description text not null default 'CarRentalSky is building a cleaner way to plan car rentals worldwide.',
  social_links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  hero_image_url text,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image_url text,
  robots_index boolean not null default true,
  status text not null default 'draft' check (status in ('published', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique check (section_key in ('hero', 'seo', 'how_it_works', 'popular_locations')),
  title text not null,
  subtitle text,
  image_url text,
  cta_text text,
  cta_link text,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null default 'homepage',
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  original_file_name text not null,
  url text not null,
  bucket text not null default 'website-images',
  path text not null,
  mime_type text not null,
  width integer,
  height integer,
  size_before integer not null,
  size_after integer not null,
  alt_text text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_pages_updated_at on public.pages;
create trigger set_pages_updated_at
before update on public.pages
for each row execute function public.set_updated_at();

drop trigger if exists set_homepage_sections_updated_at on public.homepage_sections;
create trigger set_homepage_sections_updated_at
before update on public.homepage_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_faqs_updated_at on public.faqs;
create trigger set_faqs_updated_at
before update on public.faqs
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.faqs enable row level security;
alter table public.media_library enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
drop policy if exists "Approved admins can read own admin row" on public.admin_users;
drop policy if exists "Approved admins can read all admin users" on public.admin_users;

create policy "Approved admins can read own admin row"
on public.admin_users for select
to authenticated
using (user_id = auth.uid() and approved = true);

create policy "Approved admins can read all admin users"
on public.admin_users for select
to authenticated
using (public.is_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
on public.site_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published pages" on public.pages;
create policy "Public can read published pages"
on public.pages for select
to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage pages" on public.pages;
create policy "Admins can manage pages"
on public.pages for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read enabled homepage sections" on public.homepage_sections;
create policy "Public can read enabled homepage sections"
on public.homepage_sections for select
to anon, authenticated
using (enabled = true or public.is_admin());

drop policy if exists "Admins can manage homepage sections" on public.homepage_sections;
create policy "Admins can manage homepage sections"
on public.homepage_sections for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read enabled faqs" on public.faqs;
create policy "Public can read enabled faqs"
on public.faqs for select
to anon, authenticated
using (enabled = true or public.is_admin());

drop policy if exists "Admins can manage faqs" on public.faqs;
create policy "Admins can manage faqs"
on public.faqs for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read media library" on public.media_library;
create policy "Public can read media library"
on public.media_library for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage media library" on public.media_library;
create policy "Admins can manage media library"
on public.media_library for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.site_settings (id, website_name, logo_light_url, logo_dark_url, favicon_url, contact_email, header_cta_text, header_cta_link, footer_description, social_links)
values (
  1,
  'CarRentalSky',
  '/brand/logo-light.png',
  '/brand/logo-dark.png',
  '/favicon.ico',
  'hello@carrentalsky.com',
  'Contact us',
  '/contact',
  'CarRentalSky is building a cleaner way to plan car rentals across trusted destinations worldwide.',
  '{"linkedin":"","x":"","facebook":"","instagram":""}'::jsonb
)
on conflict (id) do nothing;

insert into public.homepage_sections (section_key, title, subtitle, image_url, cta_text, cta_link, content, sort_order, enabled)
values
  ('hero', 'Compare car rental options with confidence', 'CarRentalSky is a premium travel-tech foundation for discovering trusted car rental choices in global destinations.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=80', 'Explore popular locations', '#popular-locations', '{"badges":["Global destinations","Transparent planning","Built for travelers"]}'::jsonb, 1, true),
  ('seo', 'A smarter car rental planning experience', 'Built for search visibility, trust, and future comparison workflows.', null, null, null, '{"body":"CarRentalSky helps travelers understand how to approach car rental decisions before they book. Phase 1 focuses on destination content, helpful FAQs, transparent policies, and a scalable CMS foundation."}'::jsonb, 2, true),
  ('how_it_works', 'How it works', 'Simple planning today, deeper comparison tools later.', null, null, null, '{"steps":[{"title":"Choose your destination","text":"Start with high-intent location content and travel guidance."},{"title":"Review rental essentials","text":"Understand documents, deposits, insurance, and pickup expectations."},{"title":"Plan with confidence","text":"Use clear editorial content while the comparison engine is prepared for later phases."}]}'::jsonb, 3, true),
  ('popular_locations', 'Popular car rental locations', 'Destination pages can be added from the CMS as the site grows.', null, null, null, '{"locations":["Dubai","London","Istanbul","Paris","Los Angeles","Rome"]}'::jsonb, 4, true)
on conflict (section_key) do nothing;

insert into public.pages (title, slug, excerpt, content, hero_image_url, meta_title, meta_description, canonical_url, robots_index, status)
values
  ('About CarRentalSky', 'about', 'Learn how CarRentalSky is building a trusted car rental planning platform.', '<p>CarRentalSky is a travel-tech website built to help travelers plan car rentals with clarity. Our first phase focuses on useful destination content, transparent site policies, and a scalable editorial system.</p><p>Future phases may add richer comparison and supplier workflows, but the foundation begins with trust, speed, and SEO-ready content.</p>', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1800&q=80', 'About CarRentalSky', 'Learn about CarRentalSky and our mission to make car rental planning clearer.', '/about', true, 'published'),
  ('Privacy Policy', 'privacy-policy', 'How CarRentalSky handles privacy and data.', '<p>This Privacy Policy explains how CarRentalSky may collect and use information submitted through this website. Replace this starter policy with legal counsel-approved content before launch.</p><h2>Information we collect</h2><p>We may collect contact details when you submit a form, plus standard analytics and technical information used to improve the website.</p><h2>Contact</h2><p>For privacy questions, contact hello@carrentalsky.com.</p>', null, 'Privacy Policy', 'Read the CarRentalSky privacy policy.', '/privacy-policy', true, 'published'),
  ('Terms & Conditions', 'terms-and-conditions', 'Terms governing use of CarRentalSky.', '<p>These Terms & Conditions provide starter website terms for CarRentalSky. Replace this text with legal counsel-approved terms before launch.</p><h2>Use of the website</h2><p>Content is provided for general information and planning. Phase 1 does not process bookings or compare live supplier prices.</p>', null, 'Terms & Conditions', 'Read the CarRentalSky terms and conditions.', '/terms-and-conditions', true, 'published'),
  ('Contact', 'contact', 'Contact the CarRentalSky team.', '<p>Have a partnership, editorial, or support question? Email us at hello@carrentalsky.com.</p>', null, 'Contact CarRentalSky', 'Contact the CarRentalSky team.', '/contact', true, 'published')
on conflict (slug) do nothing;

insert into public.faqs (page_slug, question, answer, sort_order, enabled)
values
  ('homepage', 'Can I book a car rental on CarRentalSky today?', 'Not yet. Phase 1 is focused on the website foundation, content management, SEO, and admin tools. Booking and supplier integrations are planned for later phases.', 1, true),
  ('homepage', 'Does CarRentalSky compare live supplier prices?', 'No. The current foundation is designed to support future comparison features, but it does not include OTA integrations or live pricing.', 2, true),
  ('homepage', 'Can admins update website content?', 'Yes. Approved admins can update site settings, homepage content, pages, FAQs, and media from the protected admin panel.', 3, true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('website-images', 'website-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read website images" on storage.objects;
create policy "Public can read website images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'website-images');

drop policy if exists "Admins can upload website images" on storage.objects;
create policy "Admins can upload website images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'website-images' and public.is_admin());

drop policy if exists "Admins can update website images" on storage.objects;
create policy "Admins can update website images"
on storage.objects for update
to authenticated
using (bucket_id = 'website-images' and public.is_admin())
with check (bucket_id = 'website-images' and public.is_admin());

drop policy if exists "Admins can delete website images" on storage.objects;
create policy "Admins can delete website images"
on storage.objects for delete
to authenticated
using (bucket_id = 'website-images' and public.is_admin());
