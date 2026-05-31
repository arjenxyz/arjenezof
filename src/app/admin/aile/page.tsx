import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { AdminFamilyPasswordForm } from "@/components/AdminFamilyPasswordForm";
import { FamilyAudienceBadge } from "@/components/FamilyAudienceBadge";
import { SiteErrorPanel } from "@/components/SiteErrorPanel";
import { isAuthenticated } from "@/lib/auth";
import { getDatabaseErrorMessage } from "@/lib/db-errors";
import { getAllFamilyMessages, getFamilyCredentialMeta } from "@/lib/family";
import { FAMILY_AUDIENCES, FAMILY_LABELS } from "@/lib/family-shared";

export const dynamic = "force-dynamic";

export default async function AdminFamilyPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  try {
    const [messages, credentials] = await Promise.all([
      getAllFamilyMessages(),
      getFamilyCredentialMeta(),
    ]);

    const grouped = FAMILY_AUDIENCES.map((audience) => ({
      audience,
      items: messages.filter((message) => message.audience === audience),
    }));

    return (
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/admin" className="text-sm text-stone-500 hover:text-stone-800">
              ← Panele dön
            </Link>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-500">Aile alanı</p>
            <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">Aile yönetimi</h1>
            <p className="mt-2 text-sm text-stone-600">
              Metinleri gruba göre ayır; şifreleri buradan güncelle. Her şifre farklı olmalı.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/aile/new"
              className="rounded-lg bg-[#4a5d49] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3d4d3c]"
            >
              + Yeni aile metni
            </Link>
            <AdminLogoutButton />
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section className="space-y-6">
            <h2 className="font-serif text-xl text-stone-900">Metinler</h2>
            {grouped.map(({ audience, items }) => (
              <div key={audience} className="rounded-xl border border-stone-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <FamilyAudienceBadge audience={audience} />
                  <span className="text-sm text-stone-600">{items.length} metin</span>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-stone-500">
                    Henüz {FAMILY_LABELS[audience].toLowerCase()} için metin yok.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {items.map((message) => (
                      <li key={message.id}>
                        <Link
                          href={`/admin/aile/${message.id}/edit`}
                          className="block rounded-lg border border-stone-100 px-3 py-2 hover:border-[#8fa38e] hover:bg-stone-50"
                        >
                          <span className="font-medium text-stone-900">{message.title}</span>
                          {!message.published && (
                            <span className="ml-2 text-xs text-stone-500">(taslak)</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>

          <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6">
            <h2 className="font-serif text-xl text-stone-900">Aile şifreleri</h2>
            <div className="mt-4">
              <AdminFamilyPasswordForm
                credentials={credentials.map((item) => ({
                  role: item.role,
                  updatedAt: item.updatedAt.toISOString(),
                }))}
              />
            </div>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    const content = getDatabaseErrorMessage(error);
    return <SiteErrorPanel {...content} showHomeLink={false} />;
  }
}
