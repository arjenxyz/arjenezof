import { notFound, redirect } from "next/navigation";
import { FamilyBackLink, FamilyShell } from "@/components/FamilyShell";
import { WifeFamilyMessageForm } from "@/components/WifeFamilyMessageForm";
import { getFamilyMessageById } from "@/lib/family";
import { getFamilySessionRole } from "@/lib/family-auth";
import { wifeCanManageMessage } from "@/lib/family-write-access";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WifeEditMessagePage({ params }: Props) {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");
  if (role !== "wife") redirect("/aile/metinler");

  const { id } = await params;
  const message = await getFamilyMessageById(id);
  if (!message || !wifeCanManageMessage(message)) notFound();

  return (
    <FamilyShell role={role} activeTab="write" introOverride="Yazını düzenle veya sil.">
      <FamilyBackLink href="/aile/yaz" label="← Yazılara dön" />
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <WifeFamilyMessageForm
          initial={{
            id: message.id,
            title: message.title,
            content: message.content,
            audience: message.audience as "children" | "grandchildren",
            sortOrder: message.sortOrder,
            published: message.published,
          }}
        />
      </div>
    </FamilyShell>
  );
}
