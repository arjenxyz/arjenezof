import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminNodeForm } from "@/components/AdminNodeForm";
import { isAuthenticated } from "@/lib/auth";
import { getAllNodes, getNodeById } from "@/lib/nodes";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditNodePage({ params }: Props) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const { id } = await params;
  const node = await getNodeById(id);
  if (!node) notFound();

  const parents = await getAllNodes();

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <Link href="/admin" className="inline-flex min-h-[44px] items-center text-sm text-stone-500 hover:text-stone-800 touch-manipulation">
        ← Panele dön
      </Link>
      <h1 className="mt-3 font-serif text-2xl text-stone-900 sm:mt-4 sm:text-3xl">Düşünceyi düzenle</h1>
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
        <AdminNodeForm
          parents={parents.map((item) => ({ id: item.id, title: item.title }))}
          initial={{
            id: node.id,
            title: node.title,
            content: node.content,
            branchQuestion: node.branchQuestion ?? "",
            branchLabel: node.branchLabel ?? "",
            parentId: node.parentId ?? "",
            tags: node.tags,
            sortOrder: node.sortOrder,
            published: node.published,
          }}
        />
      </div>
    </main>
  );
}
