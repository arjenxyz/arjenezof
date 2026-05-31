import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createFamilyMessage } from "@/lib/family";
import type { FamilyAudience } from "@/lib/family-shared";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    content?: string;
    audience?: FamilyAudience;
    sortOrder?: number;
    published?: boolean;
  };

  if (!body.title?.trim() || !body.content?.trim() || !body.audience) {
    return NextResponse.json({ error: "Başlık, metin ve hedef kitle zorunludur." }, { status: 400 });
  }

  if (!["wife", "children", "grandchildren"].includes(body.audience)) {
    return NextResponse.json({ error: "Geçersiz hedef kitle." }, { status: 400 });
  }

  const message = await createFamilyMessage({
    title: body.title.trim(),
    content: body.content.trim(),
    audience: body.audience,
    sortOrder: body.sortOrder ?? 0,
    published: body.published ?? true,
  });

  return NextResponse.json(message, { status: 201 });
}
