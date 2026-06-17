import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ settings, dark = false }: { settings: SiteSettings; dark?: boolean }) {
  return (
    <header className={dark ? "bg-[#06162c] text-white" : "bg-white/85 text-[#0d1726] backdrop-blur"}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="CarRentalSky home">
          <Image
            src={dark ? settings.logo_dark_url : settings.logo_light_url}
            alt={`${settings.website_name} logo`}
            width={240}
            height={80}
            priority
            className="h-10 w-auto object-contain sm:h-12"
          />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={dark ? "text-white/78 hover:text-white" : "text-slate-600 hover:text-slate-950"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href={settings.header_cta_link || "/contact"}
          className="inline-flex h-11 items-center justify-center rounded-md bg-[#1463ff] px-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-[#0d4fd5]"
        >
          {settings.header_cta_text || "Contact us"}
        </Link>
      </div>
    </header>
  );
}
