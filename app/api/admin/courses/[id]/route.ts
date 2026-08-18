import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { deleteCourse, updateCourse } from "@/lib/admin-repository";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
    }
    const { id } = await context.params;
    const body = await request.json();
    const data = await updateCourse(id, body);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to update course." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
    }
    const { id } = await context.params;
    await deleteCourse(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to delete course." },
      { status: 500 },
    );
  }
}
