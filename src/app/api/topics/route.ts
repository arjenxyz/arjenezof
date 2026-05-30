import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createTopic } from "@/lib/topics";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    description?: string;
    sortOrder?: number;
    published?: boolean;
  };

  if (!body.title?.trim() || !body.description?.trim()) {
    return NextResponse.json({ error: "Başlık ve açıklama zorunludur." }, { status: 400 });
  }

  const topic = await createTopic({
    title: body.title.trim(),
    description: body.description.trim(),
    sortOrder: body.sortOrder ?? 0,
    published: body.published ?? true,
  });

  return NextResponse.json(topic, { status: 201 });
}
