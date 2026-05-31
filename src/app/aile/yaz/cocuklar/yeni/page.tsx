import { redirect } from "next/navigation";
import { FamilyBackLink, FamilyShell } from "@/components/FamilyShell";
import { WifeFamilyMessageForm } from "@/components/WifeFamilyMessageForm";
import { getFamilySessionRole } from "@/lib/family-auth";
import { WIFE_WRITE_PATH } from "@/lib/family-shared";

export default async function WifeNewChildrenMessagePage() {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");
  if (role !== "wife") redirect("/aile/oku");

  return (
    <FamilyShell role={role} introOverride="Çocuklarımız için yeni bir yazı oluştur.">
      <FamilyBackLink href={WIFE_WRITE_PATH.children} label="← Çocuklara yaz" />
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <WifeFamilyMessageForm audience="children" />
      </div>
    </FamilyShell>
  );
}
