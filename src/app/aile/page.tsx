import { redirect } from "next/navigation";
import { FamilyLoginForm } from "@/components/FamilyLoginForm";
import { SiteFooter } from "@/components/SiteFooter";
import { getFamilySessionRole } from "@/lib/family-auth";

export const metadata = {
  title: "Aile",
  robots: { index: false, follow: false },
};

export default async function FamilyLoginPage() {
  const role = await getFamilySessionRole();
  if (role) redirect("/aile/metinler");

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Arjen</p>
          <h1 className="mt-2 font-serif text-2xl text-stone-900">Aileye özel</h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Sana verilen şifreyle gir. Herkes kendi alanını görür — eş, çocuklar ve torunlar ayrı
            şifreyle.
          </p>
          <div className="mt-6">
            <FamilyLoginForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
