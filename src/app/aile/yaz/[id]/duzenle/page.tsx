import { notFound, redirect } from "next/navigation";
import { getFamilyMessageById } from "@/lib/family";
import { getFamilySessionRole } from "@/lib/family-auth";
import { wifeCanManageMessage } from "@/lib/family-write-access";
import { WIFE_WRITE_PATH } from "@/lib/family-shared";
import type { WifeWriteAudience } from "@/lib/family-shared";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WifeEditLegacyRedirect({ params }: Props) {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");
  if (role !== "wife") redirect("/aile/oku");

  const { id } = await params;
  const message = await getFamilyMessageById(id);
  if (!message || !wifeCanManageMessage(message)) notFound();

  const audience = message.audience as WifeWriteAudience;
  redirect(`${WIFE_WRITE_PATH[audience]}/${message.id}/duzenle`);
}
