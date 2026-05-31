import { redirect } from "next/navigation";
import { getFamilySessionRole } from "@/lib/family-auth";
import { defaultReadPathForRole } from "@/lib/family-shared";

export const dynamic = "force-dynamic";

export default async function FamilyReadIndexPage() {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");
  redirect(defaultReadPathForRole(role));
}
