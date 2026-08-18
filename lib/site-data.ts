export type Course = {
  slug: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  outcomes: string[];
  certificateAvailable: boolean;
};

export type CertificateRecord = {
  certificateNumber: string;
  studentName: string;
  course: string;
  issueDate: string;
  completionDate: string;
  instructor: string;
  grade: string;
};

export const academy = {
  name: "AL-HUDA QURAN ACADEMY",
  shortName: "AL-HUDA",
  websiteUrl: "https://alhuda.vercel.app",
  verificationHost: "alhuda.vercel.app",
  tagline: "Sacred minimalism in Quran education",
  heroTitle: "A premium digital academy for Quran learning, growth, and trust.",
  heroText:
    "AL-HUDA QURAN ACADEMY combines structured Islamic learning, elegant digital design, and secure certificate verification in one calm, professional experience.",
  whatsappUrl: "https://wa.me/919876543210",
  contact: {
    address: ["123 Knowledge Street", "Chennai", "Tamil Nadu", "India"],
    phone: "+91 9876543210",
    email: "contact@alhudaacademy.com",
    workingHours: "Monday-Saturday, 9AM-7PM",
  },
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/verify", label: "Verify" },
  { href: "/contact", label: "Contact" },
];

export const courseCatalog: Course[] = [
  {
    slug: "qaida-noorania",
    title: "Qaida Noorania",
    duration: "3 months",
    level: "Beginner",
    description:
      "Build strong Arabic letter recognition, makharij, and first-stage Tajweed habits with clear guided instruction.",
    outcomes: ["Arabic letter precision", "Sound articulation", "Foundational reading confidence"],
    certificateAvailable: true,
  },
  {
    slug: "quran-reading",
    title: "Quran Reading",
    duration: "4 months",
    level: "Intermediate",
    description:
      "Develop fluent, accurate Quran recitation with step-by-step Tajweed correction and live instructor feedback.",
    outcomes: ["Fluent reading", "Applied Tajweed", "Improved recitation rhythm"],
    certificateAvailable: true,
  },
  {
    slug: "surah-memorization",
    title: "Surah Memorization",
    duration: "Flexible plan",
    level: "Advanced",
    description:
      "Follow a steady memorization pathway with revision discipline, retention tracking, and spiritual encouragement.",
    outcomes: ["Structured memorization", "Revision planning", "Long-term retention"],
    certificateAvailable: true,
  },
  {
    slug: "dua-and-asma-ul-husna",
    title: "Dua & Asma-ul-Husna",
    duration: "2 months",
    level: "All levels",
    description:
      "Learn daily supplications and the beautiful names of Allah with meaning, reflection, and memorization support.",
    outcomes: ["Daily duas", "Name meanings", "Practical spiritual learning"],
    certificateAvailable: true,
  },
];

export const academyValues = [
  {
    title: "Trustworthy Learning",
    description:
      "A polished academic presence that gives students and families confidence in the learning journey.",
  },
  {
    title: "Calm Digital Experience",
    description:
      "Soft typography, refined spacing, and focused layouts help the academy feel peaceful rather than overwhelming.",
  },
  {
    title: "Verified Outcomes",
    description:
      "Each eligible course can be paired with a searchable certificate record and downloadable completion document.",
  },
];

export const whyChooseUs = [
  "Female-friendly, family-conscious academic environment",
  "Structured Quran pathways from beginner to memorization",
  "Elegant certificate design with verification records",
  "Clear contact access and guided enrollment support",
];

export const certificates: CertificateRecord[] = [
  {
    certificateNumber: "AHQA-2026-0001",
    studentName: "Amina Rahman",
    course: "Qaida Noorania",
    issueDate: "2026-04-10",
    completionDate: "2026-04-08",
    instructor: "Ustadha Maryam Siddiqui",
    grade: "Excellent",
  },
  {
    certificateNumber: "AHQA-2026-0002",
    studentName: "Yusuf Kareem",
    course: "Quran Reading",
    issueDate: "2026-05-21",
    completionDate: "2026-05-18",
    instructor: "Qari Abdul Basit",
    grade: "Distinction",
  },
  {
    certificateNumber: "AHQA-2026-0003",
    studentName: "Safiya Ahmed",
    course: "Surah Memorization",
    issueDate: "2026-06-12",
    completionDate: "2026-06-09",
    instructor: "Ustadha Hiba Noor",
    grade: "Mumtaz",
  },
];

export const adminStats = [
  { label: "Total students", value: "1,284", note: "+12% this quarter" },
  { label: "Issued certificates", value: "856", note: "Across all eligible courses" },
  { label: "Active courses", value: "4", note: "Core public offerings" },
  { label: "Pending reviews", value: "18", note: "Awaiting certificate approval" },
];

export const studentRows = [
  { name: "Amina Rahman", course: "Qaida Noorania", status: "Completed" },
  { name: "Yusuf Kareem", course: "Quran Reading", status: "Active" },
  { name: "Safiya Ahmed", course: "Surah Memorization", status: "Completed" },
  { name: "Maryam Ali", course: "Dua & Asma-ul-Husna", status: "New enrollment" },
];
