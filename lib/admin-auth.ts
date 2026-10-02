import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "al_huda_admin_session";

type AdminSession = {
  email: string;
  expiresAt: number;
};

function getAdminSecret() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || "al-huda-admin-session-secret-2026-secure";
  return sessionSecret;
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeSession(session: AdminSession) {
  const sessionSecret = getAdminSecret();
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = signPayload(payload, sessionSecret);
  return `${payload}.${signature}`;
}

function decodeSession(token: string): AdminSession | null {
  const sessionSecret = getAdminSecret();
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload, sessionSecret);
  const isValidSignature = timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );

  if (!isValidSignature) {
    return null;
  }

  const parsed = JSON.parse(
    Buffer.from(payload, "base64url").toString("utf8"),
  ) as AdminSession;

  if (!parsed.expiresAt || parsed.expiresAt < Date.now()) {
    return null;
  }

  return parsed;
}

export function getAdminCookieName() {
  return ADMIN_SESSION_COOKIE;
}

export async function validateAdminCredentials(email: string, password: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { getIbadahCollections, ensureIbadahSeedData } = await import("@/lib/ibadah-repository");
    const { verifyPassword } = await import("@/lib/auth-crypto");
    await ensureIbadahSeedData();
    const { users } = await getIbadahCollections();

    const user = await users.findOne({ email: normalizedEmail, role: "admin", status: "active" });
    if (user && user.passwordHash) {
      return verifyPassword(password, user.passwordHash);
    }
  } catch (error) {
    console.error("Database admin auth validation error:", error);
  }

  return false;
}

export function createAdminSessionToken(email: string) {
  return encodeSession({
    email,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  });
}

export function readAdminSessionFromToken(token?: string | null) {
  if (!token) {
    return null;
  }

  try {
    return decodeSession(token);
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return readAdminSessionFromToken(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
