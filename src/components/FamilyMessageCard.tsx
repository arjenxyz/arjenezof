import Link from "next/link";
import { familyAudienceCardBorderClass } from "@/components/FamilyAudienceBadge";
import { FamilyMessageWhen } from "@/components/FamilyMessageWhen";
import type { FamilyMessageRecord } from "@/lib/family";
import { wifeCanManageMessage } from "@/lib/family-write-access";
import { estimateReadingMinutes } from "@/lib/nodes-shared";
import type { FamilyRole } from "@/lib/family-shared";

type Props = {
  message: FamilyMessageRecord;
  readerRole: FamilyRole;
  href: string;
  variant?: "read" | "write";
  showOwnLabel?: boolean;
};

function AuthorBadge({ label, tone }: { label: string; tone: "rose" | "sky" | "stone" }) {
  const toneClass = {
    rose: "bg-rose-50 text-rose-800 ring-rose-200",
    sky: "bg-sky-50 text-sky-800 ring-sky-200",
    stone: "bg-stone-100 text-stone-700 ring-stone-200",
  }[tone];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${toneClass}`}
    >
      {label}
    </span>
  );
}

function MediaChip({ mediaType }: { mediaType: FamilyMessageRecord["mediaType"] }) {
  if (!mediaType) return null;

  const label =
    mediaType === "image" ? "Görsel" : mediaType === "audio" ? "Ses kaydı" : "Video";

  return (
    <span className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600">
      {label}
    </span>
  );
}

export function FamilyMessageCard({
  message,
  readerRole,
  href,
  variant = "read",
  showOwnLabel = false,
}: Props) {
  const isOwnMessage = showOwnLabel && wifeCanManageMessage(message);
  const readingMinutes = estimateReadingMinutes(message.content);
  const borderAccent = familyAudienceCardBorderClass(message.audience);

  const familyAuthorLabel =
    readerRole === "children" && message.authorRole === "wife"
      ? "Annenden"
      : readerRole === "grandchildren" && message.authorRole === "wife"
        ? "Büyükannenden"
        : readerRole === "wife" && message.authorRole === "admin"
          ? "Arjen'den"
          : null;

  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-stone-200 border-l-[3px] bg-white shadow-sm transition hover:border-[#8fa38e] hover:shadow-md ${borderAccent}`}
    >
      <Link href={href} className="block touch-manipulation">
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {isOwnMessage && variant === "read" && (
              <AuthorBadge label="Senin yazın" tone="rose" />
            )}
            {isOwnMessage && variant === "write" && (
              <AuthorBadge label="Senin yazın" tone="rose" />
            )}
            {familyAuthorLabel && <AuthorBadge label={familyAuthorLabel} tone="sky" />}
            <MediaChip mediaType={message.mediaType} />
            <span className="ml-auto text-[11px] text-stone-400">~{readingMinutes} dk okuma</span>
          </div>

          <h3 className="mt-3 font-serif text-lg leading-snug text-stone-900 transition group-hover:text-[#4a5d49] sm:text-xl">
            {message.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">
            {message.content}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/80 px-4 py-3 sm:px-5">
          <FamilyMessageWhen date={message.updatedAt} createdAt={message.createdAt} />
          <span className="shrink-0 text-sm font-medium text-[#4a5d49] opacity-80 transition group-hover:opacity-100">
            {variant === "write" ? "Düzenle →" : "Oku →"}
          </span>
        </div>
      </Link>
    </article>
  );
}
