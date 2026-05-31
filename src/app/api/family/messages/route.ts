import { NextResponse } from "next/server";
import { createFamilyMessage } from "@/lib/family";
import { getFamilyWriteActor } from "@/lib/family-write-access";
import { wifeCanManageAudience, type FamilyAudience } from "@/lib/family-shared";

export async function POST(request: Request) {
  const actor = await getFamilyWriteActor();
  if (!actor) {
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

  if (actor.kind === "wife") {
    if (!wifeCanManageAudience(body.audience)) {
      return NextResponse.json(
        { error: "Yalnızca çocuklar ve torunlar için yazabilirsin." },
        { status: 403 },
      );
    }
  }

  const message = await createFamilyMessage({
    title: body.title.trim(),
    content: body.content.trim(),
    audience: body.audience,
    sortOrder: body.sortOrder ?? 0,
    published: body.published ?? true,
    authorRole: actor.kind === "wife" ? "wife" : "admin",
  });

  return NextResponse.json(message, { status: 201 });
}
