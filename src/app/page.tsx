import { Header } from "@/components/Header";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { TopicCard } from "@/components/TopicCard";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { countNodesForTopic, getPublishedTopics } from "@/lib/topics";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const topics = await getPublishedTopics();
    const topicsWithCounts = await Promise.all(
      topics.map(async (topic) => ({
        topic,
        nodeCount: await countNodesForTopic(topic.id),
      })),
    );

    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <section className="mb-8 max-w-3xl sm:mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500 sm:text-sm sm:tracking-[0.2em]">
              Akıl denemeleri
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-stone-900 sm:text-4xl">
              Konular
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:mt-4 sm:text-base">
              Her konunun kendi şeması ve metinleri var. Konuları sen belirlersin — din, kuşlar,
              uçmak, kahve… aklına gelen her şey.
            </p>
          </section>

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
        <footer className="border-t border-stone-200/80 px-4 py-6 text-center text-xs text-stone-500 sm:py-8 sm:text-sm">
          © {new Date().getFullYear()} Arjen Esen — Bu düşüncelerde ne?
        </footer>
      </>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} />;
  }
}
