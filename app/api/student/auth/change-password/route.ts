import { NextResponse } from "next/server";
import { getStudentSession } from "@/lib/student-auth";
import { getIbadahCollections } from "@/lib/ibadah-repository";
import { verifyPassword, hashPassword } from "@/lib/auth-crypto";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const session = await getStudentSession();
    if (!session) {
      return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    const currentPassword = body.currentPassword?.trim();
    const newPassword = body.newPassword?.trim();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { ok: false, message: "Please provide both your current and new password." },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { ok: false, message: "New password must be at least 6 characters long." },
        { status: 400 },
      );
    }

    const { users } = await getIbadahCollections();
    const user = await users.findOne({ _id: new ObjectId(session.userId) });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User account not found." },
        { status: 404 },
      );
    }

    const isValid = verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: "Incorrect current password." },
        { status: 400 },
      );
    }

    const newHash = hashPassword(newPassword);
    await users.updateOne(
      { _id: user._id },
      { $set: { passwordHash: newHash } },
    );

    return NextResponse.json({
      ok: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to change password." },
      { status: 500 },
    );
  }
}
