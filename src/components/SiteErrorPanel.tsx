import Link from "next/link";
import { Header } from "@/components/Header";
import type { SiteErrorContent } from "@/lib/db-errors";

type Props = SiteErrorContent & {
  showHomeLink?: boolean;
};

export function SiteErrorPanel({
  title,
  message,
  hint,
  showHomeLink = true,
}: Props) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-red-700">Bir hata oluştu</p>
          <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">{title}</h1>
          <p className="mt-4 leading-relaxed text-stone-700">{message}</p>
          {hint && (
            <p className="mt-3 rounded-lg bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-600">
              {hint}
            </p>
          )}
          {showHomeLink && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-lg bg-[#4a5d49] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d4d3c] touch-manipulation"
              >
                Ana sayfaya dön
              </Link>
              <Link
                href="/hakkinda"
                className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50 touch-manipulation"
              >
                Hakkında
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
