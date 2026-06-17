import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAdmin } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/site-settings", label: "Site Settings" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/media", label: "Media" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <Link href="/" className="text-xl font-black text-[#1463ff]">
          CarRentalSky
        </Link>
        <nav className="mt-8 grid gap-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-[#1463ff]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Admin CMS</p>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
            <form action={signOutAdmin}>
              <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                Sign out
              </button>
            </form>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
