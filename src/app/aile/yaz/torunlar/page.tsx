import { redirect } from "next/navigation";
import { FamilyShell } from "@/components/FamilyShell";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { WifeWriteDashboard } from "@/components/WifeWriteDashboard";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { familyAuthorRoleReady, getFamilyMessagesByAuthorAndAudience } from "@/lib/family";
import { getFamilySessionRole } from "@/lib/family-auth";

export const metadata = {
  title: "Torunlara yaz",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WifeWriteGrandchildrenPage() {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");
  if (role !== "wife") redirect("/aile/oku");

  try {
    const [messages, authorReady] = await Promise.all([
      getFamilyMessagesByAuthorAndAudience("wife", "grandchildren"),
      familyAuthorRoleReady(),
    ]);

    return (
      <FamilyShell
        role={role}
        introOverride="Torunlarımız için yazabilirsin. Yazdıkların onların panelinde görünür."
      >
        {!authorReady && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
            <p className="font-medium">Kurulum eksik</p>
            <p className="mt-1">
              Supabase SQL Editor&apos;da{" "}
              <code className="rounded bg-white/80 px-1">family-author-migration.sql</code> dosyasını
              çalıştır.
            </p>
          </div>
        )}
        <WifeWriteDashboard messages={messages} audience="grandchildren" authorReady={authorReady} />
      </FamilyShell>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} showHomeLink={false} />;
  }
}
