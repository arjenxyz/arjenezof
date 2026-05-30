import { Header } from "@/components/Header";
import { HomeContent } from "@/components/HomeContent";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { countNodes, getPublishedTree } from "@/lib/nodes";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const tree = await getPublishedTree();
    const flatNodes = await prisma.thoughtNode.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
    const total = countNodes(tree);

    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <section className="mb-8 max-w-3xl sm:mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500 sm:text-sm sm:tracking-[0.2em]">
              Akıl denemeleri
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-stone-900 sm:text-4xl">
              Düşüncelerimi şema ve metin olarak paylaşıyorum
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:mt-4 sm:text-base">
              Burada din, tanrı, yaşam, doğa ve varoluş üzerine kendi kendime sorduğum
              soruların izini sürüyorum. Yanlış olabilir, değişebilir — bu yolculuğun
              doğal parçası.
            </p>
            <p className="mt-2 text-xs text-stone-500 sm:text-sm">{total} düşünce düğümü</p>
          </section>

          <HomeContent flatNodes={flatNodes} tree={tree} />
        </main>
        <footer className="border-t border-stone-200/80 px-4 py-6 text-center text-xs text-stone-500 sm:py-8 sm:text-sm">
          © {new Date().getFullYear()} Arjen Esen — Bu düşüncelerde ne?
        </footer>
      </>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} />;
  }
}
