import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FamilyAudienceBadge } from "@/components/FamilyAudienceBadge";
import { FamilyLogoutButton } from "@/components/FamilyLogoutButton";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { formatDate } from "@/lib/nodes-shared";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getFamilyMessageForRole } from "@/lib/family";
import { getFamilySessionRole } from "@/lib/family-auth";

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

    return (
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex items-start justify-between gap-4">
          <Link
            href="/aile/metinler"
            className="text-sm text-stone-500 hover:text-stone-800 touch-manipulation"
          >
            ← Listeye dön
          </Link>
          <FamilyLogoutButton />
        </div>

        <div className="mt-6">
          <FamilyAudienceBadge audience={message.audience} />
          <h1 className="mt-3 font-serif text-2xl text-stone-900 sm:text-4xl">{message.title}</h1>
          <p className="mt-3 text-sm text-stone-500">{formatDate(message.updatedAt)}</p>
        </div>

        <article className="prose-thought mt-6 rounded-xl border border-stone-200 bg-white p-4 text-stone-700 shadow-sm sm:mt-8 sm:p-6">
          {message.content}
        </article>
      </main>
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_NOT_FOUND")) {
      throw error;
    }
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} showHomeLink={false} />;
  }
}
