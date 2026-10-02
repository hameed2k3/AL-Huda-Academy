import Link from "next/link";

export default function GeneralLoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full panel-shadow rounded-[2.5rem] border border-border bg-surface p-8 sm:p-10 text-center">
        <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Portal Gateway
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-primary">
          Sign In to Al-Huda
        </h1>
        <p className="mt-2 text-sm text-muted">
          Select your portal destination below:
        </p>

        <div className="mt-8 space-y-4">
          <Link
            href="/student/login"
            className="flex items-center justify-between w-full rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 text-left transition hover:border-primary hover:bg-primary/10 group"
          >
            <div>
              <p className="font-display font-semibold text-primary text-lg">
                Student Portal 🌿
              </p>
              <p className="text-xs text-muted mt-1">
                Track 5 daily prayers, learn Duas & Dhikr, view your certificates.
              </p>
            </div>
            <span className="text-primary font-bold transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            href="/admin/login"
            className="flex items-center justify-between w-full rounded-2xl border border-border bg-surface-muted/60 p-5 text-left transition hover:border-border hover:bg-surface-muted group"
          >
            <div>
              <p className="font-display font-semibold text-foreground text-lg">
                Administrator Portal 🛡️
              </p>
              <p className="text-xs text-muted mt-1">
                Manage students, Duas, Dhikr, course rosters, and certificate generation.
              </p>
            </div>
            <span className="text-foreground font-bold transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <Link
            href="/"
            className="text-xs font-medium text-muted hover:text-primary transition"
          >
            ← Return to Academy Home
          </Link>
        </div>
      </div>
    </div>
  );
}
