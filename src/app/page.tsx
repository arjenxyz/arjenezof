import Link from "next/link";
import { Header } from "@/components/Header";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { SiteFooter } from "@/components/SiteFooter";
import { TopicCard } from "@/components/TopicCard";
import { WritingCard } from "@/components/WritingCard";
import { collectTagsFromWritings } from "@/lib/discovery";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getAllPublishedWritings } from "@/lib/nodes";
import { countNodesForTopic, getPublishedTopics } from "@/lib/topics";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const [topics, allWritings] = await Promise.all([
      getPublishedTopics(),
      getAllPublishedWritings(),
    ]);
    const topicsWithCounts = await Promise.all(
      topics.map(async (topic) => ({
        topic,
        nodeCount: await countNodesForTopic(topic.id),
      })),
    );
    const interestTags = collectTagsFromWritings(allWritings).slice(0, 12);
    const recentWritings = allWritings.slice(0, 5);

    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <section className="mb-8 max-w-3xl sm:mb-10">
            <h2 className="font-serif text-2xl leading-tight text-stone-900 sm:text-3xl">
              Hoş geldin.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
              Son yazılara göz at, bir konu veya etiket seç — ya da aşağıdaki butonlarla hemen
              başla.
            </p>
            {allWritings.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3 sm:mt-6">
                <Link
                  href="/rastgele"
                  className="rounded-lg bg-[#4a5d49] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d4d3c] touch-manipulation"
                >
                  Rastgele oku
                </Link>
                <Link
                  href="/ara"
                  className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50 touch-manipulation"
                >
                  Metinlerde ara
                </Link>
              </div>
            )}
          </section>

          {recentWritings.length > 0 && (
            <section className="mb-12">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-serif text-xl text-stone-900 sm:text-2xl">Son yazılar</h3>
                  <p className="mt-1 text-sm text-stone-500">En son eklenen metinler</p>
                </div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                  {recentWritings.length} yazı
                </span>
              </div>
              <ul className="space-y-4">
                {recentWritings.map((writing) => (
                  <li key={writing.id}>
                    <WritingCard
                      writing={writing}
                      topicTitle={
                        topicsWithCounts.find(({ topic }) => topic.id === writing.topicId)?.topic
                          .title
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {interestTags.length > 0 && (
            <section className="mb-10">
              <div className="mb-4 border-b border-stone-200 pb-4">
                <h3 className="font-serif text-xl text-stone-900 sm:text-2xl">Etiketler</h3>
                <p className="mt-1 text-sm text-stone-500">İlgi alanına göre keşfet</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {interestTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/etiket/${encodeURIComponent(tag)}`}
                    className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700 transition hover:bg-[#eef2ed] hover:text-[#4a5d49] touch-manipulation"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {topicsWithCounts.length === 0 ? (
            <p className="text-stone-500">Henüz yayınlanmış konu yok.</p>
          ) : (
            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-serif text-xl text-stone-900 sm:text-2xl">Konular</h3>
                  <p className="mt-1 text-sm text-stone-500">Konuya göre metinlere göz at</p>
                </div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                  {topicsWithCounts.length} konu
                </span>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {topicsWithCounts.map(({ topic, nodeCount }) => (
                  <li key={topic.id} className="flex">
                    <TopicCard topic={topic} nodeCount={nodeCount} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
        <SiteFooter />
      </>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} />;
  }
}
