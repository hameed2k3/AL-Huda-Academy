import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getAdminSummary } from "@/lib/admin-repository";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
    }
    const data = await getAdminSummary();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to load summary." },
      { status: 500 },
    );
  }
}
