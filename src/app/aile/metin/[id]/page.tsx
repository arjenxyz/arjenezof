import { notFound, redirect } from "next/navigation";
import { FamilyAudienceBadge } from "@/components/FamilyAudienceBadge";
import { FamilyDetailHeader, FamilyShell } from "@/components/FamilyShell";
import { FamilyMessageMedia } from "@/components/FamilyMessageMedia";
import { FamilyMessageWhen } from "@/components/FamilyMessageWhen";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getFamilyMessageForRole } from "@/lib/family";
import { getFamilySessionRole } from "@/lib/family-auth";
import { estimateReadingMinutes } from "@/lib/nodes-shared";
import { FAMILY_DETAIL_CONTEXT, readPathForAudience } from "@/lib/family-shared";

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
    const readingMinutes = estimateReadingMinutes(message.content);

    return (
      <FamilyShell role={role}>
        <FamilyDetailHeader backHref={readPathForAudience(message.audience)} />

        <article className="mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm sm:mt-4">
          <div className="border-b border-stone-100 px-4 py-5 sm:px-6 sm:py-6">
            {showContext ? (
              <p className="text-sm text-stone-500">{FAMILY_DETAIL_CONTEXT[message.audience]}</p>
            ) : role !== "wife" ? (
              <FamilyAudienceBadge audience={message.audience} />
            ) : message.authorRole === "wife" ? (
              <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-800 ring-1 ring-inset ring-rose-200">
                Senin yazın
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700 ring-1 ring-inset ring-stone-200">
                Arjen&apos;den
              </span>
            )}

            <h1 className="mt-3 font-serif text-2xl leading-tight text-stone-900 sm:text-4xl">
              {message.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <FamilyMessageWhen date={message.updatedAt} createdAt={message.createdAt} />
              <span className="text-xs text-stone-400">~{readingMinutes} dk okuma</span>
            </div>
          </div>

          <div className="px-4 py-5 text-base leading-relaxed text-stone-700 sm:px-6 sm:py-6 sm:text-lg">
            {message.content}
          </div>

          {message.mediaUrl && message.mediaType && (
            <div className="border-t border-stone-100 px-4 py-5 sm:px-6">
              <FamilyMessageMedia mediaUrl={message.mediaUrl} mediaType={message.mediaType} />
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
