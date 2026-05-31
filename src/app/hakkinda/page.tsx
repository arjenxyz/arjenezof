import Link from "next/link";
import { Header } from "@/components/Header";
import { RandomQuote } from "@/components/RandomQuote";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { collectTagsFromWritings } from "@/lib/discovery";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getAllPublishedWritings } from "@/lib/nodes";
import { getPublishedQuotes } from "@/lib/quotes";
import { getPublishedTopics } from "@/lib/topics";

export const metadata = {
  title: "Hakkında",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  try {
    const [quotes, topics, writings] = await Promise.all([
      getPublishedQuotes(),
      getPublishedTopics(),
      getAllPublishedWritings(),
    ]);
    const starterTags = collectTagsFromWritings(writings).slice(0, 5);
    const starterTopics = topics.slice(0, 3);

    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
          <h1 className="font-serif text-2xl text-stone-900 sm:text-4xl">Hakkında</h1>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-stone-700 sm:mt-6 sm:text-base">
            <p>
              <strong>Bu düşüncelerde ne?</strong>, Arjen&apos;in kendi kendine sorduğu
              soruların ve akıl denemelerinin paylaşıldığı kişisel bir yazı alanıdır. Buradaki
              metinler kesin hükümler değildir; zamanla değişebilir, yanlış olabilir, eksik
              kalabilir.
            </p>
            <p>
              Konulara, etiketlere ve metinler arası bağlantılara göre gezinebilirsin. Bir metnin
              devamını okuyabilir veya ilgi alanına göre benzer yazılara geçebilirsin.
            </p>
          </div>

          {(starterTopics.length > 0 || starterTags.length > 0) && (
            <section className="mt-8 rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
              <h2 className="font-serif text-lg text-stone-900 sm:text-xl">Nereden başlamalı?</h2>
              {starterTopics.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-stone-500">Konular</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {starterTopics.map((topic) => (
                      <li key={topic.id}>
                        <Link
                          href={`/konu/${topic.slug}`}
                          className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700 transition hover:bg-[#eef2ed] hover:text-[#4a5d49]"
                        >
                          {topic.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {starterTags.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-stone-500">Etiketler</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {starterTags.map((tag) => (
                      <li key={tag}>
                        <Link
                          href={`/etiket/${encodeURIComponent(tag)}`}
                          className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700 transition hover:bg-[#eef2ed] hover:text-[#4a5d49]"
                        >
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {writings.length > 0 && (
                <p className="mt-4">
                  <Link href="/rastgele" className="text-sm font-medium text-[#4a5d49] hover:underline">
                    Ya da rastgele bir metinle başla →
                  </Link>
                </p>
              )}
            </section>
          )}

          <RandomQuote
            quotes={quotes.map((quote) => ({
              id: quote.id,
              text: quote.text,
              author: quote.author,
            }))}
          />
        </main>
      </>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} />;
  }
}
