import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getStudentAssignedDuas,
  getStudentAssignedDhikrs,
  setStudentDuaAssignments,
  setStudentDhikrAssignments,
} from "@/lib/ibadah-repository";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const [assignedDuas, assignedDhikrs] = await Promise.all([
      getStudentAssignedDuas(id),
      getStudentAssignedDhikrs(id),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        duaIds: assignedDuas.map((d) => d.id),
        dhikrIds: assignedDhikrs.map((d) => d.id),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to load assignments." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as { duaIds?: string[]; dhikrIds?: string[] };

    if (body.duaIds !== undefined) {
      await setStudentDuaAssignments(id, body.duaIds);
    }
    if (body.dhikrIds !== undefined) {
      await setStudentDhikrAssignments(id, body.dhikrIds);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to update assignments." },
      { status: 500 },
    );
  }
}
