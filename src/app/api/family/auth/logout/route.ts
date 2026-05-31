import { NextResponse } from "next/server";
import { destroyFamilySession } from "@/lib/family-auth";

export async function POST() {
  await destroyFamilySession();
  return NextResponse.json({ ok: true });
}
