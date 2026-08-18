import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "al_huda_admin_session";

type AdminSession = {
  email: string;
  expiresAt: number;
};

function getAdminConfig() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!email || !password || !sessionSecret) {
    throw new Error(
      "Missing admin auth environment variables. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.",
    );
  }

  return { email, password, sessionSecret };
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeSession(session: AdminSession) {
  const { sessionSecret } = getAdminConfig();
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = signPayload(payload, sessionSecret);
  return `${payload}.${signature}`;
}

function decodeSession(token: string): AdminSession | null {
  const { sessionSecret } = getAdminConfig();
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

export function validateAdminCredentials(email: string, password: string) {
  const config = getAdminConfig();
  return email === config.email && password === config.password;
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
