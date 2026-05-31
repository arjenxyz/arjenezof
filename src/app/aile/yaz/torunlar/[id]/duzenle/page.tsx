import { notFound, redirect } from "next/navigation";
import { FamilyBackLink, FamilyShell } from "@/components/FamilyShell";
import { WifeFamilyMessageForm } from "@/components/WifeFamilyMessageForm";
import { getFamilyMessageById } from "@/lib/family";
import { getFamilySessionRole } from "@/lib/family-auth";
import { wifeCanManageMessage } from "@/lib/family-write-access";
import { WIFE_WRITE_PATH } from "@/lib/family-shared";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WifeEditGrandchildrenMessagePage({ params }: Props) {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");
  if (role !== "wife") redirect("/aile/oku");

  const { id } = await params;
  const message = await getFamilyMessageById(id);
  if (!message || !wifeCanManageMessage(message) || message.audience !== "grandchildren") {
    notFound();
  }

  return (
    <FamilyShell role={role} introOverride="Yazını düzenle veya sil.">
      <FamilyBackLink href={WIFE_WRITE_PATH.grandchildren} label="← Torunlara yaz" />
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <WifeFamilyMessageForm
          audience="grandchildren"
          initial={{
            id: message.id,
            title: message.title,
            content: message.content,
            audience: "grandchildren",
            sortOrder: message.sortOrder,
            published: message.published,
            mediaUrl: message.mediaUrl,
            mediaType: message.mediaType,
          }}
        />
      </div>
    </FamilyShell>
  );
}
