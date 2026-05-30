import { redirect } from "next/navigation";
import { AdminQuoteForm } from "@/components/AdminQuoteForm";
import { isAuthenticated } from "@/lib/auth";

export default async function NewQuotePage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500 sm:text-sm">Yeni söz</p>
      <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">Söz ekle</h1>
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
        <AdminQuoteForm />
      </div>
    </main>
  );
}
