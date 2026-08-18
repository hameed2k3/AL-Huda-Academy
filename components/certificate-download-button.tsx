"use client";

import type { AdminCertificate } from "@/lib/admin-types";

export function CertificateDownloadButton({
  certificate,
  className,
  label = "Download PDF",
}: {
  certificate: AdminCertificate;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        const link = document.createElement("a");
        link.href = `/api/certificates/${encodeURIComponent(certificate.certificateNumber)}`;
        link.rel = "noopener";
        link.click();
      }}
      className={className}
    >
      {label}
    </button>
  );
}
