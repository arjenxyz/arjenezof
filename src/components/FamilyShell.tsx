import Link from "next/link";
import { FamilyDrawerMenu } from "@/components/FamilyDrawerMenu";
import { FAMILY_GREETINGS, FAMILY_INTRO, type FamilyRole } from "@/lib/family-shared";

type Props = {
  role: FamilyRole;
  children: React.ReactNode;
  introOverride?: string;
  hideIntro?: boolean;
  variant?: "default" | "home";
};

export function FamilyShell({
  role,
  children,
  introOverride,
  hideIntro,
  variant = "default",
}: Props) {
  const isHome = variant === "home";

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <div
          className="absolute right-4 top-6 z-10 sm:right-6 sm:top-10"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          <FamilyDrawerMenu role={role} />
        </div>

        {!isHome && (
          <header className="pr-24 sm:pr-28">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Arjen</p>
            <h1 className="mt-2 font-serif text-2xl text-stone-900 sm:text-3xl">
              {FAMILY_GREETINGS[role]}
            </h1>
            {!hideIntro && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">
                {introOverride ?? FAMILY_INTRO[role]}
              </p>
            )}
          </header>
        )}

        <div className={isHome ? "pr-2 pt-1 sm:pr-4" : undefined}>{children}</div>
      </div>
    </div>
  );
}

type BackLinkProps = {
  href?: string;
  label?: string;
};

export function FamilyBackLink({
  href = "/aile/oku",
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
