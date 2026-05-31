import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { FamilyRole } from "@/lib/family-shared";

const COOKIE_NAME = "family_session";
const SESSION_DURATION = 60 * 60 * 24 * 30; // 30 gün

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET ortam değişkeni tanımlı değil.");
  }
  return new TextEncoder().encode(secret);
}

export async function hashFamilyPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyFamilyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createFamilySession(role: FamilyRole) {
  const token = await new SignJWT({ role: "family", familyRole: role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function destroyFamilySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getFamilySessionRole(): Promise<FamilyRole | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "family") return null;
    const familyRole = payload.familyRole;
    if (familyRole === "wife" || familyRole === "children" || familyRole === "grandchildren") {
      return familyRole;
    }
    return null;
  } catch {
    return null;
  }
}
