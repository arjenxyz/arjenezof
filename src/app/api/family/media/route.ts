import { NextResponse } from "next/server";
import { uploadFamilyMedia } from "@/lib/family-media";
import { getFamilyMessageWriteActor } from "@/lib/family-write-access";

export async function POST(request: Request) {
  const actor = await getFamilyMessageWriteActor();
  if (!actor) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Dosya gerekli." }, { status: 400 });
    }

    const result = await uploadFamilyMedia(file);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yükleme başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
