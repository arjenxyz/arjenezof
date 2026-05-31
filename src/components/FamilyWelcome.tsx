import Link from "next/link";
import {
  FAMILY_INTRO,
  FAMILY_READ_DESCRIPTIONS,
  FAMILY_READ_LABELS,
  FAMILY_READ_PATH,
  WIFE_WRITE_PATH,
  defaultReadPathForRole,
  type FamilyRole,
} from "@/lib/family-shared";

type Props = {
  role: FamilyRole;
};

function WelcomeCard({
  href,
  title,
  description,
  accent,
}: {
  href: string;
  title: string;
  description: string;
  accent?: string;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-[#8fa38e] hover:shadow touch-manipulation ${
        accent ?? ""
      }`}
    >
      <h2 className="font-serif text-xl text-stone-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{description}</p>
      <p className="mt-4 text-sm font-medium text-[#4a5d49]">Devam et →</p>
    </Link>
  );
}

export function FamilyWelcome({ role }: Props) {
  return (
    <div className="mt-8 space-y-4">
      {role === "wife" ? (
        <>
          <p className="text-sm font-medium text-stone-700">Oku</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <WelcomeCard
              href={FAMILY_READ_PATH.sana}
              title={FAMILY_READ_LABELS.sana}
              description={FAMILY_READ_DESCRIPTIONS.sana}
              accent="border-l-4 border-l-rose-300"
            />
            <WelcomeCard
              href={FAMILY_READ_PATH.cocuklar}
              title={FAMILY_READ_LABELS.cocuklar}
              description={FAMILY_READ_DESCRIPTIONS.cocuklar}
              accent="border-l-4 border-l-sky-300"
            />
            <WelcomeCard
              href={FAMILY_READ_PATH.torunlar}
              title={FAMILY_READ_LABELS.torunlar}
              description={FAMILY_READ_DESCRIPTIONS.torunlar}
              accent="border-l-4 border-l-amber-300"
            />
          </div>

          <p className="pt-2 text-sm font-medium text-stone-700">Yaz</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <WelcomeCard
              href={WIFE_WRITE_PATH.children}
              title="Çocuklara yaz"
              description="Yazdıkların çocukların kendi panelinde görünür."
            />
            <WelcomeCard
              href={WIFE_WRITE_PATH.grandchildren}
              title="Torunlara yaz"
              description="Yazdıkların torunların kendi panelinde görünür."
            />
          </div>
        </>
      ) : (
        <WelcomeCard
          href={defaultReadPathForRole(role)}
          title="Yazıları oku"
          description={FAMILY_INTRO[role]}
        />
      )}

      <p className="pt-2 text-center text-xs text-stone-400">
        Sol üstteki menüden de geçiş yapabilirsin.
      </p>
    </div>
  );
}
