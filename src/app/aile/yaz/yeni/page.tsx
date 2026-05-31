import { redirect } from "next/navigation";
import { FamilyBackLink, FamilyShell } from "@/components/FamilyShell";
import { WifeFamilyMessageForm } from "@/components/WifeFamilyMessageForm";
import { getFamilySessionRole } from "@/lib/family-auth";

export default async function WifeNewMessagePage() {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");
  if (role !== "wife") redirect("/aile/metinler");

  return (
    <FamilyShell role={role} activeTab="write" introOverride="Yeni bir aile yazısı oluştur.">
      <FamilyBackLink href="/aile/yaz" label="← Yazılara dön" />
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <WifeFamilyMessageForm />
      </div>
    </FamilyShell>
  );
}
