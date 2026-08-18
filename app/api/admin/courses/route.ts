import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createCourse, listCourses, resetSeedData } from "@/lib/admin-repository";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
    }
    const data = await listCourses();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to load courses." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
    }
    const body = await request.json();
    const data = await createCourse(body);
    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to create course." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
    }
    await resetSeedData();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to reset data." },
      { status: 500 },
    );
  }
}
