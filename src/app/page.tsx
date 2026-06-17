import type { Metadata } from "next";
import Script from "next/script";
import { Homepage } from "@/components/site/homepage";
import { PageShell } from "@/components/site/page-shell";
import { getFaqs, getHomepageSections } from "@/lib/content";
import { faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "CarRentalSky | Global Car Rental Comparison",
  description:
    "Plan car rental options across trusted global destinations with CarRentalSky, a premium travel-tech foundation for future comparison tools.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CarRentalSky | Global Car Rental Comparison",
    description: "A premium car rental planning foundation for global travelers.",
    url: "/",
    images: ["/brand/logo-light.png"],
  },
};

export default async function Home() {
  const [sections, faqs] = await Promise.all([getHomepageSections(), getFaqs("homepage")]);
  const faqSchema = faqJsonLd(faqs);

  return (
    <PageShell darkHeader>
      <Homepage sections={sections} faqs={faqs} />
      {faqSchema && (
        <Script
          id="homepage-faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </PageShell>
  );
}
