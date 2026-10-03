import { NextResponse } from "next/server";
import { getStudentSession } from "@/lib/student-auth";
import { getIbadahCollections } from "@/lib/ibadah-repository";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { token, platform } = (await request.json()) as {
      token?: string;
      platform?: "android" | "ios" | "web";
    };

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { ok: false, message: "Valid device push token is required." },
        { status: 400 },
      );
    }

    const { users } = await getIbadahCollections();
    const cleanToken = token.trim();

    // Store token in student user record
    await users.updateOne(
      { _id: new ObjectId(session.userId) },
      {
        $addToSet: {
          pushTokens: {
            token: cleanToken,
            platform: platform || "android",
            updatedAt: new Date().toISOString(),
          },
        },
      },
    );

    return NextResponse.json({
      ok: true,
      message: "Device push token registered successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Failed to register push token.",
      },
      { status: 500 },
    );
  }
}
