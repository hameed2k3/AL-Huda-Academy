import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  deleteStudent,
  reopenStudentCourse,
  updateStudent,
} from "@/lib/admin-repository";

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
    const data = await updateStudent(id, body);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to update student." },
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
    await deleteStudent(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to delete student." },
      { status: 500 },
    );
  }
}

export async function PUT(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
    }
    const { id } = await context.params;
    await reopenStudentCourse(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to reopen student." },
      { status: 500 },
    );
  }
}
