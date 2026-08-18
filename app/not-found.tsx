import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
        404
      </p>
      <h1 className="mt-4 font-display text-6xl font-semibold text-primary">
        Page not found
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
        The page you requested is not available in the academy application.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-primary-strong"
      >
        Return home
      </Link>
    </div>
  );
}
