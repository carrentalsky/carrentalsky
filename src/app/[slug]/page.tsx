import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/site/faq-list";
import { PageShell } from "@/components/site/page-shell";
import { getFaqs, getPublishedPage } from "@/lib/content";
import { faqJsonLd, metadataFromPage } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) return {};
  return metadataFromPage(page);
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, faqs] = await Promise.all([getPublishedPage(slug), getFaqs(slug)]);

  if (!page) {
    notFound();
  }

  const faqSchema = faqJsonLd(faqs);

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-[#06162c] px-4 py-20 text-white sm:px-6 lg:px-8">
        {page.hero_image_url && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${page.hero_image_url})` }}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#06162c] to-[#1463ff]/70" />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">CarRentalSky</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">{page.title}</h1>
          {page.excerpt && <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">{page.excerpt}</p>}
        </div>
      </section>
      <section className="bg-white py-14 sm:py-16">
        <article
          className="prose-content mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </section>
      <FaqList faqs={faqs} />
      {faqSchema && (
        <Script
          id={`${page.slug}-faq-jsonld`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </PageShell>
  );
}
