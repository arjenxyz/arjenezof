import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { RelatedWritingsSection } from "@/components/RelatedWritingsSection";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { formatDate, getNodeBySlug, parseTags } from "@/lib/nodes";
import { getTopicById } from "@/lib/topics";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const node = await getNodeBySlug(slug);
    if (!node) return { title: "Metin bulunamadı" };
    return {
      title: node.title,
      description: node.content.slice(0, 160),
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

    const topic = await getTopicById(node.topicId);
    const tags = parseTags(node.tags);

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

          <h1 className="mt-4 font-serif text-2xl leading-tight text-stone-900 sm:mt-6 sm:text-4xl">
            {node.title}
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            Son güncelleme: {formatDate(node.updatedAt)}
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

          {node.continuesFrom && (
            <RelatedWritingsSection title="Önceki metin" writings={[node.continuesFrom]} />
          )}

          {node.continuations.length > 0 && (
            <RelatedWritingsSection title="Devamı" writings={node.continuations} />
          )}

          {node.relatedWritings.length > 0 && (
            <RelatedWritingsSection title="Benzer okumalar" writings={node.relatedWritings} />
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
