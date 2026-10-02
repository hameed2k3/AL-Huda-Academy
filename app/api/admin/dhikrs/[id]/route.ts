import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { updateDhikr, deleteDhikr } from "@/lib/ibadah-repository";
import type { UpdateDhikrInput } from "@/lib/ibadah-types";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateDhikrInput;
    const data = await updateDhikr(id, body);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to update Dhikr." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteDhikr(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to delete Dhikr." },
      { status: 500 },
    );
  }
}
