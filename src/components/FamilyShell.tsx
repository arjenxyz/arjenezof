import Link from "next/link";
import { FamilyLogoutButton } from "@/components/FamilyLogoutButton";
import { FAMILY_GREETINGS, FAMILY_INTRO, type FamilyRole } from "@/lib/family-shared";

type Props = {
  role: FamilyRole;
  children: React.ReactNode;
  activeTab?: "read" | "write";
  introOverride?: string;
};

export function FamilyShell({ role, children, activeTab, introOverride }: Props) {
  const tabClass = (tab: "read" | "write") =>
    `flex-1 rounded-md px-4 py-2.5 text-center text-sm font-medium transition touch-manipulation ${
      activeTab === tab
        ? "bg-[#4a5d49] text-white"
        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
    }`;

  return (
    <main
      className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:px-6 sm:py-10"
      style={{
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Arjen</p>
          <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">
            {FAMILY_GREETINGS[role]}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">
            {introOverride ?? FAMILY_INTRO[role]}
          </p>
        </div>
        <FamilyLogoutButton />
      </header>

      {role === "wife" && (
        <nav
          className="mt-6 flex rounded-xl border border-stone-200 bg-white p-1"
          aria-label="Aile menüsü"
        >
          <Link href="/aile/metinler" className={tabClass("read")}>
            Oku
          </Link>
          <Link href="/aile/yaz" className={tabClass("write")}>
            Yaz
          </Link>
        </nav>
      )}

      {children}
    </main>
  );
}

type BackLinkProps = {
  href?: string;
  label?: string;
};

export function FamilyBackLink({
  href = "/aile/metinler",
  label = "← Yazılara dön",
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm text-stone-500 transition hover:text-stone-800 touch-manipulation"
    >
      {label}
    </Link>
  );
}

export function FamilyDetailHeader({ backHref }: { backHref?: string }) {
  return (
    <div className="mt-6">
      <FamilyBackLink href={backHref} />
    </div>
  );
}
