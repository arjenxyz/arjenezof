import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "admin_session";
const FAMILY_COOKIE = "family_session";

function getSecret() {
  return process.env.ADMIN_SECRET;
}

async function verifyAdminSession(token: string, secret: string) {
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

async function getFamilyRole(token: string, secret: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = getSecret();

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!token || !secret || !(await verifyAdminSession(token, secret))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  const needsFamilyAuth =
    pathname === "/aile/oku" ||
    pathname.startsWith("/aile/oku/") ||
    pathname === "/aile/metinler" ||
    pathname.startsWith("/aile/metin/") ||
    pathname.startsWith("/aile/yaz");

  if (needsFamilyAuth) {
    const token = request.cookies.get(FAMILY_COOKIE)?.value;
    if (!token || !secret) {
      return NextResponse.redirect(new URL("/aile", request.url));
    }

    const familyRole = await getFamilyRole(token, secret);
    if (!familyRole) {
      return NextResponse.redirect(new URL("/aile", request.url));
    }

    if (pathname.startsWith("/aile/yaz") && familyRole !== "wife") {
      return NextResponse.redirect(new URL("/aile/oku", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/aile/oku",
    "/aile/oku/:path*",
    "/aile/metinler",
    "/aile/metin/:path*",
    "/aile/yaz/:path*",
  ],
};
