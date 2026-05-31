import { redirect } from "next/navigation";
import { FamilyShell } from "@/components/FamilyShell";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { WifeWriteDashboard } from "@/components/WifeWriteDashboard";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getFamilyMessagesByAuthor } from "@/lib/family";
import { getFamilySessionRole } from "@/lib/family-auth";

export const metadata = {
  title: "Yaz",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WifeWritePage() {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");
  if (role !== "wife") redirect("/aile/metinler");

  try {
    const messages = await getFamilyMessagesByAuthor("wife");

    return (
      <FamilyShell
        role={role}
        activeTab="write"
        introOverride="Çocuklarımız ve torunlarımız için yazabilirsin. Yazdıkların onların panelinde görünür."
      >
        <WifeWriteDashboard messages={messages} />
      </FamilyShell>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} showHomeLink={false} />;
  }
}
