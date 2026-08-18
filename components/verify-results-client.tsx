"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CertificateDownloadButton } from "@/components/certificate-download-button";
import type { AdminCertificate } from "@/lib/admin-types";

export function VerifyResultsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("certificate")?.trim().toUpperCase() ?? "";
  const [result, setResult] = useState<AdminCertificate | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      return;
    }

    let active = true;

    async function loadResult() {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/verify?certificate=${encodeURIComponent(query)}`,
          { cache: "no-store" },
        );
        const payload = (await response.json()) as {
          ok: boolean;
          data?: AdminCertificate;
        };

        if (!active) {
          return;
        }

        setResult(response.ok && payload.ok ? (payload.data ?? null) : null);
      } catch {
        if (active) {
          setResult(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadResult();

    return () => {
      active = false;
    };
  }, [query]);

  if (!query) {
    return (
      <div className="panel-shadow mx-auto max-w-4xl rounded-[2rem] border border-border bg-surface p-10 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">
          Ready to verify
        </p>
        <h2 className="mt-4 font-display text-4xl font-semibold text-primary">
          Enter a certificate ID or scan the QR from the printed certificate.
        </h2>
        <p className="mt-4 text-base leading-8 text-muted">
          Try <span className="font-semibold text-foreground">AHQA-2026-0001</span> or open a
          live verification link from <span className="font-semibold text-foreground">alhuda.vercel.app</span>.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="panel-shadow mx-auto max-w-4xl rounded-[2rem] border border-border bg-surface p-10 text-center text-muted">
        Loading verification data...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="panel-shadow mx-auto max-w-4xl rounded-[2rem] border border-rose-200 bg-surface p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700">
          No record found
        </p>
        <h2 className="mt-4 font-display text-4xl font-semibold text-primary">
          We could not verify that certificate ID.
        </h2>
        <p className="mt-4 text-base leading-8 text-muted">
          Please confirm the certificate number from the PDF or QR scan and try again, or contact the academy.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-surface card-shadow">
      <div className="h-2 bg-accent" />
      <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-success">
            Verified authenticity
          </span>
          <h2 className="mt-5 font-display text-5xl font-semibold text-primary">
            {result.studentName}
          </h2>
          <p className="mt-3 text-lg text-muted">{result.courseTitle}</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            This record confirms that the student completed the academy course and the certificate
            was issued by AL-HUDA QURAN ACADEMY. QR scans from the official PDF redirect here for
            verification.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Detail label="Certificate number" value={result.certificateNumber} />
            <Detail label="Issue date" value={result.issueDate} />
            <Detail label="Completion date" value={result.completionDate} />
            <Detail label="Instructor" value={result.instructorName} />
            <Detail label="Grade" value={result.grade} />
            <Detail label="Verification website" value="alhuda.vercel.app" />
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-border bg-background p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Actions
          </p>
          <h3 className="mt-3 font-display text-3xl font-semibold text-primary">
            Download the academy-issued e-certificate.
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted">
            The PDF includes the branded layout, certificate ID, and a QR code that opens this
            verification page directly.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <CertificateDownloadButton
              certificate={result}
              label="Download verified PDF"
              className="inline-flex justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-primary-strong"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-border bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
