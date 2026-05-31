import { redirect } from "next/navigation";
import { getFamilySessionRole } from "@/lib/family-auth";
import { renderFamilyReadSection } from "@/app/aile/oku/read-section";

export const metadata = {
  title: "Arjen'in yazdıkları",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function FamilyReadSanaPage() {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");

  const result = await renderFamilyReadSection({ role, segment: "sana", arjenOnly: true });
  if ("redirect" in result && result.redirect) redirect(result.redirect);
  return result.content;
}
