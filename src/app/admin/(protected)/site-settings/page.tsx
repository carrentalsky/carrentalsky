import { updateSiteSettings } from "@/app/admin/actions";
import { AdminCard, Field, SaveButton, TextArea, TextInput } from "@/components/admin/form-controls";
import { getSiteSettings } from "@/lib/content";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Site Settings</h1>
      <p className="mt-2 text-slate-600">Update global website branding and contact details.</p>
      <div className="mt-8">
        <AdminCard title="Global settings">
          <form action={updateSiteSettings} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Website name">
                <TextInput name="website_name" defaultValue={settings.website_name} required />
              </Field>
              <Field label="Contact email">
                <TextInput name="contact_email" type="email" defaultValue={settings.contact_email} required />
              </Field>
              <Field label="Logo light URL">
                <TextInput name="logo_light_url" defaultValue={settings.logo_light_url} required />
              </Field>
              <Field label="Logo dark URL">
                <TextInput name="logo_dark_url" defaultValue={settings.logo_dark_url} required />
              </Field>
              <Field label="Favicon URL">
                <TextInput name="favicon_url" defaultValue={settings.favicon_url} required />
              </Field>
              <Field label="Header CTA text">
                <TextInput name="header_cta_text" defaultValue={settings.header_cta_text} required />
              </Field>
              <Field label="Header CTA link">
                <TextInput name="header_cta_link" defaultValue={settings.header_cta_link} required />
              </Field>
            </div>
            <Field label="Footer description">
              <TextArea name="footer_description" defaultValue={settings.footer_description} required />
            </Field>
            <Field label="Social links JSON" hint='Example: {"linkedin":"https://linkedin.com/company/example"}'>
              <TextArea
                name="social_links"
                defaultValue={JSON.stringify(settings.social_links ?? {}, null, 2)}
                spellCheck={false}
              />
            </Field>
            <SaveButton />
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
