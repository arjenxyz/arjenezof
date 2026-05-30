import { redirect } from "next/navigation";
import { AdminNodeForm } from "@/components/AdminNodeForm";
import { isAuthenticated } from "@/lib/auth";
import { getAllNodes } from "@/lib/nodes";
import { getAllTopics } from "@/lib/topics";

type Props = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function NewNodePage({ searchParams }: Props) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const { topic: defaultTopicId } = await searchParams;
  const [topics, parents] = await Promise.all([getAllTopics(), getAllNodes()]);

  if (topics.length === 0) {
    redirect("/admin/topics/new");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500 sm:text-sm">Yeni düşünce</p>
      <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">Düşünce ekle</h1>
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
        <AdminNodeForm
          topics={topics.map((t) => ({ id: t.id, title: t.title }))}
          defaultTopicId={defaultTopicId}
          parents={parents.map((node) => ({
            id: node.id,
            title: node.title,
            topicId: node.topicId,
          }))}
        />
      </div>
    </main>
  );
}
