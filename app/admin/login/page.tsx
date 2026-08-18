import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;
  const error = params.error === "invalid" ? "Invalid admin email or password." : null;
  const next = params.next ?? "/admin/dashboard";

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="container-shell flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-xl rounded-[2rem] border border-border bg-surface p-10 panel-shadow">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Admin login
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold text-primary">
            Secure academy access
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            This login is only for the academy administrator. There is no student login flow.
          </p>

          <form
            action={`/api/admin/auth/login?next=${encodeURIComponent(next)}`}
            method="post"
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-primary">
                Admin email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-primary">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-primary-strong"
              >
                Login
              </button>
              <Link
                href="/"
                className="rounded-full border border-primary/20 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
              >
                Back to website
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
