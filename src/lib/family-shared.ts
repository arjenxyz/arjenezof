export type FamilyAudience = "wife" | "children" | "grandchildren";
export type FamilyRole = FamilyAudience;

export const FAMILY_AUDIENCES: FamilyAudience[] = ["wife", "children", "grandchildren"];

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
  wife: "Arjen'in sana ve aileye yazdığı metinler burada. Her bölüm ayrı — karıştırmana gerek yok.",
  children: "Babaannene ve kardeşlerine yazılan metinler burada.",
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
    grandchildren: {
      title: "Torunlara",
      subtitle: "Torunların okuduğu yazılar — sen de görebilirsin.",
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
  if (role === "children") return ["children", "grandchildren"];
  return ["grandchildren"];
}

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
