import { redirect } from "next/navigation";
import { getRandomPublishedWriting } from "@/lib/nodes";

export const dynamic = "force-dynamic";

export async function GET() {
  const writing = await getRandomPublishedWriting();
  if (!writing) redirect("/");
  redirect(`/dusunce/${writing.slug}`);
}
