import Image from "next/image";
import { uploadMedia } from "@/app/admin/actions";
import { AdminCard, Field, SaveButton, TextInput } from "@/components/admin/form-controls";
import { getMediaLibrary } from "@/lib/content";

function kb(size: number) {
  return `${Math.round(size / 102.4) / 10} KB`;
}

export default async function MediaLibraryPage() {
  const media = await getMediaLibrary();

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Media Library</h1>
      <p className="mt-2 text-slate-600">Upload images to Supabase Storage. Files are compressed to WebP.</p>
      <div className="mt-8 grid gap-6">
        <AdminCard title="Upload image">
          <form action={uploadMedia} className="grid gap-5">
            <Field label="Image file">
              <TextInput name="file" type="file" accept="image/png,image/jpeg,image/webp" required />
            </Field>
            <Field label="Alt text">
              <TextInput name="alt_text" />
            </Field>
            <SaveButton>Upload and compress</SaveButton>
          </form>
        </AdminCard>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[16/10] bg-slate-100">
                <Image src={item.url} alt={item.alt_text ?? item.original_file_name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h2 className="line-clamp-1 text-sm font-black">{item.original_file_name}</h2>
                <p className="mt-2 break-all text-xs text-slate-500">{item.url}</p>
                <p className="mt-3 text-xs font-semibold text-slate-600">
                  {kb(item.size_before)} → {kb(item.size_after)}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
