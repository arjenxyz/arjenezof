import { isAuthenticated } from "@/lib/auth";
import { getFamilySessionRole } from "@/lib/family-auth";
import type { FamilyMessageRecord } from "@/lib/family";
import { wifeCanManageAudience } from "@/lib/family-shared";

export type FamilyWriteActor = { kind: "admin" } | { kind: "wife" };

/** Aile metin API'si — eş oturumu admin oturumundan önce gelir (aynı tarayıcı sorunu). */
export async function getFamilyMessageWriteActor(): Promise<FamilyWriteActor | null> {
  const familyRole = await getFamilySessionRole();
  if (familyRole === "wife") return { kind: "wife" };
  if (await isAuthenticated()) return { kind: "admin" };
  return null;
}

/** Şifre yönetimi vb. — yalnızca site admini. */
export async function getFamilyWriteActor(): Promise<FamilyWriteActor | null> {
  if (await isAuthenticated()) return { kind: "admin" };
  return null;
}

export function wifeCanManageMessage(message: FamilyMessageRecord) {
  return message.authorRole === "wife" && wifeCanManageAudience(message.audience);
}

export function actorCanManageMessage(actor: FamilyWriteActor, message: FamilyMessageRecord) {
  if (actor.kind === "admin") return true;
  return wifeCanManageMessage(message);
}
