import Link from "next/link";
import {
  FAMILY_READ_DESCRIPTIONS,
  FAMILY_READ_LABELS,
  FAMILY_READ_PATH,
  WIFE_WRITE_PATH,
  defaultReadPathForRole,
  type FamilyRole,
} from "@/lib/family-shared";
import { FAMILY_WELCOME_OTHERS, WIFE_WELCOME } from "@/lib/family-welcome-content";

type Props = {
  role: FamilyRole;
};

function QuickLink({
  href,
  label,
  description,
  accent,
}: {
  href: string;
  label: string;
  description: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className={`group block rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-[#8fa38e] hover:shadow-md touch-manipulation sm:p-5 ${accent}`}
    >
      <p className="font-serif text-lg text-stone-900 group-hover:text-[#4a5d49]">{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{description}</p>
      <p className="mt-3 text-sm font-medium text-[#4a5d49]">Git →</p>
    </Link>
  );
}

function WifeWelcome() {
  return (
    <div className="mt-2 space-y-8 sm:mt-4 sm:space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-[#f7f5f0] via-white to-[#eef2ed] px-6 py-10 shadow-sm sm:px-10 sm:py-12">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#dce6db]/60 blur-2xl"
          aria-hidden
        />
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">{WIFE_WELCOME.eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl text-stone-900 sm:text-5xl">{WIFE_WELCOME.headline}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-700 sm:text-lg">
          {WIFE_WELCOME.lead}
        </p>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl text-stone-900">{WIFE_WELCOME.letter.title}</h2>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-stone-700">
          {WIFE_WELCOME.letter.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-stone-900 sm:text-2xl">Ne hedefliyoruz?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
          Üç küçük oda — her biri farklı bir ses, farklı bir iz.
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {WIFE_WELCOME.goals.map((goal, index) => (
            <li
              key={goal.title}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ed] text-sm font-medium text-[#4a5d49]">
                {index + 1}
              </span>
              <h3 className="mt-3 font-serif text-lg text-stone-900">{goal.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{goal.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-dashed border-[#b8c9b6] bg-[#f8faf7] px-6 py-5 sm:px-8">
        <p className="text-base leading-relaxed text-stone-700 italic">{WIFE_WELCOME.closing}</p>
        <p className="mt-4 text-sm text-stone-500">— Arjen</p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-stone-900">Nereden başlamak istersin?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            href={FAMILY_READ_PATH.sana}
            label={FAMILY_READ_LABELS.sana}
            description={FAMILY_READ_DESCRIPTIONS.sana}
            accent="border-l-4 border-l-rose-300"
          />
          <QuickLink
            href={FAMILY_READ_PATH.cocuklar}
            label={FAMILY_READ_LABELS.cocuklar}
            description={FAMILY_READ_DESCRIPTIONS.cocuklar}
            accent="border-l-4 border-l-sky-300"
          />
          <QuickLink
            href={FAMILY_READ_PATH.torunlar}
            label={FAMILY_READ_LABELS.torunlar}
            description={FAMILY_READ_DESCRIPTIONS.torunlar}
            accent="border-l-4 border-l-amber-300"
          />
          <QuickLink
            href={WIFE_WRITE_PATH.children}
            label="Çocuklara yaz"
            description="Kendi sesinle onlara bir şeyler bırak."
            accent="border-l-4 border-l-[#8fa38e]"
          />
          <QuickLink
            href={WIFE_WRITE_PATH.grandchildren}
            label="Torunlara yaz"
            description="Torunların panelinde görünecek yazılar."
            accent="border-l-4 border-l-[#8fa38e]"
          />
        </div>
        <p className="mt-4 text-center text-xs text-stone-400">
          Sağ üstteki menüden de geçiş yapabilirsin.
        </p>
      </section>
    </div>
  );
}

function OtherWelcome({ role }: { role: "children" | "grandchildren" }) {
  const content = FAMILY_WELCOME_OTHERS[role];

  return (
    <div className="mt-4 space-y-8">
      <section className="rounded-3xl border border-stone-200 bg-gradient-to-br from-[#f7f5f0] to-white px-6 py-10 shadow-sm sm:px-10">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Arjen · Aileye özel</p>
        <h1 className="mt-4 font-serif text-4xl text-stone-900">{content.headline}</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-700">{content.lead}</p>
      </section>

      <QuickLink
        href={defaultReadPathForRole(role)}
        label="Yazıları oku"
        description="Sana yazılmış metinlerin listesi."
        accent="border-l-4 border-l-[#8fa38e]"
      />

      <p className="text-center text-xs text-stone-400">{content.note}</p>
    </div>
  );
}

export function FamilyWelcome({ role }: Props) {
  if (role === "wife") return <WifeWelcome />;
  return <OtherWelcome role={role} />;
}
