import { formatFamilyMessageWhen } from "@/lib/family-dates";

type Props = {
  date: Date;
  createdAt?: Date;
  compact?: boolean;
  className?: string;
};

export function FamilyMessageWhen({ date, createdAt, compact = false, className = "" }: Props) {
  const when = formatFamilyMessageWhen(date, { createdAt });

  if (compact) {
    return (
      <p className={`text-xs text-stone-500 ${className}`}>
        {when.primary}
        {when.secondary ? ` · ${when.secondary}` : ""}
        {when.wasUpdated ? " · güncellendi" : ""}
      </p>
    );
  }

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div
        className="mt-0.5 flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-stone-100 text-stone-600"
        aria-hidden
      >
        <span className="text-[10px] font-semibold uppercase leading-none">
          {new Intl.DateTimeFormat("tr-TR", { month: "short" }).format(date).replace(".", "")}
        </span>
        <span className="text-sm font-semibold leading-tight">{date.getDate()}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-stone-800">{when.primary}</p>
        {when.secondary && <p className="mt-0.5 text-xs text-stone-500">{when.secondary}</p>}
        {when.wasUpdated && (
          <p className="mt-0.5 text-xs text-stone-400">Sonradan güncellendi</p>
        )}
      </div>
    </div>
  );
}
