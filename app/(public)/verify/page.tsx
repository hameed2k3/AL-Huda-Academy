import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/section-heading";
import { VerifyCertificateForm } from "@/components/verify-certificate-form";
import { VerifyResultsClient } from "@/components/verify-results-client";

export const metadata: Metadata = {
  title: "Certificate Verification",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ certificate?: string }>;
}) {
  const { certificate } = await searchParams;
  return (
    <div className="container-shell py-20">
      <SectionHeading
        eyebrow="Certificate verification"
        title="Search academy-issued certificates with a clear and trustworthy verification flow."
        description="Enter a certificate ID or use the QR deep link from the issued PDF to confirm the completion record on alhuda.vercel.app."
        center
      />

      <div className="mx-auto mt-10 max-w-5xl">
        <VerifyCertificateForm defaultValue={certificate ?? ""} />
      </div>

      <div className="mt-12">
        <Suspense
          fallback={
            <div className="panel-shadow mx-auto max-w-4xl rounded-[2rem] border border-border bg-surface p-10 text-center text-muted">
              Loading verification data...
            </div>
          }
        >
          <VerifyResultsClient />
        </Suspense>
      </div>
    </div>
  );
}
