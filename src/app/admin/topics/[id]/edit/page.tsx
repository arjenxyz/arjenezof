import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminTopicForm } from "@/components/AdminTopicForm";
import { isAuthenticated } from "@/lib/auth";
import { getTopicById } from "@/lib/topics";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditTopicPage({ params }: Props) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const { id } = await params;
  const topic = await getTopicById(id);
  if (!topic) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        href="/admin/topics"
        className="inline-flex min-h-[44px] items-center text-sm text-stone-500 hover:text-stone-800 touch-manipulation"
      >
        ← Konulara dön
      </Link>
      <h1 className="mt-3 font-serif text-2xl text-stone-900 sm:mt-4 sm:text-3xl">Konuyu düzenle</h1>
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
        <AdminTopicForm
          initial={{
            id: topic.id,
            title: topic.title,
            description: topic.description,
            sortOrder: topic.sortOrder,
            published: topic.published,
          }}
        />
      </div>
    </main>
  );
}
