import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { Header } from "@/components/Header";
import { RelatedWritingsSection } from "@/components/RelatedWritingsSection";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { estimateReadingMinutes, formatDate, getNodeBySlug, parseTags } from "@/lib/nodes";
import { siteUrl } from "@/lib/site";
import { getAllTopics, getTopicById } from "@/lib/topics";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const node = await getNodeBySlug(slug);
    if (!node) return { title: "Metin bulunamadı" };

    const description = node.content.slice(0, 160);
    const url = `${siteUrl()}/dusunce/${slug}`;

    return {
      title: node.title,
      description,
      openGraph: {
        title: node.title,
        description,
        url,
        type: "article",
        locale: "tr_TR",
      },
      twitter: {
        card: "summary",
        title: node.title,
        description,
      },
    };
  } catch {
    return { title: "Metin yüklenemedi" };
  }
}

export default async function WritingDetailPage({ params }: Props) {
  const { slug } = await params;

  try {
    const node = await getNodeBySlug(slug);
    if (!node) notFound();

    const [topic, topics] = await Promise.all([getTopicById(node.topicId), getAllTopics()]);
    const topicTitles = Object.fromEntries(topics.map((item) => [item.id, item.title]));
    const tags = parseTags(node.tags);
    const readingMinutes = estimateReadingMinutes(node.content);
    const pageUrl = `${siteUrl()}/dusunce/${slug}`;

    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-500">
            <Link href="/" className="transition hover:text-stone-800 touch-manipulation">
              Konular
            </Link>
            {topic && (
              <>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/konu/${topic.slug}`}
                  className="transition hover:text-stone-800 touch-manipulation"
                >
                  {topic.title}
                </Link>
              </>
            )}
          </nav>

          {node.continuesFrom && (
            <p className="mt-4 text-sm text-stone-600 sm:mt-6">
              Bu metin{" "}
              <Link
                href={`/dusunce/${node.continuesFrom.slug}`}
                className="font-medium text-[#4a5d49] hover:underline"
              >
                {node.continuesFrom.title}
              </Link>{" "}
              metninin devamıdır.
            </p>
          )}

          <h1 className="mt-3 font-serif text-2xl leading-tight text-stone-900 sm:mt-4 sm:text-4xl">
            {node.title}
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            Son güncelleme: {formatDate(node.updatedAt)} · ~{readingMinutes} dk okuma
          </p>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/etiket/${encodeURIComponent(tag)}`}
                  className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600 transition hover:bg-[#eef2ed] hover:text-[#4a5d49]"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <article className="prose-thought mt-6 rounded-xl border border-stone-200 bg-white p-4 text-stone-700 shadow-sm sm:mt-8 sm:p-6">
            {node.content}
          </article>

          {node.continuations.length > 0 && (
            <RelatedWritingsSection title="Devamı" writings={node.continuations} />
          )}

          <div className="mt-6">
            <CopyLinkButton url={pageUrl} />
          </div>

          {node.relatedWritings.length > 0 && (
            <RelatedWritingsSection
              title="Benzer okumalar"
              writings={node.relatedWritings}
              topicTitles={topicTitles}
            />
          )}
        </main>
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
