import { NextResponse } from "next/server";
import { deleteFamilyMessage, getFamilyMessageById, updateFamilyMessage } from "@/lib/family";
import {
  actorCanManageMessage,
  getFamilyMessageWriteActor,
} from "@/lib/family-write-access";
import { wifeCanManageAudience, type FamilyAudience } from "@/lib/family-shared";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const actor = await getFamilyMessageWriteActor();
  if (!actor) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getFamilyMessageById(id);
  if (!existing) {
    return NextResponse.json({ error: "Metin bulunamadı." }, { status: 404 });
  }

  if (!actorCanManageMessage(actor, existing)) {
    return NextResponse.json({ error: "Bu metni düzenleme yetkin yok." }, { status: 403 });
  }

  const body = (await request.json()) as {
    title?: string;
    content?: string;
    audience?: FamilyAudience;
    sortOrder?: number;
    published?: boolean;
    mediaUrl?: string;
    mediaType?: string;
  };

  if (!body.title?.trim() || !body.content?.trim() || !body.audience) {
    return NextResponse.json({ error: "Başlık, metin ve hedef kitle zorunludur." }, { status: 400 });
  }

  if (actor.kind === "wife" && !wifeCanManageAudience(body.audience)) {
    return NextResponse.json(
      { error: "Yalnızca çocuklar ve torunlar için yazabilirsin." },
      { status: 403 },
    );
  }

  const message = await updateFamilyMessage(id, {
    title: body.title.trim(),
    content: body.content.trim(),
    audience: body.audience,
    sortOrder: body.sortOrder ?? 0,
    published: body.published ?? true,
    authorRole: existing.authorRole,
    mediaUrl: body.mediaUrl ?? existing.mediaUrl,
    mediaType: (body.mediaType === "image" ||
    body.mediaType === "audio" ||
    body.mediaType === "video"
      ? body.mediaType
      : body.mediaUrl === ""
        ? ""
        : existing.mediaType) as "" | "image" | "audio" | "video",
  });

  return NextResponse.json(message);
}

export async function DELETE(_request: Request, { params }: Params) {
  const actor = await getFamilyMessageWriteActor();
  if (!actor) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getFamilyMessageById(id);
  if (!existing) {
    return NextResponse.json({ error: "Metin bulunamadı." }, { status: 404 });
  }

  if (!actorCanManageMessage(actor, existing)) {
    return NextResponse.json({ error: "Bu metni silme yetkin yok." }, { status: 403 });
  }

  await deleteFamilyMessage(id);
  return NextResponse.json({ ok: true });
}
