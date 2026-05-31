import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { verifyFamilyPassword } from "@/lib/family-auth";
import { ensureFamilyCredentials, FAMILY_CREDENTIAL_TABLE, updateFamilyPassword } from "@/lib/family";
import { createSupabaseAdmin } from "@/lib/supabase";
import type { FamilyRole } from "@/lib/family-shared";

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as {
    wife?: string;
    children?: string;
    grandchildren?: string;
  };

  const updates: { role: FamilyRole; password: string }[] = [];

  if (body.wife?.trim()) updates.push({ role: "wife", password: body.wife.trim() });
  if (body.children?.trim()) updates.push({ role: "children", password: body.children.trim() });
  if (body.grandchildren?.trim()) {
    updates.push({ role: "grandchildren", password: body.grandchildren.trim() });
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "En az bir yeni şifre gir." }, { status: 400 });
  }

  for (const item of updates) {
    if (item.password.length < 4) {
      return NextResponse.json({ error: "Şifreler en az 4 karakter olmalı." }, { status: 400 });
    }
  }

  const passwords = updates.map((item) => item.password);
  if (new Set(passwords).size !== passwords.length) {
    return NextResponse.json(
      { error: "Her grubun şifresi birbirinden farklı olmalı." },
      { status: 400 },
    );
  }

  await ensureFamilyCredentials();
  const supabase = createSupabaseAdmin();
  const { data: existingRows, error } = await supabase
    .from(FAMILY_CREDENTIAL_TABLE)
    .select("role, passwordHash");
  if (error) {
    return NextResponse.json({ error: "Şifreler okunamadı." }, { status: 500 });
  }

  for (const item of updates) {
    for (const row of existingRows ?? []) {
      if (row.role === item.role) continue;
      const matchesOther = await verifyFamilyPassword(item.password, row.passwordHash);
      if (matchesOther) {
        return NextResponse.json(
          { error: "Her grubun şifresi birbirinden farklı olmalı." },
          { status: 400 },
        );
      }
    }
  }

  for (const item of updates) {
    await updateFamilyPassword(item.role, item.password);
  }

  return NextResponse.json({ ok: true });
}
