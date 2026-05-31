import { FamilyMessageCard } from "@/components/FamilyMessageCard";
import { familyAudienceAccentClass } from "@/components/FamilyAudienceBadge";
import type { FamilyMessageRecord } from "@/lib/family";
import {
  FAMILY_SECTIONS,
  sectionsForRole,
  type FamilyAudience,
  type FamilyRole,
} from "@/lib/family-shared";

type Props = {
  role: FamilyRole;
  messages: FamilyMessageRecord[];
  filterAudience?: FamilyAudience;
  sectionTitle?: string;
  sectionSubtitle?: string;
  emptyMessage?: string;
};

function SingleSection({
  audience,
  title,
  subtitle,
  messages,
  role,
  emptyMessage,
}: {
  audience: FamilyAudience;
  title: string;
  subtitle?: string;
  messages: FamilyMessageRecord[];
  role: FamilyRole;
  emptyMessage: string;
}) {
  return (
    <section className="mt-8" aria-labelledby={`family-section-${audience}`}>
      <div className={`rounded-2xl border border-stone-200 bg-white/70 p-4 sm:p-5 ${familyAudienceAccentClass(audience)} border-l-4`}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id={`family-section-${audience}`} className="font-serif text-xl text-stone-900 sm:text-2xl">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm leading-relaxed text-stone-600">{subtitle}</p>}
          </div>
          {messages.length > 0 && (
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
              {messages.length} yazı
            </span>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-stone-300 bg-white/60 px-4 py-8 text-center text-sm text-stone-500">
          {emptyMessage}
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {messages.map((message) => (
            <li key={message.id}>
              <FamilyMessageCard
                message={message}
                readerRole={role}
                href={`/aile/metin/${message.id}`}
                variant="read"
                showOwnLabel={role === "wife"}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function FamilyMessagesView({
  role,
  messages,
  filterAudience,
  sectionTitle,
  sectionSubtitle,
  emptyMessage = "Henüz senin için yazılmış bir metin yok.",
}: Props) {
  if (filterAudience) {
    const section = FAMILY_SECTIONS[role][filterAudience];
    return (
      <SingleSection
        audience={filterAudience}
        title={sectionTitle ?? section?.title ?? ""}
        subtitle={sectionSubtitle ?? section?.subtitle}
        messages={messages}
        role={role}
        emptyMessage={emptyMessage}
      />
    );
  }

  if (messages.length === 0) {
    return (
      <p className="mt-10 rounded-xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-stone-500">
        {emptyMessage}
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
            <FamilyMessageCard
              message={message}
              readerRole={role}
              href={`/aile/metin/${message.id}`}
              variant="read"
            />
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
          <SingleSection
            key={audience}
            audience={audience}
            title={section.title}
            subtitle={section.subtitle}
            messages={items}
            role={role}
            emptyMessage="Henüz bu bölüme yazı eklenmemiş."
          />
        );
      })}
    </div>
  );
}
