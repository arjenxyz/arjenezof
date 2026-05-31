import { redirect } from "next/navigation";
import { FamilyShell } from "@/components/FamilyShell";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { WifeWriteDashboard } from "@/components/WifeWriteDashboard";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { familyAuthorRoleReady, getFamilyMessagesByAuthor } from "@/lib/family";
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
    const [messages, authorReady] = await Promise.all([
      getFamilyMessagesByAuthor("wife"),
      familyAuthorRoleReady(),
    ]);

    return (
      <FamilyShell
        role={role}
        activeTab="write"
        introOverride="Çocuklarımız ve torunlarımız için yazabilirsin. Yazdıkların onların panelinde görünür."
      >
        {!authorReady && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
            <p className="font-medium">Kurulum eksik</p>
            <p className="mt-1">
              Supabase SQL Editor&apos;da{" "}
              <code className="rounded bg-white/80 px-1">family-author-migration.sql</code> dosyasını
              çalıştır. Bu olmadan yazılar &quot;senin yazın&quot; olarak kaydedilmez ve düzenlenemez.
            </p>
          </div>
        )}
        <WifeWriteDashboard messages={messages} authorReady={authorReady} />
      </FamilyShell>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} showHomeLink={false} />;
  }
}
