import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteFamilyMessage, getFamilyMessageById, updateFamilyMessage } from "@/lib/family";
import type { FamilyAudience } from "@/lib/family-shared";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getFamilyMessageById(id);
  if (!existing) {
    return NextResponse.json({ error: "Metin bulunamadı." }, { status: 404 });
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

  const message = await updateFamilyMessage(id, {
    title: body.title.trim(),
    content: body.content.trim(),
    audience: body.audience,
    sortOrder: body.sortOrder ?? 0,
    published: body.published ?? true,
  });

  return NextResponse.json(message);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getFamilyMessageById(id);
  if (!existing) {
    return NextResponse.json({ error: "Metin bulunamadı." }, { status: 404 });
  }

  await deleteFamilyMessage(id);
  return NextResponse.json({ ok: true });
}
