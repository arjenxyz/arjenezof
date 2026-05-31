import type { FamilyAudience } from "@/lib/family-shared";
import { FAMILY_LABELS } from "@/lib/family-shared";

const BADGE_CLASS: Record<FamilyAudience, string> = {
  wife: "bg-rose-50 text-rose-800 ring-rose-200",
  children: "bg-sky-50 text-sky-800 ring-sky-200",
  grandchildren: "bg-amber-50 text-amber-900 ring-amber-200",
};

type Props = {
  audience: FamilyAudience;
};

export function FamilyAudienceBadge({ audience }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${BADGE_CLASS[audience]}`}
    >
      {FAMILY_LABELS[audience]}
    </span>
  );
}

export function familyAudienceBorderClass(audience: FamilyAudience) {
  return {
    wife: "border-rose-200 bg-rose-50/40",
    children: "border-sky-200 bg-sky-50/40",
    grandchildren: "border-amber-200 bg-amber-50/40",
  }[audience];
}
