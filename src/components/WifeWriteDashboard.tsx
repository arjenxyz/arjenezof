import Link from "next/link";
import { formatDate } from "@/lib/nodes-shared";
import { familyAudienceAccentClass } from "@/components/FamilyAudienceBadge";
import type { FamilyMessageRecord } from "@/lib/family";
import {
  FAMILY_SECTIONS,
  WIFE_WRITE_AUDIENCES,
} from "@/lib/family-shared";

type Props = {
  messages: FamilyMessageRecord[];
};

export function WifeWriteDashboard({ messages }: Props) {
  const sections = WIFE_WRITE_AUDIENCES.map((audience) => ({
    audience,
    ...FAMILY_SECTIONS.wife[audience]!,
    items: messages.filter((message) => message.audience === audience),
  }));

  return (
    <div className="mt-8 space-y-8">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/aile/yaz/yeni"
          className="rounded-lg bg-[#4a5d49] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#3d4d3c] touch-manipulation"
        >
          + Yeni yazı
        </Link>
      </div>

      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white/60 p-8 text-center text-stone-500">
          Henüz bir yazı eklemedin. İlk yazını oluşturmak için yukarıdaki butona bas.
        </p>
      ) : (
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.audience}>
              <div
                className={`rounded-r-xl border-l-4 py-1 pl-4 ${familyAudienceAccentClass(section.audience)}`}
              >
                <h2 className="font-serif text-xl text-stone-900">{section.title}</h2>
                <p className="mt-1 text-sm text-stone-600">Senin yazdıkların</p>
              </div>

              {section.items.length === 0 ? (
                <p className="mt-4 pl-4 text-sm text-stone-400">Bu bölümde henüz yazın yok.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {section.items.map((message) => (
                    <li key={message.id}>
                      <Link
                        href={`/aile/yaz/${message.id}/duzenle`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 transition hover:border-[#8fa38e] touch-manipulation"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-stone-900">{message.title}</p>
                          <p className="mt-1 text-xs text-stone-500">{formatDate(message.updatedAt)}</p>
                        </div>
                        <span className="shrink-0 text-sm text-[#4a5d49]">Düzenle →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
