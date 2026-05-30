import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createQuote } from "@/lib/quotes";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
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

  const quote = await createQuote({
    text: body.text.trim(),
    author: body.author?.trim() ?? "",
    sortOrder: body.sortOrder ?? 0,
    published: body.published ?? true,
  });

  return NextResponse.json(quote, { status: 201 });
}
