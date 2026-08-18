import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <div className="container-shell py-20">
      <div className="panel-shadow max-w-4xl rounded-[2rem] border border-border bg-surface p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Legal
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-primary">
          Terms & Conditions
        </h1>
        <p className="mt-5 text-base leading-8 text-muted">
          This application presents academy information, verification records,
          and dashboard previews for AL-HUDA QURAN ACADEMY. In a production
          deployment, enrollment, certificate issuance, and administrative access
          would be governed by formal academy policies and authenticated staff roles.
        </p>
      </div>
    </div>
  );
}
