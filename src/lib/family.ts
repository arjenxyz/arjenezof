import {
  canViewFamilyMessage,
  type FamilyAudience,
  type FamilyAuthorRole,
  type FamilyRole,
} from "@/lib/family-shared";
import { hashFamilyPassword, verifyFamilyPassword } from "@/lib/family-auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export const FAMILY_MESSAGE_TABLE = "FamilyMessage";
export const FAMILY_CREDENTIAL_TABLE = "FamilyCredential";

export type FamilyMessageRecord = {
  id: string;
  title: string;
  content: string;
  audience: FamilyAudience;
  sortOrder: number;
  published: boolean;
  authorRole: FamilyAuthorRole;
  createdAt: Date;
  updatedAt: Date;
};

type MessageRow = {
  id: string;
  title: string;
  content: string;
  audience: FamilyAudience;
  sortOrder: number;
  published: boolean;
  authorRole?: FamilyAuthorRole;
  createdAt: string;
  updatedAt: string;
};

type CredentialRow = {
  role: FamilyRole;
  passwordHash: string;
  updatedAt: string;
};

function mapMessage(row: MessageRow): FamilyMessageRecord {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    audience: row.audience,
    sortOrder: row.sortOrder,
    published: row.published,
    authorRole: row.authorRole ?? "admin",
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

export async function ensureFamilyCredentials() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from(FAMILY_CREDENTIAL_TABLE).select("role");
  if (error) throw error;
  if ((data ?? []).length >= 3) return;

  const defaults: Record<FamilyRole, string | undefined> = {
    wife: process.env.FAMILY_PASSWORD_WIFE,
    children: process.env.FAMILY_PASSWORD_CHILDREN,
    grandchildren: process.env.FAMILY_PASSWORD_GRANDCHILDREN,
  };

  const now = new Date().toISOString();
  for (const role of ["wife", "children", "grandchildren"] as FamilyRole[]) {
    const existing = (data ?? []).find((row) => row.role === role);
    if (existing) continue;

    const plain = defaults[role] ?? `aile-${role}-degistir`;
    const passwordHash = await hashFamilyPassword(plain);

    const { error: insertError } = await supabase.from(FAMILY_CREDENTIAL_TABLE).insert({
      role,
      passwordHash,
      updatedAt: now,
    });
    if (insertError) throw insertError;
  }
}

export async function resolveFamilyRoleFromPassword(password: string): Promise<FamilyRole | null> {
  await ensureFamilyCredentials();
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from(FAMILY_CREDENTIAL_TABLE).select("*");
  if (error) throw error;

  for (const row of (data ?? []) as CredentialRow[]) {
    const match = await verifyFamilyPassword(password, row.passwordHash);
    if (match) return row.role;
  }
  return null;
}

export async function updateFamilyPassword(role: FamilyRole, newPassword: string) {
  const supabase = createSupabaseAdmin();
  const passwordHash = await hashFamilyPassword(newPassword);

  const { error } = await supabase
    .from(FAMILY_CREDENTIAL_TABLE)
    .update({
      passwordHash,
      updatedAt: new Date().toISOString(),
    })
    .eq("role", role);

  if (error) throw error;
}

export async function getFamilyCredentialMeta() {
  await ensureFamilyCredentials();
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(FAMILY_CREDENTIAL_TABLE)
    .select("role, updatedAt")
    .order("role", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as { role: FamilyRole; updatedAt: string }[]).map((row) => ({
    role: row.role,
    updatedAt: new Date(row.updatedAt),
  }));
}

export async function getAllFamilyMessages() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(FAMILY_MESSAGE_TABLE)
    .select("*")
    .order("sortOrder", { ascending: true })
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as MessageRow[]).map(mapMessage);
}

export async function getPublishedFamilyMessagesForRole(role: FamilyRole) {
  const messages = await getAllFamilyMessages();
  return messages.filter(
    (message) => message.published && canViewFamilyMessage(role, message.audience),
  );
}

export async function getFamilyMessageById(id: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(FAMILY_MESSAGE_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapMessage(data as MessageRow) : null;
}

export async function familyAuthorRoleReady() {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from(FAMILY_MESSAGE_TABLE).select("authorRole").limit(1);
  return !error;
}

export async function getFamilyMessagesByAuthor(authorRole: FamilyAuthorRole) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(FAMILY_MESSAGE_TABLE)
    .select("*")
    .eq("authorRole", authorRole)
    .order("sortOrder", { ascending: true })
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as MessageRow[]).map(mapMessage);
}

export async function getFamilyMessageForRole(id: string, role: FamilyRole) {
  const message = await getFamilyMessageById(id);
  if (!message || !message.published) return null;
  if (!canViewFamilyMessage(role, message.audience)) return null;
  return message;
}

type MessageInput = {
  title: string;
  content: string;
  audience: FamilyAudience;
  sortOrder?: number;
  published?: boolean;
  authorRole?: FamilyAuthorRole;
};

export async function createFamilyMessage(input: MessageInput) {
  const supabase = createSupabaseAdmin();
  const now = new Date().toISOString();
  const authorRole = input.authorRole ?? "admin";

  const { data, error } = await supabase
    .from(FAMILY_MESSAGE_TABLE)
    .insert({
      id: crypto.randomUUID(),
      title: input.title,
      content: input.content,
      audience: input.audience,
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
      authorRole,
      createdAt: now,
      updatedAt: now,
    })
    .select("*")
    .single();

  if (error) throw error;

  let message = mapMessage(data as MessageRow);
  if (message.authorRole !== authorRole) {
    const { data: fixed, error: fixError } = await supabase
      .from(FAMILY_MESSAGE_TABLE)
      .update({ authorRole, updatedAt: new Date().toISOString() })
      .eq("id", message.id)
      .select("*")
      .single();

    if (fixError) throw fixError;
    message = mapMessage(fixed as MessageRow);
  }

  return message;
}

export async function updateFamilyMessage(id: string, input: MessageInput) {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from(FAMILY_MESSAGE_TABLE)
    .update({
      title: input.title,
      content: input.content,
      audience: input.audience,
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapMessage(data as MessageRow);
}

export async function deleteFamilyMessage(id: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from(FAMILY_MESSAGE_TABLE).delete().eq("id", id);
  if (error) throw error;
}
