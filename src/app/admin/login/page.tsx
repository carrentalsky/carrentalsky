import Image from "next/image";
import { signInAdmin } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type LoginProps = {
  searchParams: Promise<{ error?: string }>;
};

const errors: Record<string, string> = {
  invalid: "Invalid login credentials. Check the email and reset the Supabase Auth password if needed.",
  "email-not-confirmed": "This Supabase Auth user exists but the email is not confirmed. Confirm the user in Supabase Authentication.",
  "supabase-config":
    "Supabase rejected the project URL or publishable anon key. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  "session-check-failed":
    "Supabase accepted the login but the server could not read the new session. Restart the dev server and try again.",
  "not-approved": "This account is not listed as an approved admin.",
  "missing-env": "Supabase environment variables are not configured.",
  "missing-service-role": "Supabase service role key is missing on the server. Add it to local/Vercel environment variables.",
};

export default async function AdminLoginPage({ searchParams }: LoginProps) {
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-[#06162c] px-4 py-10">
      <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <Image
          src="/brand/logo-light.png"
          alt="CarRentalSky"
          width={260}
          height={86}
          priority
          className="h-12 w-auto object-contain"
        />
        <h1 className="mt-8 text-2xl font-black text-slate-950">Admin login</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with a Supabase Auth account that is approved in the admin users table.
        </p>
        {error && (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {errors[error] ?? "Unable to sign in."}
          </div>
        )}
        <form action={signInAdmin} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-slate-800">
            Email
            <input
              name="email"
              type="email"
              required
              className="min-h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-[#1463ff] focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-800">
            Password
            <input
              name="password"
              type="password"
              required
              className="min-h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-[#1463ff] focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <button className="mt-2 h-11 rounded-md bg-[#1463ff] text-sm font-black text-white hover:bg-[#0d4fd5]">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
