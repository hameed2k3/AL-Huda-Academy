import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This demo application stores no live personal data, but it is structured as if contact messages and verification requests may be processed responsibly in a production deployment."
    />
  );
}

function LegalPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="container-shell py-20">
      <div className="panel-shadow max-w-4xl rounded-[2rem] border border-border bg-surface p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Legal
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-primary">
          {title}
        </h1>
        <p className="mt-5 text-base leading-8 text-muted">{description}</p>
      </div>
    </div>
  );
}
