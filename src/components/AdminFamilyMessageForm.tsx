import {
  FAMILY_ADMIN_HINTS,
  FAMILY_AUDIENCES,
} from "@/lib/family-shared";
import { FamilyMessageForm } from "@/components/FamilyMessageForm";

type Props = {
  initial?: {
    id: string;
    title: string;
    content: string;
    audience: (typeof FAMILY_AUDIENCES)[number];
    sortOrder: number;
    published: boolean;
  };
};

export function AdminFamilyMessageForm({ initial }: Props) {
  return (
    <FamilyMessageForm
      allowedAudiences={FAMILY_AUDIENCES}
      redirectPath="/admin/aile"
      audienceHints={FAMILY_ADMIN_HINTS}
      initial={initial}
      helper="Yanlış seçme — her kutu farklı gruba gider. Tek metin, tüm çocuklara veya tüm torunlara hitap eder."
    />
  );
}
