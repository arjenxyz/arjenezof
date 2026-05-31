import { FamilyMessagesView } from "@/components/FamilyMessagesView";
import { FamilyShell } from "@/components/FamilyShell";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getPublishedFamilyMessagesForRole } from "@/lib/family";
import {
  audienceForReadSegment,
  canAccessReadSegment,
  defaultReadPathForRole,
  FAMILY_READ_DESCRIPTIONS,
  FAMILY_READ_LABELS,
  FAMILY_READ_WIFE_SUBTITLES,
  FAMILY_SECTIONS,
  type FamilyReadSegment,
  type FamilyRole,
} from "@/lib/family-shared";

type Props = {
  role: FamilyRole;
  segment: FamilyReadSegment;
  arjenOnly?: boolean;
};

export async function renderFamilyReadSection({ role, segment, arjenOnly = false }: Props) {
  if (!canAccessReadSegment(role, segment)) {
    return { redirect: defaultReadPathForRole(role) as string };
  }

  try {
    const audience = audienceForReadSegment(segment);
    const allMessages = await getPublishedFamilyMessagesForRole(role);
    const messages = allMessages.filter((message) => {
      if (message.audience !== audience) return false;
      if (arjenOnly) return message.authorRole === "admin";
      return true;
    });

    const section = FAMILY_SECTIONS[role][audience];
    const introOverride =
      role === "wife"
        ? FAMILY_READ_WIFE_SUBTITLES[segment]
        : segment === "sana"
          ? "Sana yönelik yazılar."
          : section?.subtitle ?? FAMILY_READ_DESCRIPTIONS[segment];

    const sectionSubtitle =
      role === "wife"
        ? FAMILY_READ_WIFE_SUBTITLES[segment]
        : segment === "sana"
          ? FAMILY_READ_DESCRIPTIONS.sana
          : section?.subtitle;

    return {
      content: (
        <FamilyShell role={role} introOverride={introOverride}>
          <FamilyMessagesView
            role={role}
            messages={messages}
            filterAudience={audience}
            sectionTitle={segment === "sana" ? FAMILY_READ_LABELS.sana : section?.title}
            sectionSubtitle={sectionSubtitle}
            emptyMessage={
              segment === "sana"
                ? "Henüz sana özel bir yazı yok."
                : "Henüz bu bölüme yazı eklenmemiş."
            }
          />
        </FamilyShell>
      ),
    };
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return { content: <SiteErrorPanel {...content} showHomeLink={false} /> };
  }
}
