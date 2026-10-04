import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { resetStudentPassword } from "@/lib/admin-repository";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as { password?: string };
    const password = body.password?.trim();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { ok: false, message: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const result = await resetStudentPassword(id, password);
    return NextResponse.json({
      ok: true,
      message: `Password reset successfully for ${result.fullName}.`,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to reset password." },
      { status: 500 },
    );
  }
}
