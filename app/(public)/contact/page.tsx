import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { academy } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="container-shell py-20">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Contact the academy"
            title="A proper contact page with direct access to the academy team."
            description="The public contact experience includes clear academy details and an inquiry form endpoint for future backend integration."
          />
          <div className="panel-shadow rounded-[2rem] border border-border bg-surface p-8">
            <InfoBlock
              label="Address"
              value={academy.contact.address.join(", ")}
            />
            <InfoBlock label="Phone" value={academy.contact.phone} />
            <InfoBlock label="Email" value={academy.contact.email} />
            <InfoBlock
              label="Working hours"
              value={academy.contact.workingHours}
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
        {label}
      </p>
      <p className="mt-2 text-base leading-7 text-foreground">{value}</p>
    </div>
  );
}
