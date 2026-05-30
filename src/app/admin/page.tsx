import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { isAuthenticated } from "@/lib/auth";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getAllNodes } from "@/lib/nodes";
import { getAllTopics } from "@/lib/topics";

export default async function AdminDashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  try {
    const [topics, nodes] = await Promise.all([getAllTopics(), getAllNodes()]);
    const topicById = new Map(topics.map((topic) => [topic.id, topic]));

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500 sm:text-sm">
            Yönetim paneli
          </p>
          <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">Düşünce ağacı</h1>
          <p className="mt-2 text-sm text-stone-600">
            İstediğin konuda düşünce yaz. Konu adını sen belirlersin.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-center text-sm text-stone-700 transition hover:bg-stone-50 touch-manipulation sm:flex-none"
          >
            Siteyi gör
          </Link>
          <Link
            href="/admin/topics"
            className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 text-center text-sm text-stone-700 transition hover:bg-stone-50 touch-manipulation sm:flex-none"
          >
            Konular
          </Link>
          <Link
            href="/admin/nodes/new"
            className="flex-1 rounded-lg bg-[#4a5d49] px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-[#3d4d3c] touch-manipulation sm:flex-none"
          >
            + Yeni düşünce
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      <div className="mt-6 space-y-3 md:hidden">
        {nodes.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
            Henüz düşünce yok. İlk düşünceni ekle.
          </div>
        ) : (
          nodes.map((node) => (
            <article
              key={node.id}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-stone-500">
                    {topicById.get(node.topicId)?.title ?? "—"}
                  </p>
                  <p className="font-medium text-stone-900">{node.title}</p>
                  {node.branchQuestion && (
                    <p className="mt-1 text-xs text-stone-500">→ {node.branchQuestion}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                    node.published
                      ? "bg-green-50 text-green-700"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {node.published ? "Yayında" : "Taslak"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-stone-600">Dal: {node.branchLabel || "—"}</span>
                <Link
                  href={`/admin/nodes/${node.id}/edit`}
                  className="rounded-lg bg-stone-100 px-3 py-1.5 font-medium text-[#4a5d49] touch-manipulation"
                >
                  Düzenle
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="mt-8 hidden overflow-x-auto rounded-xl border border-stone-200 bg-white md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">Konu</th>
              <th className="px-4 py-3 font-medium">Başlık</th>
              <th className="px-4 py-3 font-medium">Dal</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {nodes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                  Henüz düşünce yok. İlk düşünceni ekle.
                </td>
              </tr>
            ) : (
              nodes.map((node) => (
                <tr key={node.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-3 text-stone-600">
                    {topicById.get(node.topicId)?.title ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-900">{node.title}</p>
                    {node.branchQuestion && (
                      <p className="mt-1 text-xs text-stone-500">→ {node.branchQuestion}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{node.branchLabel || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        node.published
                          ? "bg-green-50 text-green-700"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {node.published ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/nodes/${node.id}/edit`}
                      className="text-[#4a5d49] hover:underline"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {nodes.length > 0 && (
        <p className="mt-4 text-xs text-stone-500">
          Toplam {nodes.length} düğüm, {topics.length} konu. Konu silindiğinde içindeki tüm
          düşünceler de kaldırılır.
        </p>
      )}
    </main>
  );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} showHomeLink={false} />;
  }
}
