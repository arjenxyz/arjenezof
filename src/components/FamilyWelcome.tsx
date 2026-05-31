import Link from "next/link";
import {
  FAMILY_INTRO,
  WIFE_WRITE_PATH,
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
          <WelcomeCard
            href="/aile/oku"
            title="Oku"
            description="Arjen'in sana, çocuklara ve torunlara yazdığı metinleri oku."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <WelcomeCard
              href={WIFE_WRITE_PATH.children}
              title="Çocuklara yaz"
              description="Yazdıkların çocukların kendi panelinde görünür."
              accent="border-l-4 border-l-sky-300"
            />
            <WelcomeCard
              href={WIFE_WRITE_PATH.grandchildren}
              title="Torunlara yaz"
              description="Yazdıkların torunların kendi panelinde görünür."
              accent="border-l-4 border-l-amber-300"
            />
          </div>
        </>
      ) : (
        <WelcomeCard
          href="/aile/oku"
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
