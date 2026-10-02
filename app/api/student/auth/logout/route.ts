import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStudentCookieName } from "@/lib/student-auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete(getStudentCookieName());

  const url = new URL("/student/login", request.url);
  return NextResponse.redirect(url, { status: 303 });
}
