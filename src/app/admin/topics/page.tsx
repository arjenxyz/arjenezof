import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { isAuthenticated } from "@/lib/auth";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getAllNodes } from "@/lib/nodes";
import { getAllTopics } from "@/lib/topics";

export default async function AdminTopicsPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  try {
    const topics = await getAllTopics();
    const nodes = await getAllNodes();
    const nodeCountByTopic = new Map<string, number>();
    for (const node of nodes) {
      nodeCountByTopic.set(node.topicId, (nodeCountByTopic.get(node.topicId) ?? 0) + 1);
    }

    return (
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/admin" className="text-sm text-stone-500 hover:text-stone-800">
              ← Panele dön
            </Link>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-500 sm:text-sm">
              Konular
            </p>
            <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">Konu yönetimi</h1>
            <p className="mt-2 text-sm text-stone-600">
              Her konunun kendi açıklama metni ve düşünce ağacı vardır.
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
              href="/admin/topics/new"
              className="flex-1 rounded-lg bg-[#4a5d49] px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-[#3d4d3c] touch-manipulation sm:flex-none"
            >
              + Yeni konu
            </Link>
            <AdminLogoutButton />
          </div>
        </div>

        <div className="mt-6 space-y-3 md:hidden">
          {topics.length === 0 ? (
            <div className="rounded-xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
              Henüz konu yok. İlk konunu ekle.
            </div>
          ) : (
            topics.map((topic) => (
              <article
                key={topic.id}
                className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-stone-900">{topic.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-stone-500">{topic.description}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                      topic.published
                        ? "bg-green-50 text-green-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {topic.published ? "Yayında" : "Taslak"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-stone-600">
                    {nodeCountByTopic.get(topic.id) ?? 0} düşünce
                  </span>
                  <Link
                    href={`/admin/topics/${topic.id}/edit`}
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
                <th className="px-4 py-3 font-medium">Düşünce</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {topics.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                    Henüz konu yok. İlk konunu ekle.
                  </td>
                </tr>
              ) : (
                topics.map((topic) => (
                  <tr key={topic.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">{topic.title}</p>
                      <p className="mt-1 max-w-md truncate text-xs text-stone-500">
                        {topic.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {nodeCountByTopic.get(topic.id) ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          topic.published
                            ? "bg-green-50 text-green-700"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {topic.published ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/topics/${topic.id}/edit`}
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
      </main>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} showHomeLink={false} />;
  }
}
