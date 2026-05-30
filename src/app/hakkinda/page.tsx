import { Header } from "@/components/Header";

export const metadata = {
  title: "Hakkında",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="font-serif text-2xl text-stone-900 sm:text-4xl">Hakkında</h1>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-stone-700 sm:mt-6 sm:text-base">
          <p>
            <strong>Bu düşüncelerde ne?</strong>, Arjen Esen&apos;in kendi kendine sorduğu
            soruların izini sürdüğü bir akıl denemesi alanıdır. Din, tanrı, yaşam anlayışı,
            çevre, doğa ve varoluş gibi konularda düşüncelerini hem şema hem de detaylı metin
            olarak paylaşır.
          </p>
          <p>
            Buradaki metinler kesin hükümler değildir. Zamanla değişebilir, yanlış olabilir,
            eksik kalabilir — bu, düşünmenin doğal bir parçası olarak kabul edilir.
          </p>
          <p>
            Ziyaretçiler siteyi salt okunur biçimde gezer. Şemadaki tüm dalları görebilir,
            istedikleri düşünceye tıklayarak detayları okuyabilirler.
          </p>
        </div>
      </main>
    </>
  );
}
