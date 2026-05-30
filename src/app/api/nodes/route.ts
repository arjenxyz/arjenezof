import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getUniqueSlug } from "@/lib/nodes";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    content?: string;
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

  const slug = await getUniqueSlug(body.title.trim());
  const parentId = body.parentId?.trim() || null;

  if (parentId) {
    const parent = await prisma.thoughtNode.findUnique({ where: { id: parentId } });
    if (!parent) {
      return NextResponse.json({ error: "Üst düşünce bulunamadı." }, { status: 400 });
    }
  }

  const node = await prisma.thoughtNode.create({
    data: {
      title: body.title.trim(),
      slug,
      content: body.content.trim(),
      branchQuestion: body.branchQuestion?.trim() || null,
      branchLabel: body.branchLabel?.trim() || null,
      parentId,
      tags: body.tags?.trim() ?? "",
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? true,
    },
  });

  return NextResponse.json(node, { status: 201 });
}
