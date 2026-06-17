import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { getSiteSettings } from "@/lib/content";

export async function PageShell({ children, darkHeader = false }: { children: ReactNode; darkHeader?: boolean }) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader settings={settings} dark={darkHeader} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
