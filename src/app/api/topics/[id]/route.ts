import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteTopic, getTopicById, updateTopic } from "@/lib/topics";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getTopicById(id);
  if (!existing) {
    return NextResponse.json({ error: "Konu bulunamadı." }, { status: 404 });
  }

  const body = (await request.json()) as {
    title?: string;
    description?: string;
    sortOrder?: number;
    published?: boolean;
  };

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Konu başlığı zorunludur." }, { status: 400 });
  }

  const topic = await updateTopic(
    id,
    {
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? true,
    },
    existing.slug,
    existing.title,
  );

  return NextResponse.json(topic);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getTopicById(id);
  if (!existing) {
    return NextResponse.json({ error: "Konu bulunamadı." }, { status: 404 });
  }

  await deleteTopic(id);
  return NextResponse.json({ ok: true });
}
