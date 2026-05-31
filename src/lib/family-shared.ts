export type FamilyAudience = "wife" | "children" | "grandchildren";
export type FamilyRole = FamilyAudience;
export type FamilyAuthorRole = "admin" | "wife";

export const FAMILY_AUDIENCES: FamilyAudience[] = ["wife", "children", "grandchildren"];

export const WIFE_WRITE_AUDIENCES = ["children", "grandchildren"] as const;
export type WifeWriteAudience = (typeof WIFE_WRITE_AUDIENCES)[number];

export const FAMILY_LABELS: Record<FamilyAudience, string> = {
  wife: "Eş",
  children: "Çocuklar",
  grandchildren: "Torunlar",
};

export const FAMILY_GREETINGS: Record<FamilyRole, string> = {
  wife: "Merhaba",
  children: "Çocuklarım",
  grandchildren: "Torunlarım",
};

export const FAMILY_INTRO: Record<FamilyRole, string> = {
  wife: "Arjen'in sana ve aileye yazdığı metinler burada. İstersen çocuklar ve torunlar için de yazabilirsin.",
  children: "Sana ve kardeşlerine yazılan metinler burada.",
  grandchildren: "Büyükannene ve büyükbabandan sana yazılan metinler burada.",
};

export type FamilySectionInfo = {
  title: string;
  subtitle: string;
};

export const FAMILY_SECTIONS: Record<FamilyRole, Partial<Record<FamilyAudience, FamilySectionInfo>>> = {
  wife: {
    wife: {
      title: "Sana",
      subtitle: "Bunları yalnızca sen okuyabilirsin.",
    },
    children: {
      title: "Çocuklarımız",
      subtitle: "Çocuklar kendi şifreleriyle bu bölümü görür.",
    },
    grandchildren: {
      title: "Torunlarımız",
      subtitle: "Torunlar kendi şifreleriyle bu bölümü görür.",
    },
  },
  children: {
    children: {
      title: "Size",
      subtitle: "Kardeşlerinle birlikte okuyabileceğin yazılar.",
    },
  },
  grandchildren: {},
};

export const FAMILY_DETAIL_CONTEXT: Record<FamilyAudience, string> = {
  wife: "Sana özel bir yazı",
  children: "Çocuklarımız için yazılmış",
  grandchildren: "Torunlarımız için yazılmış",
};

export function sectionsForRole(role: FamilyRole): FamilyAudience[] {
  if (role === "wife") return FAMILY_AUDIENCES;
  if (role === "children") return ["children"];
  return ["grandchildren"];
}

export const FAMILY_ADMIN_HINTS: Record<FamilyAudience, string> = {
  wife: "Yalnızca eşin görür.",
  children: "Eş ve tüm çocuklar görür; torunlar görmez.",
  grandchildren: "Eş ve torunlar görür; çocuklar görmez.",
};

export const WIFE_WRITE_HINTS: Record<WifeWriteAudience, string> = {
  children: "Tüm çocuklarınız kendi şifreleriyle bunu okur.",
  grandchildren: "Tüm torunlarınız kendi şifreleriyle bunu okur.",
};

export function wifeCanManageAudience(audience: FamilyAudience): audience is WifeWriteAudience {
  return (WIFE_WRITE_AUDIENCES as readonly FamilyAudience[]).includes(audience);
}

export function canViewFamilyMessage(viewerRole: FamilyRole, audience: FamilyAudience) {
  if (viewerRole === "wife") return true;
  if (viewerRole === "children") return audience === "children";
  return audience === "grandchildren";
}

export function audiencesVisibleToRole(role: FamilyRole): FamilyAudience[] {
  return FAMILY_AUDIENCES.filter((audience) => canViewFamilyMessage(role, audience));
}
