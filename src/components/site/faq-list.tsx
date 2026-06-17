import type { Faq } from "@/lib/types";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1463ff]">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0d1726] sm:text-4xl">
            Common questions
          </h2>
        </div>
        <div className="mt-10 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {faqs.map((faq) => (
            <details key={faq.id} className="group p-5 open:bg-slate-50 sm:p-6">
              <summary className="cursor-pointer list-none text-base font-bold text-[#0d1726]">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
