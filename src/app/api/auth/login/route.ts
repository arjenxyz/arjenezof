import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };
    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ error: "Geçersiz şifre." }, { status: 401 });
    }

    await createSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Sunucu yapılandırması eksik. ADMIN_PASSWORD ve ADMIN_SECRET tanımlayın." },
      { status: 500 },
    );
  }
}
