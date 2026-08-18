import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!payload.name || !payload.email || !payload.message) {
    return NextResponse.json(
      { message: "Please complete all fields before sending your inquiry." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    message:
      "Your inquiry has been received by the demo endpoint. In production, this would forward to academy support or a transactional email service.",
  });
}
