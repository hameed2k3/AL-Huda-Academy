import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieName,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") || "/admin/dashboard";

  const isValid = await validateAdminCredentials(email, password);
  if (!isValid) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=invalid&next=${encodeURIComponent(next)}`,
    );
  }

  const response = NextResponse.redirect(`${origin}${next}`);
  response.cookies.set({
    name: getAdminCookieName(),
    value: createAdminSessionToken(email),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
