import { deleteFaq, upsertFaq } from "@/app/admin/actions";
import { AdminCard, DangerButton, Field, SaveButton, TextArea, TextInput } from "@/components/admin/form-controls";
import { getFaqs } from "@/lib/content";

export default async function FaqManagerPage() {
  const faqs = await getFaqs(undefined, true);

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">FAQ Manager</h1>
      <p className="mt-2 text-slate-600">Use page slug `homepage` for homepage FAQ schema.</p>
      <div className="mt-8 grid gap-6">
        <AdminCard title="Create new FAQ">
          <FaqForm />
        </AdminCard>
        {faqs.map((faq) => (
          <AdminCard key={faq.id} title={faq.question}>
            <FaqForm faq={faq} />
            <form action={deleteFaq} className="mt-4">
              <input type="hidden" name="id" value={faq.id} />
              <DangerButton>Delete FAQ</DangerButton>
            </form>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}

function FaqForm({
  faq,
}: {
  faq?: {
    id: string;
    page_slug: string;
    question: string;
    answer: string;
    sort_order: number;
    enabled: boolean;
  };
}) {
  return (
    <form action={upsertFaq} className="grid gap-5">
      {faq?.id && <input type="hidden" name="id" value={faq.id} />}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Page slug">
          <TextInput name="page_slug" defaultValue={faq?.page_slug ?? "homepage"} required />
        </Field>
        <Field label="Sort order">
          <TextInput name="sort_order" type="number" defaultValue={faq?.sort_order ?? 0} />
        </Field>
      </div>
      <Field label="Question">
        <TextInput name="question" defaultValue={faq?.question ?? ""} required />
      </Field>
      <Field label="Answer">
        <TextArea name="answer" defaultValue={faq?.answer ?? ""} required />
      </Field>
      <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <input type="checkbox" name="enabled" defaultChecked={faq?.enabled ?? true} />
        Enabled
      </label>
      <SaveButton>{faq ? "Save FAQ" : "Create FAQ"}</SaveButton>
    </form>
  );
}
