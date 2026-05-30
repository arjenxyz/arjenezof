import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  deleteThoughtNode,
  getNodeById,
  getParentNode,
  updateThoughtNode,
} from "@/lib/nodes";
import { resolveTopicId } from "@/lib/topics";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getNodeById(id);
  if (!existing) {
    return NextResponse.json({ error: "Düşünce bulunamadı." }, { status: 404 });
  }

  const body = (await request.json()) as {
    title?: string;
    content?: string;
    topicId?: string;
    newTopic?: { title?: string; description?: string };
    branchQuestion?: string;
    branchLabel?: string;
    parentId?: string;
    tags?: string;
    sortOrder?: number;
    published?: boolean;
  };

  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: "Başlık ve metin zorunludur." }, { status: 400 });
  }

  const resolvedTopicId =
    (await resolveTopicId({
      topicId: body.topicId ?? existing.topicId,
      newTopic: body.newTopic,
    })) ?? existing.topicId;

  const parentId = body.parentId?.trim() || null;
  if (parentId === id) {
    return NextResponse.json({ error: "Bir düşünce kendi üstü olamaz." }, { status: 400 });
  }

  if (parentId) {
    const parent = await getParentNode(parentId);
    if (!parent) {
      return NextResponse.json({ error: "Üst düşünce bulunamadı." }, { status: 400 });
    }
    if (parent.topicId !== resolvedTopicId) {
      return NextResponse.json({ error: "Üst düşünce aynı konuda olmalıdır." }, { status: 400 });
    }
  }

  const node = await updateThoughtNode(
    id,
    {
      title: body.title.trim(),
      content: body.content.trim(),
      topicId: resolvedTopicId,
      branchQuestion: body.branchQuestion?.trim() || null,
      branchLabel: body.branchLabel?.trim() || null,
      parentId,
      tags: body.tags?.trim() ?? "",
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? true,
    },
    existing.slug,
    existing.title,
  );

  return NextResponse.json(node);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getNodeById(id);
  if (!existing) {
    return NextResponse.json({ error: "Düşünce bulunamadı." }, { status: 404 });
  }

  await deleteThoughtNode(id);
  return NextResponse.json({ ok: true });
}
