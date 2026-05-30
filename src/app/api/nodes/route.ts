import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createThoughtNode, getParentNode } from "@/lib/nodes";
import { getTopicById } from "@/lib/topics";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    content?: string;
    topicId?: string;
    branchQuestion?: string;
    branchLabel?: string;
    parentId?: string;
    tags?: string;
    sortOrder?: number;
    published?: boolean;
  };

  if (!body.title?.trim() || !body.content?.trim() || !body.topicId?.trim()) {
    return NextResponse.json({ error: "Konu, başlık ve metin zorunludur." }, { status: 400 });
  }

  const topic = await getTopicById(body.topicId.trim());
  if (!topic) {
    return NextResponse.json({ error: "Konu bulunamadı." }, { status: 400 });
  }

  const parentId = body.parentId?.trim() || null;

  if (parentId) {
    const parent = await getParentNode(parentId);
    if (!parent) {
      return NextResponse.json({ error: "Üst düşünce bulunamadı." }, { status: 400 });
    }
    if (parent.topicId !== body.topicId.trim()) {
      return NextResponse.json({ error: "Üst düşünce aynı konuda olmalıdır." }, { status: 400 });
    }
  }

  const node = await createThoughtNode({
    title: body.title.trim(),
    content: body.content.trim(),
    topicId: body.topicId.trim(),
    branchQuestion: body.branchQuestion?.trim() || null,
    branchLabel: body.branchLabel?.trim() || null,
    parentId,
    tags: body.tags?.trim() ?? "",
    sortOrder: body.sortOrder ?? 0,
    published: body.published ?? true,
  });

  return NextResponse.json(node, { status: 201 });
}
