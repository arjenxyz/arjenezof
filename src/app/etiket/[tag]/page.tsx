import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { WritingCard } from "@/components/WritingCard";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getPublishedWritingsByTag } from "@/lib/nodes";

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
    const writings = await getPublishedWritingsByTag(decodedTag);

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
          </section>

          {writings.length === 0 ? (
            <p className="text-stone-500">Bu etiketle henüz metin yok.</p>
          ) : (
            <ul className="space-y-4 sm:space-y-5">
              {writings.map((writing) => (
                <li key={writing.id}>
                  <WritingCard writing={writing} />
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
