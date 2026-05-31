import Link from "next/link";
import { Header } from "@/components/Header";
import { PageSection } from "@/components/PageSection";
import { SiteButtonLink } from "@/components/SiteButton";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { SiteFooter } from "@/components/SiteFooter";
import { TopicCard } from "@/components/TopicCard";
import { WritingCard } from "@/components/WritingCard";
import { collectTagsFromWritings } from "@/lib/discovery";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getAllPublishedWritings } from "@/lib/nodes";
import { pickHomeFeaturedWritings } from "@/lib/nodes-shared";
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
    const recentWritings = pickHomeFeaturedWritings(allWritings, 5);

    return (
      <>
        <Header />
        <main className="page-main mx-auto max-w-5xl">
          <section className="mb-10 max-w-2xl">
            <h1 className="font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">
              Hoş geldin.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-600">
              Son yazılara göz at, bir konu veya etiket seç — ya da aşağıdaki butonlarla hemen
              başla.
            </p>
            {allWritings.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                <SiteButtonLink href="/rastgele">Rastgele oku</SiteButtonLink>
                <SiteButtonLink href="/ara" variant="secondary">
                  Metinlerde ara
                </SiteButtonLink>
              </div>
            )}
          </section>

          {recentWritings.length > 0 && (
            <PageSection
              title="Son yazılar"
              description="En son eklenen metinler"
              badge={`${recentWritings.length} yazı`}
              className="mb-12"
            >
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
            </PageSection>
          )}

          {interestTags.length > 0 && (
            <PageSection
              title="Etiketler"
              description="İlgi alanına göre keşfet"
              className="mb-10"
            >
              <div className="flex flex-wrap gap-2">
                {interestTags.map((tag) => (
                  <Link key={tag} href={`/etiket/${encodeURIComponent(tag)}`} className="tag-pill">
                    {tag}
                  </Link>
                ))}
              </div>
            </PageSection>
          )}

          {topicsWithCounts.length === 0 ? (
            <p className="text-stone-500">Henüz yayınlanmış konu yok.</p>
          ) : (
            <PageSection
              id="konular"
              title="Konular"
              description="Konuya göre metinlere göz at"
              badge={`${topicsWithCounts.length} konu`}
            >
              <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {topicsWithCounts.map(({ topic, nodeCount }) => (
                  <li key={topic.id} className="flex">
                    <TopicCard topic={topic} nodeCount={nodeCount} />
                  </li>
                ))}
              </ul>
            </PageSection>
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
