import { NextResponse } from "next/server";
import { createFamilyMessage } from "@/lib/family";
import { getFamilyMessageWriteActor } from "@/lib/family-write-access";
import { wifeCanManageAudience, type FamilyAudience } from "@/lib/family-shared";

export async function POST(request: Request) {
  const actor = await getFamilyMessageWriteActor();
  if (!actor) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
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

  try {
    const message = await createFamilyMessage({
      title: body.title.trim(),
      content: body.content.trim(),
      audience: body.audience,
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? true,
      authorRole: actor.kind === "wife" ? "wife" : "admin",
      mediaUrl: body.mediaUrl ?? "",
      mediaType: (body.mediaType === "image" ||
      body.mediaType === "audio" ||
      body.mediaType === "video"
        ? body.mediaType
        : "") as "" | "image" | "audio" | "video",
    });

    if (actor.kind === "wife" && message.authorRole !== "wife") {
      return NextResponse.json(
        {
          error:
            "Yazı kaydedildi ama senin yazın olarak işaretlenemedi. Supabase'te family-author-migration.sql çalıştır; aynı tarayıcıda /admin oturumu açıksa kapatıp tekrar dene.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes("authorrole")) {
      return NextResponse.json(
        {
          error:
            "Veritabanında authorRole sütunu yok. Supabase SQL Editor'da supabase/family-author-migration.sql dosyasını çalıştır.",
        },
        { status: 500 },
      );
    }
    throw error;
  }
}
