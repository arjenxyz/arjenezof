import {
  WIFE_WRITE_AUDIENCES,
  WIFE_WRITE_HINTS,
  type WifeWriteAudience,
} from "@/lib/family-shared";
import { FamilyMessageForm } from "@/components/FamilyMessageForm";

type Props = {
  initial?: {
    id: string;
    title: string;
    content: string;
    audience: WifeWriteAudience;
    sortOrder: number;
    published: boolean;
  };
};

export function WifeFamilyMessageForm({ initial }: Props) {
  return (
    <FamilyMessageForm
      allowedAudiences={[...WIFE_WRITE_AUDIENCES]}
      redirectPath="/aile/yaz"
      audienceHints={WIFE_WRITE_HINTS}
      initial={initial}
      showSortOrder={false}
      showPublishedToggle={false}
      legend="Kime yazmak istiyorsun?"
      helper="Çocuklarımız ve torunlarımız için yazabilirsin. Arjen'in sana özel yazılarına dokunamazsın."
    />
  );
}
