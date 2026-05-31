import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminFamilyMessageForm } from "@/components/AdminFamilyMessageForm";
import { isAuthenticated } from "@/lib/auth";
import { getFamilyMessageById } from "@/lib/family";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditFamilyMessagePage({ params }: Props) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const { id } = await params;
  const message = await getFamilyMessageById(id);
  if (!message) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <Link href="/admin/aile" className="text-sm text-stone-500 hover:text-stone-800">
        ← Aile yönetimine dön
      </Link>
      <h1 className="mt-3 font-serif text-2xl text-stone-900 sm:text-3xl">Aile metnini düzenle</h1>
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <AdminFamilyMessageForm
          initial={{
            id: message.id,
            title: message.title,
            content: message.content,
            audience: message.audience,
            sortOrder: message.sortOrder,
            published: message.published,
          }}
        />
      </div>
    </main>
  );
}
