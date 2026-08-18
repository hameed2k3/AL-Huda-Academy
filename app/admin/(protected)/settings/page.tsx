import { academy } from "@/lib/site-data";

export default function AdminSettingsPage() {
  return (
    <section className="panel-shadow rounded-[2rem] border border-border bg-surface p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
        Settings preview
      </p>
      <h2 className="mt-3 font-display text-4xl font-semibold text-primary">
        Academy configuration snapshot
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <SettingCard label="Brand name" value={academy.name} />
        <SettingCard label="Primary email" value={academy.contact.email} />
        <SettingCard label="Phone" value={academy.contact.phone} />
        <SettingCard label="Working hours" value={academy.contact.workingHours} />
      </div>
    </section>
  );
}

function SettingCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-background p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-foreground">{value}</p>
    </div>
  );
}
