import { NextResponse } from "next/server";
import { createFamilySession } from "@/lib/family-auth";
import { resolveFamilyRoleFromPassword } from "@/lib/family";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };

  if (!body.password?.trim()) {
    return NextResponse.json({ error: "Şifre gerekli." }, { status: 400 });
  }

  try {
    const role = await resolveFamilyRoleFromPassword(body.password.trim());
    if (!role) {
      return NextResponse.json({ error: "Şifre tanınmadı." }, { status: 401 });
    }

    await createFamilySession(role);
    return NextResponse.json({ ok: true, role });
  } catch {
    return NextResponse.json({ error: "Giriş sırasında bir sorun oluştu." }, { status: 500 });
  }
}
