import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { completeStudentCourse } from "@/lib/admin-repository";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
    }
    const { id } = await context.params;
    const data = await completeStudentCourse(id);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to complete course." },
      { status: 500 },
    );
  }
}
