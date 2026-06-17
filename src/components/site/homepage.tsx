import Link from "next/link";
import { FaqList } from "@/components/site/faq-list";
import type { Faq, HomepageSection } from "@/lib/types";
import { getHomepageSection } from "@/lib/content";

type ContentRecord = Record<string, unknown>;

function asRecord(value: unknown): ContentRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as ContentRecord) : {};
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function Homepage({ sections, faqs }: { sections: HomepageSection[]; faqs: Faq[] }) {
  const hero = getHomepageSection(sections, "hero");
  const seo = getHomepageSection(sections, "seo");
  const how = getHomepageSection(sections, "how_it_works");
  const popular = getHomepageSection(sections, "popular_locations");

  const heroContent = asRecord(hero?.content);
  const badges = stringArray(heroContent.badges);
  const seoContent = asRecord(seo?.content);
  const howContent = asRecord(how?.content);
  const popularContent = asRecord(popular?.content);
  const steps = Array.isArray(howContent.steps) ? (howContent.steps as ContentRecord[]) : [];
  const locations = stringArray(popularContent.locations);

  return (
    <>
      <section className="relative overflow-hidden bg-[#06162c] text-white">
        {hero?.image_url && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-28"
            style={{ backgroundImage: `url(${hero.image_url})` }}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#06162c] via-[#06162c]/92 to-[#1463ff]/72" />
        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">CarRentalSky</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              {hero?.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76 sm:text-xl">{hero?.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={hero?.cta_link || "#popular-locations"}
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-bold text-[#06162c] shadow-lg shadow-black/20 transition hover:bg-blue-50"
              >
                {hero?.cta_text || "Explore locations"}
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/24 px-6 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Learn about us
              </Link>
            </div>
            {badges.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {badges.map((badge) => (
                  <span key={badge} className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white/80">
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-lg border border-white/14 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="grid gap-3 rounded-md bg-white p-4 text-[#0d1726]">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-md border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase text-slate-400">Pickup</p>
                  <p className="mt-2 font-bold">Choose destination</p>
                </div>
                <div className="rounded-md border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase text-slate-400">Dates</p>
                  <p className="mt-2 font-bold">Plan your journey</p>
                </div>
              </div>
              <div className="rounded-md bg-[#1463ff] px-4 py-4 text-center text-sm font-bold text-white">
                Comparison engine coming in a later phase
              </div>
            </div>
          </div>
        </div>
      </section>

      {seo && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1463ff]">Travel-tech foundation</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{seo.title}</h2>
              <p className="mt-4 text-slate-600">{seo.subtitle}</p>
            </div>
            <p className="text-lg leading-9 text-slate-600">{String(seoContent.body ?? "")}</p>
          </div>
        </section>
      )}

      {how && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1463ff]">How it works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{how.title}</h2>
              <p className="mt-4 text-slate-600">{how.subtitle}</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <article key={`${step.title}-${index}`} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-sm font-black text-[#1463ff]">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{String(step.title ?? "")}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{String(step.text ?? "")}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {popular && (
        <section id="popular-locations" className="bg-[#06162c] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">Popular locations</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{popular.title}</h2>
              <p className="mt-4 text-white/68">{popular.subtitle}</p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {locations.map((location) => (
                <div key={location} className="rounded-lg border border-white/12 bg-white/8 p-5">
                  <h3 className="text-xl font-bold">{location}</h3>
                  <p className="mt-2 text-sm text-white/60">Destination content ready for CMS expansion.</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FaqList faqs={faqs} />
    </>
  );
}
