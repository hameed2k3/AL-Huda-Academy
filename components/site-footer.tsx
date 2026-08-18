import Link from "next/link";
import { academy } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface-muted">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <h2 className="font-display text-3xl font-semibold text-primary">
            {academy.name}
          </h2>
          <p className="max-w-xl text-sm leading-7 text-muted">
            Premium Quran education with a calm digital experience, elegant
            academic presentation, and secure certificate verification.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Explore
          </h3>
          <div className="space-y-2 text-sm text-muted">
            <Link href="/about" className="block transition hover:text-primary">
              About
            </Link>
            <Link href="/courses" className="block transition hover:text-primary">
              Courses
            </Link>
            <Link href="/verify" className="block transition hover:text-primary">
              Certificate verification
            </Link>
            <Link href="/contact" className="block transition hover:text-primary">
              Contact
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Legal
          </h3>
          <div className="space-y-2 text-sm text-muted">
            <Link href="/privacy" className="block transition hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="block transition hover:text-primary">
              Terms & Conditions
            </Link>
            <Link href="/admin/dashboard" className="block transition hover:text-primary">
              Admin preview
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
