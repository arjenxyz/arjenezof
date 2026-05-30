import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteQuote, getQuoteById, updateQuote } from "@/lib/quotes";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getQuoteById(id);
  if (!existing) {
    return NextResponse.json({ error: "Söz bulunamadı." }, { status: 404 });
  }

  const body = (await request.json()) as {
    text?: string;
    author?: string;
    sortOrder?: number;
    published?: boolean;
  };

  if (!body.text?.trim()) {
    return NextResponse.json({ error: "Söz metni zorunludur." }, { status: 400 });
  }

  const quote = await updateQuote(id, {
    text: body.text.trim(),
    author: body.author?.trim() ?? "",
    sortOrder: body.sortOrder ?? 0,
    published: body.published ?? true,
  });

  return NextResponse.json(quote);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getQuoteById(id);
  if (!existing) {
    return NextResponse.json({ error: "Söz bulunamadı." }, { status: 404 });
  }

  await deleteQuote(id);
  return NextResponse.json({ ok: true });
}
