import Link from "next/link";
import type { ThoughtNodeRecord } from "@/lib/nodes-shared";

type Props = {
  title: string;
  writings: ThoughtNodeRecord[];
};

export function RelatedWritingsSection({ title, writings }: Props) {
  if (writings.length === 0) return null;

  return (
    <section className="mt-8 sm:mt-10">
      <h2 className="font-serif text-xl text-stone-900 sm:text-2xl">{title}</h2>
      <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
        {writings.map((writing) => (
          <li key={writing.id}>
            <Link
              href={`/dusunce/${writing.slug}`}
              className="block rounded-lg border border-stone-200 bg-white px-3 py-3 transition hover:border-[#8fa38e] touch-manipulation sm:px-4"
            >
              <span className="font-medium text-stone-900">{writing.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
