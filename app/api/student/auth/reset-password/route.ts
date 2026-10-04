import { NextResponse } from "next/server";
import { getIbadahCollections } from "@/lib/ibadah-repository";
import { hashPassword } from "@/lib/auth-crypto";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      verificationCodeOrPhone?: string;
      newPassword?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const verification = body.verificationCodeOrPhone?.trim();
    const newPassword = body.newPassword?.trim();

    if (!email || !verification || !newPassword) {
      return NextResponse.json(
        { ok: false, message: "Please provide email, registered phone/guardian name, and new password." },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { ok: false, message: "New password must be at least 6 characters long." },
        { status: 400 },
      );
    }

    const { students, users } = await getIbadahCollections();

    // Verify student exists in students collection
    const student = await students.findOne({
      $or: [{ email }, { email: email.toLowerCase() }],
    });

    if (!student) {
      return NextResponse.json(
        { ok: false, message: "No student account found with this email." },
        { status: 404 },
      );
    }

    // Verify phone or guardian name matches for security
    const cleanVerification = verification.replace(/\D/g, "");
    const cleanStudentPhone = (student.phone || "").replace(/\D/g, "");
    
    const phoneMatches =
      cleanVerification.length >= 4 && cleanStudentPhone.includes(cleanVerification);
    const guardianMatches =
      student.guardianName &&
      student.guardianName.toLowerCase().trim() === verification.toLowerCase();

    if (!phoneMatches && !guardianMatches) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Verification failed. The phone number or guardian name does not match the registered record.",
        },
        { status: 400 },
      );
    }

    const passwordHash = hashPassword(newPassword);

    // Update or insert into users collection
    const existingUser = await users.findOne({
      $or: [{ studentId: student._id.toString() }, { email }],
    });

    if (existingUser) {
      await users.updateOne(
        { _id: existingUser._id },
        { $set: { passwordHash, email, status: "active" } },
      );
    } else {
      await users.insertOne({
        email,
        passwordHash,
        role: "student",
        studentId: student._id.toString(),
        status: "active",
        createdAt: new Date().toISOString().slice(0, 10),
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Password reset successfully! You can now log in with your new credentials.",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Password reset failed." },
      { status: 500 },
    );
  }
}
