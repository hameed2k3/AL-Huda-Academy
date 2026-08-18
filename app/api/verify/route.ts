import { NextResponse } from "next/server";
import { findCertificateByNumber } from "@/lib/admin-repository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateNumber = searchParams.get("certificate");

    if (!certificateNumber) {
      return NextResponse.json(
        {
          ok: false,
          message: "Certificate number is required.",
        },
        { status: 400 },
      );
    }

    const result = await findCertificateByNumber(certificateNumber);

    if (!result) {
      return NextResponse.json(
        {
          ok: false,
          message: "Certificate not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Verification failed.",
      },
      { status: 500 },
    );
  }
}
