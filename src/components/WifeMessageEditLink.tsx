import Link from "next/link";
import { wifeCanManageMessage } from "@/lib/family-write-access";
import type { FamilyMessageRecord } from "@/lib/family";
import { WIFE_WRITE_PATH } from "@/lib/family-shared";
import type { WifeWriteAudience } from "@/lib/family-shared";

type Props = {
  message: FamilyMessageRecord;
  className?: string;
};

function editPathForMessage(message: FamilyMessageRecord) {
  const audience = message.audience as WifeWriteAudience;
  return `${WIFE_WRITE_PATH[audience]}/${message.id}/duzenle`;
}

export function WifeMessageEditLink({ message, className = "" }: Props) {
  if (!wifeCanManageMessage(message)) return null;

  return (
    <Link
      href={editPathForMessage(message)}
      className={`inline-flex items-center rounded-lg border border-[#8fa38e] bg-[#eef2ed] px-4 py-2.5 text-sm font-medium text-[#4a5d49] transition hover:bg-[#e3e9e2] touch-manipulation ${className}`}
    >
      Düzenle veya sil
    </Link>
  );
}
