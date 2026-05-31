import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { TopicWritings } from "@/components/TopicWritings";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getPublishedWritingsByTopic } from "@/lib/nodes";
import { getTopicBySlug } from "@/lib/topics";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const topic = await getTopicBySlug(slug);
    if (!topic) return { title: "Konu bulunamadı" };
    return {
      title: topic.title,
      description: topic.description.slice(0, 160),
    };
  } catch {
    return { title: "Konu yüklenemedi" };
  }
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;

  try {
    const topic = await getTopicBySlug(slug);
    if (!topic) notFound();

    const writings = await getPublishedWritingsByTopic(topic.id);
    const parentTitles = Object.fromEntries(writings.map((w) => [w.id, w.title]));

    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <Link
            href="/#konular"
            className="inline-flex min-h-[44px] items-center text-sm text-stone-500 transition hover:text-stone-800 touch-manipulation"
          >
            ← Konulara dön
          </Link>

          <section className="mb-8 max-w-3xl sm:mb-10">
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-stone-500 sm:mt-6 sm:text-sm sm:tracking-[0.2em]">
              Konu
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-stone-900 sm:text-4xl">
              {topic.title}
            </h2>
            {topic.description && (
              <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:mt-4 sm:text-base">
                {topic.description}
              </p>
            )}
            {writings.length > 0 && (
              <p className="mt-2 text-xs text-stone-500 sm:text-sm">{writings.length} metin</p>
            )}
          </section>

          <TopicWritings writings={writings} parentTitles={parentTitles} />

          {writings.length === 0 && (
            <div className="rounded-xl border border-dashed border-stone-300 bg-white p-6 text-center text-sm text-stone-600">
              <p>Bu konuda henüz metin yok.</p>
              <Link href="/#konular" className="mt-3 inline-block text-brand hover:underline">
                Diğer konulara göz at →
              </Link>
            </div>
          )}
        </main>
        <SiteFooter />
      </>
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_NOT_FOUND")) {
      throw error;
    }
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} />;
  }
}
