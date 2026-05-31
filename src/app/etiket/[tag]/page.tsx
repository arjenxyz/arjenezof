import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { WritingCard } from "@/components/WritingCard";
import { getRelatedTagsForTag } from "@/lib/discovery";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getAllPublishedWritings, getPublishedWritingsByTag } from "@/lib/nodes";
import { getAllTopics } from "@/lib/topics";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `${decodeURIComponent(tag)} — ilgi alanı`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  try {
    const [writings, allWritings, topics] = await Promise.all([
      getPublishedWritingsByTag(decodedTag),
      getAllPublishedWritings(),
      getAllTopics(),
    ]);
    const topicById = new Map(topics.map((topic) => [topic.id, topic.title]));
    const relatedTags = getRelatedTagsForTag(allWritings, decodedTag);

    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center text-sm text-stone-500 transition hover:text-stone-800 touch-manipulation"
          >
            ← Konulara dön
          </Link>

          <section className="mb-8 sm:mb-10">
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-stone-500 sm:mt-6">
              İlgi alanı
            </p>
            <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-4xl">{decodedTag}</h1>
            <p className="mt-3 text-sm text-stone-600">
              Bu etiketle işaretlenmiş metinler — farklı konulardan benzer düşünceler.
            </p>
            {relatedTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedTags.map((item) => (
                  <Link
                    key={item}
                    href={`/etiket/${encodeURIComponent(item)}`}
                    className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600 transition hover:bg-[#eef2ed] hover:text-[#4a5d49]"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}
          </section>

          {writings.length === 0 ? (
            <div className="space-y-3 text-stone-500">
              <p>Bu etiketle henüz metin yok.</p>
              <Link href="/" className="text-sm text-[#4a5d49] hover:underline">
                Konulara göz at →
              </Link>
            </div>
          ) : (
            <ul className="space-y-4 sm:space-y-5">
              {writings.map((writing) => (
                <li key={writing.id}>
                  <WritingCard writing={writing} topicTitle={topicById.get(writing.topicId)} />
                </li>
              ))}
            </ul>
          )}
        </main>
      </>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} />;
  }
}
