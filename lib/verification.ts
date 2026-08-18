import { certificates } from "@/lib/site-data";

export function normalizeCertificateNumber(value: string) {
  return value.trim().toUpperCase();
}

export function getCertificateRecord(certificateNumber?: string | null) {
  if (!certificateNumber) {
    return null;
  }

  const normalized = normalizeCertificateNumber(certificateNumber);

  return (
    certificates.find(
      (certificate) => certificate.certificateNumber === normalized,
    ) ?? null
  );
}
