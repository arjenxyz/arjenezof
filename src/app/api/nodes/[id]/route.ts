import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getUniqueSlug } from "@/lib/nodes";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.thoughtNode.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Düşünce bulunamadı." }, { status: 404 });
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

  const parentId = body.parentId?.trim() || null;
  if (parentId === id) {
    return NextResponse.json({ error: "Bir düşünce kendi üstü olamaz." }, { status: 400 });
  }

  if (parentId) {
    const parent = await prisma.thoughtNode.findUnique({ where: { id: parentId } });
    if (!parent) {
      return NextResponse.json({ error: "Üst düşünce bulunamadı." }, { status: 400 });
    }
  }

  const slug =
    existing.title === body.title.trim()
      ? existing.slug
      : await getUniqueSlug(body.title.trim(), id);

  const node = await prisma.thoughtNode.update({
    where: { id },
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

  return NextResponse.json(node);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.thoughtNode.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Düşünce bulunamadı." }, { status: 404 });
  }

  await prisma.thoughtNode.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
