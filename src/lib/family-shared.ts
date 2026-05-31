export type FamilyAudience = "wife" | "children" | "grandchildren";
export type FamilyRole = FamilyAudience;

export const FAMILY_AUDIENCES: FamilyAudience[] = ["wife", "children", "grandchildren"];

export const FAMILY_LABELS: Record<FamilyAudience, string> = {
  wife: "Eş",
  children: "Çocuklar",
  grandchildren: "Torunlar",
};

export const FAMILY_GREETINGS: Record<FamilyRole, string> = {
  wife: "Sana özel",
  children: "Çocuklarıma",
  grandchildren: "Torunlarıma",
};

export const FAMILY_ADMIN_HINTS: Record<FamilyAudience, string> = {
  wife: "Yalnızca eşin görür.",
  children: "Eş ve tüm çocuklar görür; torunlar görmez.",
  grandchildren: "Eş, çocuklar ve torunlar görür.",
};

export function canViewFamilyMessage(viewerRole: FamilyRole, audience: FamilyAudience) {
  if (viewerRole === "wife") return true;
  if (viewerRole === "children") {
    return audience === "children" || audience === "grandchildren";
  }
  return audience === "grandchildren";
}

export function audiencesVisibleToRole(role: FamilyRole): FamilyAudience[] {
  return FAMILY_AUDIENCES.filter((audience) => canViewFamilyMessage(role, audience));
}
