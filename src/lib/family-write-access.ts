import { isAuthenticated } from "@/lib/auth";
import { getFamilySessionRole } from "@/lib/family-auth";
import type { FamilyMessageRecord } from "@/lib/family";
import { wifeCanManageAudience } from "@/lib/family-shared";

export type FamilyWriteActor = { kind: "admin" } | { kind: "wife" };

export async function getFamilyWriteActor(): Promise<FamilyWriteActor | null> {
  if (await isAuthenticated()) return { kind: "admin" };
  if ((await getFamilySessionRole()) === "wife") return { kind: "wife" };
  return null;
}

export function wifeCanManageMessage(message: FamilyMessageRecord) {
  return message.authorRole === "wife" && wifeCanManageAudience(message.audience);
}

export function actorCanManageMessage(actor: FamilyWriteActor, message: FamilyMessageRecord) {
  if (actor.kind === "admin") return true;
  return wifeCanManageMessage(message);
}
