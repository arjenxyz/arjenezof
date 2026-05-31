import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminFamilyMessageForm } from "@/components/AdminFamilyMessageForm";
import { isAuthenticated } from "@/lib/auth";

export default async function NewFamilyMessagePage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <Link href="/admin/aile" className="text-sm text-stone-500 hover:text-stone-800">
        ← Aile yönetimine dön
      </Link>
      <h1 className="mt-3 font-serif text-2xl text-stone-900 sm:text-3xl">Yeni aile metni</h1>
      <p className="mt-2 text-sm text-stone-600">Önce kime yazdığını seç — eş, çocuklar veya torunlar.</p>
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <AdminFamilyMessageForm />
      </div>
    </main>
  );
}
