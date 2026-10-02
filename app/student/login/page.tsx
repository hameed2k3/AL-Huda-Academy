import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/student-auth";
import { StudentLoginForm } from "@/components/student-login-form";

export const metadata = {
  title: "Student Login | Al-Huda Quran Academy",
};

export default async function StudentLoginPage() {
  const session = await getStudentSession();
  if (session) {
    redirect("/student/dashboard");
  }

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <StudentLoginForm />
    </div>
  );
}
