import { NextResponse } from "next/server";
import { getAdminCookieName } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/admin/login`);
  response.cookies.set({
    name: getAdminCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
