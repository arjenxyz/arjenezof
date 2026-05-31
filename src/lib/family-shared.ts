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

export const WIFE_WRITE_PATH: Record<WifeWriteAudience, string> = {
  children: "/aile/yaz/cocuklar",
  grandchildren: "/aile/yaz/torunlar",
};

export const WIFE_WRITE_SEGMENT: Record<WifeWriteAudience, string> = {
  children: "cocuklar",
  grandchildren: "torunlar",
};

export function wifeWriteAudienceFromSegment(segment: string): WifeWriteAudience | null {
  if (segment === "cocuklar") return "children";
  if (segment === "torunlar") return "grandchildren";
  return null;
}

export type FamilyMenuItem = {
  id: string;
  label: string;
  href?: string;
  description?: string;
  children?: FamilyMenuItem[];
};

export type FamilyReadSegment = "sana" | "cocuklar" | "torunlar";

export const FAMILY_READ_PATH: Record<FamilyReadSegment, string> = {
  sana: "/aile/oku/sana",
  cocuklar: "/aile/oku/cocuklar",
  torunlar: "/aile/oku/torunlar",
};

export const FAMILY_READ_LABELS: Record<FamilyReadSegment, string> = {
  sana: "Arjen'in yazdıkları",
  cocuklar: "Çocuklar",
  torunlar: "Torunlar",
};

export const FAMILY_READ_DESCRIPTIONS: Record<FamilyReadSegment, string> = {
  sana: "Sana özel yazılar",
  cocuklar: "Çocuklarımız için yazılanlar",
  torunlar: "Torunlarımız için yazılanlar",
};

export function audienceForReadSegment(segment: FamilyReadSegment): FamilyAudience {
  if (segment === "sana") return "wife";
  if (segment === "cocuklar") return "children";
  return "grandchildren";
}

export function readPathForAudience(audience: FamilyAudience): string {
  if (audience === "wife") return FAMILY_READ_PATH.sana;
  if (audience === "children") return FAMILY_READ_PATH.cocuklar;
  return FAMILY_READ_PATH.torunlar;
}

export function defaultReadPathForRole(role: FamilyRole): string {
  if (role === "wife") return FAMILY_READ_PATH.sana;
  if (role === "children") return FAMILY_READ_PATH.cocuklar;
  return FAMILY_READ_PATH.torunlar;
}

export function readSegmentsForRole(role: FamilyRole): FamilyReadSegment[] {
  if (role === "wife") return ["sana", "cocuklar", "torunlar"];
  if (role === "children") return ["cocuklar"];
  return ["torunlar"];
}

export function canAccessReadSegment(role: FamilyRole, segment: FamilyReadSegment): boolean {
  return readSegmentsForRole(role).includes(segment);
}

export function familyMenuItemsForRole(role: FamilyRole): FamilyMenuItem[] {
  const readItems: FamilyMenuItem[] = readSegmentsForRole(role).map((segment) => ({
    id: `read-${segment}`,
    label: FAMILY_READ_LABELS[segment],
    href: FAMILY_READ_PATH[segment],
    description: FAMILY_READ_DESCRIPTIONS[segment],
  }));

  const items: FamilyMenuItem[] = [
    { id: "home", label: "Ana sayfa", href: "/aile", description: "Karşılama ekranı" },
    { id: "read", label: "Oku", children: readItems },
  ];

  if (role === "wife") {
    items.push(
      {
        id: "write-children",
        label: "Çocuklara yaz",
        href: WIFE_WRITE_PATH.children,
        description: "Çocuklarının panelinde görünür",
      },
      {
        id: "write-grandchildren",
        label: "Torunlara yaz",
        href: WIFE_WRITE_PATH.grandchildren,
        description: "Torunlarının panelinde görünür",
      },
    );
  }

  return items;
}
