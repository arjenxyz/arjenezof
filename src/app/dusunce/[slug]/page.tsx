import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
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
    if (!node) return { title: "Düşünce bulunamadı" };
    return {
      title: node.title,
      description: node.content.slice(0, 160),
    };
  } catch {
    return { title: "Düşünce yüklenemedi" };
  }
}

export default async function ThoughtDetailPage({ params }: Props) {
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

        {node.branchLabel && (
          <span className="mt-4 inline-block rounded-full bg-[#eef2ed] px-3 py-1 text-xs font-medium text-[#4a5d49] sm:mt-6">
            Dal: {node.branchLabel}
          </span>
        )}

        <h1 className="mt-3 font-serif text-2xl leading-tight text-stone-900 sm:mt-4 sm:text-4xl">
          {node.title}
        </h1>

        <p className="mt-3 text-sm text-stone-500">
          Son güncelleme: {formatDate(node.updatedAt)}
        </p>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <article className="prose-thought mt-6 rounded-xl border border-stone-200 bg-white p-4 text-stone-700 shadow-sm sm:mt-8 sm:p-6">
          {node.content}
        </article>

        {node.branchQuestion && (
          <div className="mt-5 rounded-xl border border-dashed border-[#8fa38e] bg-[#eef2ed]/50 p-4 sm:mt-6 sm:p-5">
            <p className="text-sm font-medium text-[#4a5d49]">Sonraki soru</p>
            <p className="mt-1 font-serif text-lg text-stone-900 sm:text-xl">{node.branchQuestion}</p>
            <p className="mt-2 text-sm text-stone-600">
              Bu soruya verilen farklı cevaplar şemada ayrı dallara ayrılır.
            </p>
          </div>
        )}

        {node.children.length > 0 && (
          <section className="mt-8 sm:mt-10">
            <h2 className="font-serif text-xl text-stone-900 sm:text-2xl">Devam eden dallar</h2>
            <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
              {node.children.map((child) => (
                <li key={child.id}>
                  <Link
                    href={`/dusunce/${child.slug}`}
                    className="block rounded-lg border border-stone-200 bg-white px-3 py-3 transition hover:border-[#8fa38e] touch-manipulation sm:px-4"
                  >
                    {child.branchLabel && (
                      <span className="text-xs font-medium text-[#4a5d49]">
                        {child.branchLabel} →{" "}
                      </span>
                    )}
                    <span className="font-medium text-stone-900">{child.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
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
