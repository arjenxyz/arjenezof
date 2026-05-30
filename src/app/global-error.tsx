"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({ error, reset }: Props) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-[#f7f5f0] font-sans text-stone-800 antialiased">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-12">
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-red-700">Kritik hata</p>
            <h1 className="mt-2 font-serif text-2xl text-stone-900">Site yüklenemedi</h1>
            <p className="mt-4 leading-relaxed text-stone-700">
              Uygulama beklenmeyen bir hatayla karşılaştı. Lütfen sayfayı yenile veya biraz
              sonra tekrar dene.
            </p>
            {error.digest && (
              <p className="mt-3 text-xs text-stone-500">Hata kodu: {error.digest}</p>
            )}
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-lg bg-[#4a5d49] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d4d3c]"
            >
              Tekrar dene
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
