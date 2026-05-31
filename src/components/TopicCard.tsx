import Link from "next/link";
import type { TopicRecord } from "@/lib/topics";

type Props = {
  topic: TopicRecord;
  nodeCount: number;
};

export function TopicCard({ topic, nodeCount }: Props) {
  return (
    <Link
      href={`/konu/${topic.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 border-l-[3px] border-l-sky-300 bg-white shadow-sm transition hover:border-[#8fa38e] hover:shadow-md touch-manipulation"
    >
      <div className="flex-1 p-5 sm:p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">Konu</p>
        <h3 className="mt-2 font-serif text-xl leading-snug text-stone-900 transition group-hover:text-[#4a5d49] sm:text-2xl">
          {topic.title}
        </h3>
        {topic.description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            {topic.description}
          </p>
        ) : (
          <p className="mt-3 text-sm text-stone-400">Bu konudaki metinleri görüntüle.</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/80 px-5 py-3 sm:px-6">
        <p className="text-xs text-stone-500">
          {nodeCount > 0 ? `${nodeCount} metin` : "Henüz metin yok"}
        </p>
        <span className="shrink-0 text-sm font-medium text-[#4a5d49] opacity-90 transition group-hover:opacity-100">
          {nodeCount > 0 ? "Konuya git →" : "Aç →"}
        </span>
      </div>
    </Link>
  );
}
