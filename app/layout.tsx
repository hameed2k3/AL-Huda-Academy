import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Inter,
  Noto_Naskh_Arabic,
} from "next/font/google";
import { SiteIntroLoader } from "@/components/site-intro-loader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://al-huda-quran-academy.vercel.app"),
  title: {
    default: "AL-HUDA QURAN ACADEMY",
    template: "%s | AL-HUDA QURAN ACADEMY",
  },
  description:
    "A premium Islamic educational web application for AL-HUDA QURAN ACADEMY with courses, contact, certificate verification, and an admin dashboard preview.",
  applicationName: "AL-HUDA QURAN ACADEMY",
  keywords: [
    "Quran academy",
    "Islamic education",
    "certificate verification",
    "online Quran classes",
    "AL-HUDA QURAN ACADEMY",
  ],
  openGraph: {
    title: "AL-HUDA QURAN ACADEMY",
    description:
      "Premium Quran education, academy information, and secure certificate verification.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AL-HUDA QURAN ACADEMY",
    description:
      "Premium Quran education, academy information, and secure certificate verification.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${notoNaskhArabic.variable} h-full scroll-smooth antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SiteIntroLoader />
        {children}
      </body>
    </html>
  );
}
