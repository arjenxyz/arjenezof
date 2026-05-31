import { redirect } from "next/navigation";
import { FamilyMessagesView } from "@/components/FamilyMessagesView";
import { FamilyShell } from "@/components/FamilyShell";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getPublishedFamilyMessagesForRole } from "@/lib/family";
import { getFamilySessionRole } from "@/lib/family-auth";

export const metadata = {
  title: "Aile metinleri",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function FamilyReadPage() {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");

  try {
    const messages = await getPublishedFamilyMessagesForRole(role);

    return (
      <FamilyShell role={role}>
        <FamilyMessagesView role={role} messages={messages} />
      </FamilyShell>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} showHomeLink={false} />;
  }
}
