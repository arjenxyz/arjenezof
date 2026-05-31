import Link from "next/link";
import { Header } from "@/components/Header";
import { SiteIntroText } from "@/components/SiteIntroText";
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
            <SiteIntroText />
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
            <section className="mb-10">
              <h3 className="mb-4 font-serif text-xl text-stone-900 sm:text-2xl">Son yazılar</h3>
              <ul className="space-y-4 sm:space-y-5">
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
            <section className="mb-8">
              <p className="mb-3 text-xs uppercase tracking-[0.15em] text-stone-500">
                İlgi alanlarına göre keşfet
              </p>
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
            <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {topicsWithCounts.map(({ topic, nodeCount }) => (
                <li key={topic.id}>
                  <TopicCard topic={topic} nodeCount={nodeCount} />
                </li>
              ))}
            </ul>
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
