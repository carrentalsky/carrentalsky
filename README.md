# CarRentalSky

Phase 1 website foundation for `carrentalsky.com`, built with Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth, Supabase Database, Supabase Storage, Vercel, and Cloudflare DNS.

## What Phase 1 Includes

- Public pages: homepage, about, privacy policy, terms and conditions, contact.
- Protected admin CMS using Supabase Auth and `admin_users` approval checks.
- Site settings editor for logo URLs, favicon URL, contact email, header CTA, footer copy, and social links.
- Homepage editor for hero, SEO content, how it works, popular locations, and FAQ content.
- Page manager with SEO fields, canonical URL, Open Graph image, robots index/noindex, draft/published status.
- FAQ manager for homepage and page-specific FAQs.
- Media library with server-side Sharp compression to WebP, Supabase Storage upload, and before/after size tracking.
- Dynamic metadata, sitemap, robots.txt, Organization schema, Website schema, and FAQ schema.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SITE_URL=https://carrentalsky.com
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

The site renders seeded fallback content without Supabase env vars, but admin and CMS writes require Supabase.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_phase_1_foundation.sql` in the Supabase SQL editor.
3. Create an admin user in Supabase Auth.
4. Approve that user by inserting their Auth user ID into `admin_users`:

```sql
insert into public.admin_users (user_id, email, approved)
values ('AUTH_USER_UUID', 'admin@example.com', true);
```

The migration creates:

- `site_settings`
- `pages`
- `homepage_sections`
- `faqs`
- `media_library`
- `admin_users`
- `website-images` storage bucket
- RLS policies for public reads and admin-only writes

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Admin URL:

```bash
http://localhost:3000/admin
```

## Build Check

```bash
npm run lint
npm run build
```

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables from `.env.example` to the Vercel project.
4. Set the production domain to `carrentalsky.com`.
5. In Cloudflare DNS, point the domain records to Vercel as instructed by Vercel.
6. Redeploy after Supabase env vars are configured.

## Phase 1 Boundaries

This project intentionally does not include OTA integrations, booking engine logic, car search APIs, affiliate widgets, supplier comparison, payments, or real-time rental availability. Those are reserved for later phases.
