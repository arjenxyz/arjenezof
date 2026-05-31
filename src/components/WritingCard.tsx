import Link from "next/link";
import type { ThoughtNodeRecord } from "@/lib/nodes-shared";
import {
  estimateReadingMinutes,
  formatDate,
  parseTags,
  writingPreviewText,
} from "@/lib/nodes-shared";

type Props = {
  writing: ThoughtNodeRecord;
  topicTitle?: string;
  continuesFromTitle?: string;
};

export function WritingCard({ writing, topicTitle, continuesFromTitle }: Props) {
  const tags = parseTags(writing.tags);
  const readingMinutes = estimateReadingMinutes(writing.content);
  const preview = writingPreviewText(writing.content);

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 border-l-[3px] border-l-brand-accent bg-white shadow-sm transition hover:border-brand-accent hover:shadow-md">
      <Link href={`/dusunce/${writing.slug}`} className="block touch-manipulation">
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {continuesFromTitle && (
              <span className="inline-flex rounded-full bg-brand-muted px-2.5 py-0.5 text-[11px] font-medium text-brand ring-1 ring-inset ring-brand-accent/40">
                {continuesFromTitle} · devam
              </span>
            )}
            {topicTitle && (
              <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-700 ring-1 ring-inset ring-stone-200">
                {topicTitle}
              </span>
            )}
            <span className="ml-auto text-[11px] text-stone-400">~{readingMinutes} dk</span>
          </div>

          <h3 className="mt-3 font-serif text-lg leading-snug text-stone-900 transition group-hover:text-brand sm:text-xl">
            {writing.title}
          </h3>

          {preview && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">{preview}</p>
          )}

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-stone-50 px-2 py-0.5 text-[11px] text-stone-500 ring-1 ring-stone-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/80 px-4 py-3 sm:px-5">
          <p className="text-xs text-stone-500">{formatDate(writing.updatedAt)}</p>
          <span className="shrink-0 text-sm font-medium text-brand opacity-90 transition group-hover:opacity-100">
            Oku →
          </span>
        </div>
      </Link>
    </article>
  );
}
