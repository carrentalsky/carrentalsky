import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      {children}
      {hint && <span className="text-xs leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#1463ff] focus:ring-4 focus:ring-blue-100 ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-28 rounded-md border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-[#1463ff] focus:ring-4 focus:ring-blue-100 ${props.className ?? ""}`}
    />
  );
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`min-h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#1463ff] focus:ring-4 focus:ring-blue-100 ${props.className ?? ""}`}
    />
  );
}

export function SaveButton({ children = "Save changes" }: { children?: ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex h-11 items-center justify-center rounded-md bg-[#1463ff] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#0d4fd5]"
    >
      {children}
    </button>
  );
}

export function DangerButton({ children = "Delete" }: { children?: ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex h-10 items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
    >
      {children}
    </button>
  );
}

export function AdminCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
