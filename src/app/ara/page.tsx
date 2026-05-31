import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { WritingCard } from "@/components/WritingCard";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { searchPublishedWritings } from "@/lib/nodes";
import { getAllTopics } from "@/lib/topics";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  if (!q?.trim()) return { title: "Ara" };
  return { title: `"${q.trim()}" için arama` };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  try {
    const [results, topics] = await Promise.all([
      query ? searchPublishedWritings(query) : Promise.resolve([]),
      getAllTopics(),
    ]);
    const topicById = new Map(topics.map((topic) => [topic.id, topic.title]));

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
            <h1 className="mt-4 font-serif text-2xl text-stone-900 sm:mt-6 sm:text-4xl">Ara</h1>
            <form action="/ara" method="get" className="mt-4">
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Başlık, metin veya etiket…"
                className="w-full rounded-lg border border-stone-300 px-3 py-3 text-base text-stone-900 outline-none focus:border-[#6b7f6a] sm:py-2 sm:text-sm"
              />
            </form>
          </section>

          {!query ? (
            <p className="text-stone-500">Aramak istediğin kelimeyi yaz.</p>
          ) : results.length === 0 ? (
            <div className="space-y-3 text-stone-500">
              <p>Sonuç bulunamadı.</p>
              <Link href="/" className="text-sm text-[#4a5d49] hover:underline">
                Konulara göz at →
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-stone-600">{results.length} sonuç</p>
              <ul className="space-y-4 sm:space-y-5">
                {results.map((writing) => (
                  <li key={writing.id}>
                    <WritingCard
                      writing={writing}
                      topicTitle={topicById.get(writing.topicId)}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>
      </>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} />;
  }
}
