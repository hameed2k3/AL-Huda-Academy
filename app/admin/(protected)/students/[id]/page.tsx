import { notFound } from "next/navigation";
import { getStudentDetailForAdmin } from "@/lib/admin-student-details";
import { AdminStudentDetailClient } from "@/components/admin-student-detail-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Student Details & Ibadah Tracker | Al-Huda Admin",
};

export default async function AdminStudentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const detail = await getStudentDetailForAdmin(id);

  if (!detail) {
    notFound();
  }

  return <AdminStudentDetailClient data={detail} />;
}
