import Link from "next/link";
import { Header } from "@/components/Header";

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-stone-500">404</p>
          <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">
            Sayfa bulunamadı
          </h1>
          <p className="mt-4 leading-relaxed text-stone-700">
            Aradığın sayfa mevcut değil, taşınmış veya silinmiş olabilir.
          </p>
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
        </div>
      </main>
    </>
  );
}
