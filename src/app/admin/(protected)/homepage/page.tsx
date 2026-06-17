import { updateHomepageSection } from "@/app/admin/actions";
import { AdminCard, Field, SaveButton, TextArea, TextInput } from "@/components/admin/form-controls";
import { getHomepageSections } from "@/lib/content";

const labels: Record<string, string> = {
  hero: "Hero section",
  seo: "SEO content section",
  how_it_works: "How it works section",
  popular_locations: "Popular locations section",
};

export default async function HomepageEditorPage() {
  const sections = await getHomepageSections();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Homepage Editor</h1>
      <p className="mt-2 text-slate-600">Edit the major homepage content blocks and structured JSON content.</p>
      <div className="mt-8 grid gap-6">
        {sections.map((section) => (
          <AdminCard key={section.section_key} title={labels[section.section_key] ?? section.section_key}>
            <form action={updateHomepageSection} className="grid gap-5">
              <input type="hidden" name="section_key" value={section.section_key} />
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Title">
                  <TextInput name="title" defaultValue={section.title} required />
                </Field>
                <Field label="Sort order">
                  <TextInput name="sort_order" type="number" defaultValue={section.sort_order} />
                </Field>
                <Field label="Subtitle">
                  <TextInput name="subtitle" defaultValue={section.subtitle ?? ""} />
                </Field>
                <Field label="Image URL">
                  <TextInput name="image_url" defaultValue={section.image_url ?? ""} />
                </Field>
                <Field label="CTA text">
                  <TextInput name="cta_text" defaultValue={section.cta_text ?? ""} />
                </Field>
                <Field label="CTA link">
                  <TextInput name="cta_link" defaultValue={section.cta_link ?? ""} />
                </Field>
              </div>
              <Field label="Content JSON" hint="Use JSON for badges, SEO body, steps, or popular locations.">
                <TextArea
                  name="content"
                  defaultValue={JSON.stringify(section.content ?? {}, null, 2)}
                  className="min-h-44 font-mono"
                  spellCheck={false}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <input type="checkbox" name="enabled" defaultChecked={section.enabled} />
                Enabled
              </label>
              <SaveButton />
            </form>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
