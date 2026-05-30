"use client";

import { useMemo, useState } from "react";
import { WritingCard } from "@/components/WritingCard";
import { collectTagsFromWritings, writingMatchesTag } from "@/lib/discovery";
import type { ThoughtNodeRecord } from "@/lib/nodes-shared";

type Props = {
  writings: ThoughtNodeRecord[];
};

export function TopicWritings({ writings }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const tags = useMemo(() => collectTagsFromWritings(writings), [writings]);

  const filtered = useMemo(() => {
    if (!activeTag) return writings;
    return writings.filter((writing) => writingMatchesTag(writing, activeTag));
  }, [writings, activeTag]);

  if (writings.length === 0) {
    return null;
  }

  return (
    <section>
      {tags.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-xs uppercase tracking-[0.15em] text-stone-500">İlgi alanları</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`rounded-full px-3 py-1.5 text-sm transition touch-manipulation ${
                activeTag === null
                  ? "bg-[#4a5d49] text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Tümü
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full px-3 py-1.5 text-sm transition touch-manipulation ${
                  activeTag === tag
                    ? "bg-[#4a5d49] text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Etiketlere göre filtrele veya farklı konulardaki benzer metinleri etiket sayfalarından keşfet.
          </p>
        </div>
      )}

      <ul className="space-y-4 sm:space-y-5">
        {filtered.map((writing) => (
          <li key={writing.id}>
            <WritingCard writing={writing} />
          </li>
        ))}
      </ul>
    </section>
  );
}
