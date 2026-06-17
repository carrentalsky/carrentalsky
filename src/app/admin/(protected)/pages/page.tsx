import { deletePage, upsertPage } from "@/app/admin/actions";
import {
  AdminCard,
  DangerButton,
  Field,
  SaveButton,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/admin/form-controls";
import { getAllPages } from "@/lib/content";

export default async function PagesManagerPage() {
  const pages = await getAllPages();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Page Manager</h1>
      <p className="mt-2 text-slate-600">Create and edit SEO-ready public pages.</p>
      <div className="mt-8 grid gap-6">
        <PageForm title="Create new page" />
        {pages.map((page) => (
          <AdminCard key={page.id} title={`Edit: ${page.title}`}>
            <PageForm page={page} />
            <form action={deletePage} className="mt-4">
              <input type="hidden" name="id" value={page.id} />
              <input type="hidden" name="slug" value={page.slug} />
              <DangerButton>Delete page</DangerButton>
            </form>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}

type PageFormProps = {
  title?: string;
  page?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    hero_image_url: string | null;
    meta_title: string | null;
    meta_description: string | null;
    canonical_url: string | null;
    og_image_url: string | null;
    robots_index: boolean;
    status: string;
  };
};

function PageForm({ title, page }: PageFormProps) {
  const form = (
    <form action={upsertPage} className="grid gap-5">
      {page?.id && <input type="hidden" name="id" value={page.id} />}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title">
          <TextInput name="title" defaultValue={page?.title ?? ""} required />
        </Field>
        <Field label="Slug">
          <TextInput name="slug" defaultValue={page?.slug ?? ""} required pattern="[a-z0-9]+(-[a-z0-9]+)*" />
        </Field>
        <Field label="Hero image URL">
          <TextInput name="hero_image_url" defaultValue={page?.hero_image_url ?? ""} />
        </Field>
        <Field label="Status">
          <SelectInput name="status" defaultValue={page?.status ?? "draft"}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </SelectInput>
        </Field>
      </div>
      <Field label="Excerpt">
        <TextArea name="excerpt" defaultValue={page?.excerpt ?? ""} />
      </Field>
      <Field label="Content HTML" hint="Supports clean HTML for headings, paragraphs, and lists.">
        <TextArea name="content" defaultValue={page?.content ?? ""} className="min-h-52 font-mono" required />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Meta title">
          <TextInput name="meta_title" defaultValue={page?.meta_title ?? ""} />
        </Field>
        <Field label="Canonical URL">
          <TextInput name="canonical_url" defaultValue={page?.canonical_url ?? ""} />
        </Field>
        <Field label="OG image URL">
          <TextInput name="og_image_url" defaultValue={page?.og_image_url ?? ""} />
        </Field>
      </div>
      <Field label="Meta description">
        <TextArea name="meta_description" defaultValue={page?.meta_description ?? ""} />
      </Field>
      <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <input type="checkbox" name="robots_index" defaultChecked={page?.robots_index ?? true} />
        Allow search engines to index this page
      </label>
      <SaveButton>{page ? "Save page" : "Create page"}</SaveButton>
    </form>
  );

  if (!title) return form;
  return <AdminCard title={title}>{form}</AdminCard>;
}
