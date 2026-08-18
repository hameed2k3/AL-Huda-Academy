"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

type VerifyCertificateFormProps = {
  defaultValue?: string;
};

export function VerifyCertificateForm({
  defaultValue = "",
}: VerifyCertificateFormProps) {
  const router = useRouter();
  const [certificateNumber, setCertificateNumber] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = certificateNumber.trim().toUpperCase();

    startTransition(() => {
      if (!normalized) {
        router.push("/verify");
        return;
      }

      router.push(`/verify?certificate=${encodeURIComponent(normalized)}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel-shadow rounded-[2rem] border border-border bg-surface p-3"
    >
      <div className="flex flex-col gap-3 lg:flex-row">
        <label className="flex min-h-16 flex-1 items-center rounded-[1.35rem] border border-transparent bg-background px-5 focus-within:border-primary/25">
          <span className="sr-only">Certificate number</span>
          <input
            value={certificateNumber}
            onChange={(event) => setCertificateNumber(event.target.value)}
            placeholder="Enter certificate ID, for example AHQA-2026-0001"
            className="w-full bg-transparent text-sm uppercase tracking-[0.12em] text-foreground outline-none placeholder:text-muted"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-16 items-center justify-center rounded-[1.35rem] bg-primary px-7 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-primary-strong disabled:opacity-70"
        >
          {isPending ? "Checking" : "Verify now"}
        </button>
        <a
          href="/verify?certificate=AHQA-2026-0001"
          className="inline-flex min-h-16 items-center justify-center rounded-[1.35rem] border border-border bg-surface-muted px-6 text-sm font-medium text-primary transition hover:bg-primary/5"
        >
          Sample verify link
        </a>
      </div>
    </form>
  );
}
