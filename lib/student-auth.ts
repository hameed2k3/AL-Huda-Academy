import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const STUDENT_SESSION_COOKIE = "al_huda_student_session";

export type StudentSession = {
  userId: string;
  studentId: string;
  email: string;
  fullName: string;
  expiresAt: number;
};

function getStudentSecret() {
  const secret = process.env.STUDENT_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || "al-huda-academy-student-secret-2026";
  return secret;
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function encodeStudentSession(session: StudentSession) {
  const secret = getStudentSecret();
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = signPayload(payload, secret);
  return `${payload}.${signature}`;
}

export function decodeStudentSession(token: string): StudentSession | null {
  const secret = getStudentSecret();
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload, secret);
  const isValidSignature = timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );

  if (!isValidSignature) {
    return null;
  }

  const parsed = JSON.parse(
    Buffer.from(payload, "base64url").toString("utf8"),
  ) as StudentSession;

  if (!parsed.expiresAt || parsed.expiresAt < Date.now()) {
    return null;
  }

  return parsed;
}

export function getStudentCookieName() {
  return STUDENT_SESSION_COOKIE;
}

export function createStudentSessionToken(data: {
  userId: string;
  studentId: string;
  email: string;
  fullName: string;
}) {
  return encodeStudentSession({
    ...data,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 14, // 14 days
  });
}

export async function getStudentSession(): Promise<StudentSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(STUDENT_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    return decodeStudentSession(token);
  } catch {
    return null;
  }
}

export async function requireStudentSession(): Promise<StudentSession> {
  const session = await getStudentSession();

  if (!session) {
    redirect("/student/login");
  }

  return session;
}
