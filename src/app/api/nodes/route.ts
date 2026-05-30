import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createThoughtNode, getParentNode } from "@/lib/nodes";
import { resolveTopicId } from "@/lib/topics";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    content?: string;
    topicId?: string;
    newTopic?: { title?: string; description?: string };
    parentId?: string;
    relatedIds?: string;
    tags?: string;
    sortOrder?: number;
    published?: boolean;
  };

  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: "Başlık ve metin zorunludur." }, { status: 400 });
  }

  const resolvedTopicId = await resolveTopicId({
    topicId: body.topicId,
    newTopic: body.newTopic,
  });

  if (!resolvedTopicId) {
    return NextResponse.json(
      { error: "Konu seç veya yeni bir konu adı yaz." },
      { status: 400 },
    );
  }

  const parentId = body.parentId?.trim() || null;

  if (parentId) {
    const parent = await getParentNode(parentId);
    if (!parent) {
      return NextResponse.json({ error: "Devam metni bulunamadı." }, { status: 400 });
    }
    if (parent.topicId !== resolvedTopicId) {
      return NextResponse.json({ error: "Devam metni aynı konuda olmalıdır." }, { status: 400 });
    }
  }

  const node = await createThoughtNode({
    title: body.title.trim(),
    content: body.content.trim(),
    topicId: resolvedTopicId,
    parentId,
    relatedIds: body.relatedIds?.trim() ?? "",
    tags: body.tags?.trim() ?? "",
    sortOrder: body.sortOrder ?? 0,
    published: body.published ?? true,
  });

  return NextResponse.json(node, { status: 201 });
}
