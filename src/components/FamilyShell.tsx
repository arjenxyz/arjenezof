import Link from "next/link";
import { FamilyLogoutButton } from "@/components/FamilyLogoutButton";
import { FAMILY_GREETINGS, FAMILY_INTRO, type FamilyRole } from "@/lib/family-shared";

type Props = {
  role: FamilyRole;
  children: React.ReactNode;
};

export function FamilyShell({ role, children }: Props) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Arjen</p>
          <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">
            {FAMILY_GREETINGS[role]}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">{FAMILY_INTRO[role]}</p>
        </div>
        <FamilyLogoutButton />
      </header>
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

export function FamilyDetailHeader({ backHref }: { role: FamilyRole; backHref?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <FamilyBackLink href={backHref} />
      <FamilyLogoutButton />
    </div>
  );
}
