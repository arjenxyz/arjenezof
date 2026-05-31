import Link from "next/link";

export const metadata = {
  title: "Çevrimdışı",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="max-w-sm text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Bağlantı yok</p>
        <h1 className="mt-3 font-serif text-2xl text-stone-900">Çevrimdışısın</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          İnternet bağlantın gelince sayfayı yenile. Okuduğun metinler daha önce açıldıysa tarayıcı
          önbelleğinde olabilir.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-[#4a5d49] px-5 py-2.5 text-sm font-medium text-white touch-manipulation"
        >
          Ana sayfayı dene
        </Link>
      </div>
    </main>
  );
}
