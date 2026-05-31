import {
  WIFE_WRITE_HINTS,
  WIFE_WRITE_PATH,
  type WifeWriteAudience,
} from "@/lib/family-shared";
import { FamilyMessageForm } from "@/components/FamilyMessageForm";
import type { FamilyMediaType } from "@/lib/family-media";

type Props = {
  audience: WifeWriteAudience;
  initial?: {
    id: string;
    title: string;
    content: string;
    audience: WifeWriteAudience;
    sortOrder: number;
    published: boolean;
    mediaUrl?: string;
    mediaType?: FamilyMediaType | "";
  };
};

export function WifeFamilyMessageForm({ audience, initial }: Props) {
  return (
    <FamilyMessageForm
      allowedAudiences={[audience]}
      fixedAudience={audience}
      redirectPath={WIFE_WRITE_PATH[audience]}
      audienceHints={WIFE_WRITE_HINTS}
      initial={initial}
      showSortOrder={false}
      showPublishedToggle={false}
    />
  );
}
