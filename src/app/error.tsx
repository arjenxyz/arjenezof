"use client";

import { useEffect } from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-red-700">Bir hata oluştu</p>
        <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">
          Sayfa yüklenemedi
        </h1>
        <p className="mt-4 leading-relaxed text-stone-700">
          Beklenmeyen bir sorun oluştu ve bu sayfa şu an gösterilemiyor. Lütfen tekrar
          dene veya ana sayfaya dön.
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-stone-500">Hata kodu: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-[#4a5d49] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d4d3c] touch-manipulation"
          >
            Tekrar dene
          </button>
          <Link
            href="/"
            className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50 touch-manipulation"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </main>
  );
}
