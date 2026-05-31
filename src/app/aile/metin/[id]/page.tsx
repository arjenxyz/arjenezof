import { notFound, redirect } from "next/navigation";
import { FamilyAudienceBadge } from "@/components/FamilyAudienceBadge";
import { FamilyDetailHeader, FamilyShell } from "@/components/FamilyShell";
import { FamilyMessageMedia } from "@/components/FamilyMessageMedia";
import { WifeMessageEditLink } from "@/components/WifeMessageEditLink";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { formatDate } from "@/lib/nodes-shared";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getFamilyMessageForRole } from "@/lib/family";
import { getFamilySessionRole } from "@/lib/family-auth";
import { FAMILY_DETAIL_CONTEXT } from "@/lib/family-shared";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  return {
    title: "Aile metni",
    robots: { index: false, follow: false },
  };
}

export default async function FamilyMessageDetailPage({ params }: Props) {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");

  const { id } = await params;

  try {
    const message = await getFamilyMessageForRole(id, role);
    if (!message) notFound();

    const showContext = role === "wife" && message.audience !== "wife";

    return (
      <FamilyShell role={role}>
        <FamilyDetailHeader backHref="/aile/oku" />

        <article className="sm:mt-2">
          {showContext ? (
            <p className="text-sm text-stone-500">{FAMILY_DETAIL_CONTEXT[message.audience]}</p>
          ) : role !== "wife" ? (
            <FamilyAudienceBadge audience={message.audience} />
          ) : message.authorRole === "wife" ? (
            <p className="text-sm font-medium text-rose-700">Senin yazın</p>
          ) : null}

          <h1 className="mt-3 font-serif text-2xl leading-tight text-stone-900 sm:text-4xl">
            {message.title}
          </h1>
          <p className="mt-3 text-sm text-stone-500">{formatDate(message.updatedAt)}</p>

          <div className="prose-thought mt-6 rounded-xl border border-stone-200 bg-white p-4 text-base leading-relaxed text-stone-700 shadow-sm sm:mt-8 sm:p-6 sm:text-lg">
            {message.content}
          </div>

          {message.mediaUrl && message.mediaType && (
            <FamilyMessageMedia
              mediaUrl={message.mediaUrl}
              mediaType={message.mediaType}
              className="mt-6"
            />
          )}

          {role === "wife" && (
            <div className="mt-6">
              <WifeMessageEditLink message={message} />
            </div>
          )}
        </article>
      </FamilyShell>
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_NOT_FOUND")) {
      throw error;
    }
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} showHomeLink={false} />;
  }
}
