import Link from "next/link";
import type { ThoughtNodeRecord } from "@/lib/nodes-shared";
import { estimateReadingMinutes, formatDate, parseTags } from "@/lib/nodes-shared";

type Props = {
  writing: ThoughtNodeRecord;
  topicTitle?: string;
  continuesFromTitle?: string;
};

export function WritingCard({ writing, topicTitle, continuesFromTitle }: Props) {
  const tags = parseTags(writing.tags);
  const readingMinutes = estimateReadingMinutes(writing.content);

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-[#8fa38e] hover:shadow-md sm:p-5">
      {continuesFromTitle && (
        <p className="mb-2 text-xs font-medium text-[#4a5d49]">
          {continuesFromTitle} metninin devamı
        </p>
      )}
      <Link href={`/dusunce/${writing.slug}`} className="group block touch-manipulation">
        <h3 className="font-serif text-lg leading-snug text-stone-900 group-hover:text-[#4a5d49] sm:text-xl">
          {writing.title}
        </h3>
        <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-stone-600">{writing.content}</p>
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500">
        {topicTitle && <span className="text-stone-600">{topicTitle}</span>}
        <span>{formatDate(writing.updatedAt)}</span>
        <span>· ~{readingMinutes} dk</span>
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/etiket/${encodeURIComponent(tag)}`}
            className="inline-flex min-h-[32px] items-center rounded-full bg-stone-100 px-2.5 py-1 text-stone-600 transition hover:bg-[#eef2ed] hover:text-[#4a5d49] touch-manipulation"
          >
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
}
