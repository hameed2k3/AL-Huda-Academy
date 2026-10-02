import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIbadahCollections, ensureIbadahSeedData } from "@/lib/ibadah-repository";
import { verifyPassword } from "@/lib/auth-crypto";
import { createStudentSessionToken, getStudentCookieName } from "@/lib/student-auth";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  await ensureIbadahSeedData();
  const { users, students } = await getIbadahCollections();

  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Please provide both email and password." },
        { status: 400 },
      );
    }

    let user = await users.findOne({ email, role: "student" });
    if (!user) {
      // If user doc not yet initialized, check if student exists in students collection
      const studentDoc = await students.findOne({ 
        $or: [{ email }, { email: email.toLowerCase() }] 
      });
      
      if (studentDoc) {
        const { hashPassword } = await import("@/lib/auth-crypto");
        const defaultHash = hashPassword("student123");
        const newUserDoc = {
          email,
          passwordHash: defaultHash,
          role: "student" as const,
          studentId: studentDoc._id.toString(),
          status: "active" as const,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        const insertRes = await users.insertOne(newUserDoc);
        user = { ...newUserDoc, _id: insertRes.insertedId };
      }
    }

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Invalid student credentials or account not found." },
        { status: 401 },
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: "Invalid student credentials." },
        { status: 401 },
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { ok: false, message: "Student account is suspended or inactive." },
        { status: 403 },
      );
    }

    // Get Student Profile
    const student = await students.findOne({ _id: new ObjectId(user.studentId || "") });
    const fullName = student ? (student as any).fullName : "Student";
    const studentId = student ? student._id.toString() : user.studentId || user._id!.toString();

    const token = createStudentSessionToken({
      userId: user._id!.toString(),
      studentId,
      email: user.email,
      fullName,
    });

    const cookieStore = await cookies();
    cookieStore.set(getStudentCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: "/",
    });

    return NextResponse.json({
      ok: true,
      data: {
        studentId,
        email: user.email,
        fullName,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Authentication error." },
      { status: 500 },
    );
  }
}
