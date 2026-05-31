import Link from "next/link";
import { formatDate } from "@/lib/nodes-shared";
import { familyAudienceAccentClass } from "@/components/FamilyAudienceBadge";
import type { FamilyMessageRecord } from "@/lib/family";
import {
  FAMILY_SECTIONS,
  WIFE_WRITE_PATH,
  type WifeWriteAudience,
} from "@/lib/family-shared";

type Props = {
  messages: FamilyMessageRecord[];
  audience: WifeWriteAudience;
  authorReady?: boolean;
};

export function WifeWriteDashboard({ messages, audience, authorReady = true }: Props) {
  const section = FAMILY_SECTIONS.wife[audience]!;
  const items = messages.filter((message) => message.audience === audience);
  const basePath = WIFE_WRITE_PATH[audience];

  return (
    <div className="mt-8 space-y-8">
      <div className="flex flex-wrap gap-3">
        <Link
          href={`${basePath}/yeni`}
          className="rounded-lg bg-[#4a5d49] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#3d4d3c] touch-manipulation"
        >
          + Yeni yazı
        </Link>
      </div>

      <section>
        <div
          className={`rounded-r-xl border-l-4 py-1 pl-4 ${familyAudienceAccentClass(audience)}`}
        >
          <h2 className="font-serif text-xl text-stone-900">{section.title}</h2>
          <p className="mt-1 text-sm text-stone-600">Senin yazdıkların</p>
        </div>

        {items.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-stone-600">
            <p>Henüz bu bölüme yazı eklemedin.</p>
            {!authorReady ? (
              <p className="mt-2 text-sm text-amber-800">
                Önce Supabase kurulumunu tamamla, sonra yeni yazı ekle.
              </p>
            ) : (
              <p className="mt-2 text-sm text-stone-500">
                Yukarıdaki &quot;Yeni yazı&quot; ile başlayabilirsin.
              </p>
            )}
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {items.map((message) => (
              <li key={message.id}>
                <Link
                  href={`${basePath}/${message.id}/duzenle`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 transition hover:border-[#8fa38e] touch-manipulation"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-stone-900">{message.title}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      {formatDate(message.updatedAt)}
                      {message.mediaType ? ` · ${message.mediaType === "image" ? "Görsel" : message.mediaType === "audio" ? "Ses" : "Video"}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-[#4a5d49]">Düzenle →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
