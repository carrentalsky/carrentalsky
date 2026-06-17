import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const links = [
    { href: "/about", label: "About" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-and-conditions", label: "Terms & Conditions" },
    { href: "/contact", label: "Contact" },
  ];
  const socials = Object.entries(settings.social_links ?? {}).filter(([, url]) => Boolean(url));

  return (
    <footer className="bg-[#06162c] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Image
            src={settings.logo_dark_url}
            alt={`${settings.website_name} logo`}
            width={260}
            height={86}
            className="h-12 w-auto object-contain"
          />
          <p className="mt-5 max-w-md text-sm leading-7 text-white/68">{settings.footer_description}</p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white/48">Company</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-white/72 hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white/48">Contact</h2>
          <a className="mt-4 block text-sm text-white/72 hover:text-white" href={`mailto:${settings.contact_email}`}>
            {settings.contact_email}
          </a>
          {socials.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {socials.map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-white/16 px-3 py-2 text-xs font-semibold uppercase text-white/72 hover:border-white/36 hover:text-white"
                >
                  {name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {settings.website_name}. All rights reserved.
      </div>
    </footer>
  );
}
