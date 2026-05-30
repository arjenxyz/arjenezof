import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { isAuthenticated } from "@/lib/auth";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getAllQuotes } from "@/lib/quotes";

export default async function AdminQuotesPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  try {
    const quotes = await getAllQuotes();

    return (
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/admin" className="text-sm text-stone-500 hover:text-stone-800">
              ← Panele dön
            </Link>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-500 sm:text-sm">
              Sözler
            </p>
            <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">Hakkında sözleri</h1>
            <p className="mt-2 text-sm text-stone-600">
              Hakkında sayfasının altında rastgele dönen sözler.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              href="/hakkinda"
              className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-center text-sm text-stone-700 transition hover:bg-stone-50 touch-manipulation sm:flex-none"
            >
              Hakkında
            </Link>
            <Link
              href="/admin/quotes/new"
              className="flex-1 rounded-lg bg-[#4a5d49] px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-[#3d4d3c] touch-manipulation sm:flex-none"
            >
              + Yeni söz
            </Link>
            <AdminLogoutButton />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {quotes.length === 0 ? (
            <div className="rounded-xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
              Henüz söz yok. İlk sözünü ekle.
            </div>
          ) : (
            quotes.map((quote) => (
              <article
                key={quote.id}
                className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-stone-900">“{quote.text}”</p>
                    {quote.author && (
                      <p className="mt-2 text-sm text-stone-500">— {quote.author}</p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                      quote.published
                        ? "bg-green-50 text-green-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {quote.published ? "Yayında" : "Taslak"}
                  </span>
                </div>
                <div className="mt-3 text-right">
                  <Link
                    href={`/admin/quotes/${quote.id}/edit`}
                    className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-medium text-[#4a5d49] touch-manipulation"
                  >
                    Düzenle
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} showHomeLink={false} />;
  }
}
