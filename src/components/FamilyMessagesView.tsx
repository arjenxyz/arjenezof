import Link from "next/link";
import { formatDate } from "@/lib/nodes-shared";
import { familyAudienceAccentClass } from "@/components/FamilyAudienceBadge";
import type { FamilyMessageRecord } from "@/lib/family";
import {
  FAMILY_SECTIONS,
  sectionsForRole,
  type FamilyRole,
} from "@/lib/family-shared";

type Props = {
  role: FamilyRole;
  messages: FamilyMessageRecord[];
};

function MessageCard({
  message,
  showOwnLabel,
  readerRole,
}: {
  message: FamilyMessageRecord;
  showOwnLabel?: boolean;
  readerRole: FamilyRole;
}) {
  const familyAuthorLabel =
    readerRole === "children" && message.authorRole === "wife"
      ? "Annenden"
      : readerRole === "grandchildren" && message.authorRole === "wife"
        ? "Büyükannenden"
        : null;

  return (
    <Link
      href={`/aile/metin/${message.id}`}
      className="block rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-[#8fa38e] hover:shadow touch-manipulation sm:p-5"
    >
      {showOwnLabel && message.authorRole === "wife" && (
        <p className="mb-2 text-xs font-medium text-rose-700">Senin yazın</p>
      )}
      {familyAuthorLabel && (
        <p className="mb-2 text-xs font-medium text-rose-700">{familyAuthorLabel}</p>
      )}
      <h3 className="font-serif text-lg text-stone-900">{message.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">{message.content}</p>
      <p className="mt-3 text-xs text-stone-500">{formatDate(message.updatedAt)}</p>
    </Link>
  );
}

export function FamilyMessagesView({ role, messages }: Props) {
  if (messages.length === 0) {
    return (
      <p className="mt-10 rounded-xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-stone-500">
        Henüz senin için yazılmış bir metin yok.
      </p>
    );
  }

  const sectionAudiences = sectionsForRole(role);
  const sectionMap = FAMILY_SECTIONS[role];

  if (sectionAudiences.length <= 1) {
    return (
      <ul className="mt-8 space-y-4">
        {messages.map((message) => (
          <li key={message.id}>
            <MessageCard message={message} readerRole={role} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      {sectionAudiences.map((audience) => {
        const section = sectionMap[audience];
        const items = messages.filter((message) => message.audience === audience);
        if (!section) return null;

        return (
          <section key={audience} aria-labelledby={`family-section-${audience}`}>
            <div
              className={`rounded-r-xl border-l-4 py-1 pl-4 ${familyAudienceAccentClass(audience)}`}
            >
              <h2
                id={`family-section-${audience}`}
                className="font-serif text-xl text-stone-900 sm:text-2xl"
              >
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-stone-600">{section.subtitle}</p>
            </div>

            {items.length === 0 ? (
              <p className="mt-4 pl-4 text-sm text-stone-400">Henüz bu bölüme yazı eklenmemiş.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {items.map((message) => (
                  <li key={message.id}>
                    <MessageCard message={message} showOwnLabel={role === "wife"} readerRole={role} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
