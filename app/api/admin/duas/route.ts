import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { listAllDuas, createDua } from "@/lib/ibadah-repository";
import type { CreateDuaInput } from "@/lib/ibadah-types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const data = await listAllDuas();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to load Duas." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreateDuaInput;
    if (!body.title || !body.arabicText) {
      return NextResponse.json(
        { ok: false, message: "Title and Arabic text are required." },
        { status: 400 },
      );
    }
    const data = await createDua(body);
    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to create Dua." },
      { status: 500 },
    );
  }
}
