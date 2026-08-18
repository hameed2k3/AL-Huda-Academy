import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://al-huda-quran-academy.vercel.app";

  return [
    "",
    "/about",
    "/courses",
    "/verify",
    "/contact",
    "/privacy",
    "/terms",
    "/admin/dashboard",
    "/admin/students",
    "/admin/certificates",
    "/admin/settings",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-07-17"),
  }));
}
