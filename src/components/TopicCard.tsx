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
      className="group block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-[#8fa38e] hover:shadow-md touch-manipulation sm:p-6"
    >
      <h3 className="font-serif text-xl text-stone-900 group-hover:text-[#4a5d49] sm:text-2xl">
        {topic.title}
      </h3>
      {topic.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600 sm:text-base">
          {topic.description}
        </p>
      )}
      <p className="mt-4 text-xs text-stone-500 sm:text-sm">
        {nodeCount > 0 ? `${nodeCount} düşünce · Şema ve metinler →` : "Oku →"}
      </p>
    </Link>
  );
}
