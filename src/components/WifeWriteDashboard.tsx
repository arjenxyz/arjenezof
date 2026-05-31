import Link from "next/link";
import { FamilyMessageCard } from "@/components/FamilyMessageCard";
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
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`${basePath}/yeni`}
          className="rounded-xl bg-[#4a5d49] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#3d4d3c] touch-manipulation"
        >
          + Yeni yazı
        </Link>
        {items.length > 0 && (
          <span className="text-sm text-stone-500">{items.length} yazı kayıtlı</span>
        )}
      </div>

      <section>
        <div
          className={`rounded-2xl border border-stone-200 bg-white/70 p-4 sm:p-5 ${familyAudienceAccentClass(audience)} border-l-4`}
        >
          <h2 className="font-serif text-xl text-stone-900">{section.title}</h2>
          <p className="mt-1 text-sm text-stone-600">Bu bölümdeki yazıları görüntüleyebilir ve düzenleyebilirsin.</p>
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
          <ul className="mt-4 space-y-4">
            {items.map((message) => (
              <li key={message.id}>
                <FamilyMessageCard
                  message={message}
                  readerRole="wife"
                  href={`${basePath}/${message.id}/duzenle`}
                  variant="write"
                  showOwnLabel
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
