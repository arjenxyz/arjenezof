import { Header } from "@/components/Header";
import { SiteIntroText } from "@/components/SiteIntroText";
import { RandomQuote } from "@/components/RandomQuote";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getPublishedQuotes } from "@/lib/quotes";

export const metadata = {
  title: "Hakkında",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  try {
    const quotes = await getPublishedQuotes();

    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
          <h1 className="font-serif text-2xl text-stone-900 sm:text-4xl">Hakkında</h1>
          <SiteIntroText className="mt-5 sm:mt-6" />

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
