import Link from "next/link";
import { getAllPages, getFaqs, getMediaLibrary, getSiteSettings } from "@/lib/content";

const cards = [
  { href: "/admin/site-settings", label: "Site Settings", text: "Brand, logos, contact, footer, and social links." },
  { href: "/admin/homepage", label: "Homepage Editor", text: "Hero, SEO content, how it works, and locations." },
  { href: "/admin/pages", label: "Page Manager", text: "Create and edit SEO-ready public pages." },
  { href: "/admin/faqs", label: "FAQ Manager", text: "Add page-level and homepage FAQs." },
  { href: "/admin/media", label: "Media Library", text: "Upload compressed WebP images to Supabase Storage." },
];

export default async function AdminDashboard() {
  const [settings, pages, faqs, media] = await Promise.all([
    getSiteSettings(),
    getAllPages(),
    getFaqs(undefined, true),
    getMediaLibrary(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Website foundation</h1>
      <p className="mt-2 text-slate-600">
        Manage {settings.website_name} content without touching the codebase.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Pages</p>
          <p className="mt-2 text-3xl font-black">{pages.length}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">FAQs</p>
          <p className="mt-2 text-3xl font-black">{faqs.length}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">Media items</p>
          <p className="mt-2 text-3xl font-black">{media.length}</p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200">
            <h2 className="text-lg font-black text-slate-950">{card.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
