import Link from "next/link";
import { redirect } from "next/navigation";
import { FamilyAudienceBadge } from "@/components/FamilyAudienceBadge";
import { FamilyLogoutButton } from "@/components/FamilyLogoutButton";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { formatDate } from "@/lib/nodes-shared";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getPublishedFamilyMessagesForRole } from "@/lib/family";
import { getFamilySessionRole } from "@/lib/family-auth";
import { FAMILY_GREETINGS, FAMILY_LABELS } from "@/lib/family-shared";

export const metadata = {
  title: "Aile metinleri",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function FamilyMessagesPage() {
  const role = await getFamilySessionRole();
  if (!role) redirect("/aile");

  try {
    const messages = await getPublishedFamilyMessagesForRole(role);

    return (
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Aile alanı</p>
            <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">
              {FAMILY_GREETINGS[role]}
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              {role === "wife"
                ? "Sana, çocuklara ve torunlara yazılanların hepsi burada."
                : role === "children"
                  ? "Çocuklara ve torunlara yazılan metinler burada."
                  : "Torunlara yazılan metinler burada."}
            </p>
          </div>
          <FamilyLogoutButton />
        </div>

        {messages.length === 0 ? (
          <p className="mt-10 text-stone-500">Henüz senin için metin yok.</p>
        ) : (
          <ul className="mt-8 space-y-4">
            {messages.map((message) => (
              <li key={message.id}>
                <Link
                  href={`/aile/metin/${message.id}`}
                  className="block rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-[#8fa38e] sm:p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <FamilyAudienceBadge audience={message.audience} />
                    {role === "wife" && (
                      <span className="text-xs text-stone-500">
                        {FAMILY_LABELS[message.audience]} için
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-serif text-lg text-stone-900">{message.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">
                    {message.content}
                  </p>
                  <p className="mt-3 text-xs text-stone-500">{formatDate(message.updatedAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} showHomeLink={false} />;
  }
}
