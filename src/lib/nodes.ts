import { createSupabaseAdmin, TABLE } from "@/lib/supabase";
import { discoverRelatedWritings } from "@/lib/discovery";
import {
  formatDate,
  parseTags,
  slugify,
  type ThoughtNodeRecord,
} from "@/lib/nodes-shared";

export type { ThoughtNodeRecord as ThoughtNode };
export { formatDate, parseTags, slugify };

type DbRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
  branchQuestion: string | null;
  branchLabel: string | null;
  sortOrder: number;
  tags: string;
  relatedIds: string | null;
  published: boolean;
  parentId: string | null;
  topicId: string;
  createdAt: string;
  updatedAt: string;
};

export type WritingDetail = ThoughtNodeRecord & {
  continuesFrom: ThoughtNodeRecord | null;
  continuations: ThoughtNodeRecord[];
  relatedWritings: ThoughtNodeRecord[];
};

function mapNode(row: DbRow): ThoughtNodeRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    branchQuestion: row.branchQuestion,
    branchLabel: row.branchLabel,
    sortOrder: row.sortOrder,
    tags: row.tags,
    relatedIds: row.relatedIds ?? "",
    published: row.published,
    parentId: row.parentId,
    topicId: row.topicId,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

export async function getUniqueSlug(title: string, excludeId?: string) {
  const supabase = createSupabaseAdmin();
  const base = slugify(title) || "metin";
  let slug = base;
  let counter = 1;

  while (true) {
    const { data } = await supabase.from(TABLE).select("id").eq("slug", slug).maybeSingle();
    if (!data || data.id === excludeId) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

export async function getPublishedWritingsByTopic(topicId: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("topicId", topicId)
    .eq("published", true)
    .order("sortOrder", { ascending: true })
    .order("updatedAt", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbRow[]).map(mapNode);
}

export async function getAllPublishedWritings() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("published", true)
    .order("updatedAt", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbRow[]).map(mapNode);
}

export async function getPublishedWritingsByTag(tag: string) {
  const writings = await getAllPublishedWritings();
  const needle = tag.toLowerCase();
  return writings.filter((writing) =>
    parseTags(writing.tags).some((item) => item.toLowerCase() === needle),
  );
}

export async function getAllNodesByTopic(topicId: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("topicId", topicId)
    .order("sortOrder", { ascending: true })
    .order("title", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as DbRow[]).map(mapNode);
}

export async function getAllNodes() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sortOrder", { ascending: true })
    .order("title", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as DbRow[]).map(mapNode);
}

export async function getNodeBySlug(slug: string): Promise<WritingDetail | null> {
  const supabase = createSupabaseAdmin();
  const { data: node, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  if (!node) return null;

  const mapped = mapNode(node as DbRow);

  const { data: continuations, error: continuationsError } = await supabase
    .from(TABLE)
    .select("*")
    .eq("parentId", mapped.id)
    .eq("published", true)
    .order("sortOrder", { ascending: true })
    .order("title", { ascending: true });

  if (continuationsError) throw continuationsError;

  let continuesFrom: ThoughtNodeRecord | null = null;
  if (mapped.parentId) {
    const { data: parentRow, error: parentError } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", mapped.parentId)
      .maybeSingle();
    if (parentError) throw parentError;
    continuesFrom = parentRow ? mapNode(parentRow as DbRow) : null;
  }

  const allPublished = await getAllPublishedWritings();
  const relatedWritings = discoverRelatedWritings(mapped, allPublished);

  return {
    ...mapped,
    continuesFrom,
    continuations: ((continuations ?? []) as DbRow[]).map(mapNode),
    relatedWritings,
  };
}

export async function getNodeById(id: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapNode(data as DbRow) : null;
}

export async function getParentNode(id: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapNode(data as DbRow) : null;
}

type NodeInput = {
  title: string;
  content: string;
  topicId: string;
  parentId?: string | null;
  relatedIds?: string;
  tags?: string;
  sortOrder?: number;
  published?: boolean;
};

export async function createThoughtNode(input: NodeInput) {
  const supabase = createSupabaseAdmin();
  const slug = await getUniqueSlug(input.title);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      id: crypto.randomUUID(),
      title: input.title,
      slug,
      content: input.content,
      topicId: input.topicId,
      branchQuestion: null,
      branchLabel: null,
      parentId: input.parentId ?? null,
      relatedIds: input.relatedIds ?? "",
      tags: input.tags ?? "",
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
      createdAt: now,
      updatedAt: now,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapNode(data as DbRow);
}

export async function updateThoughtNode(
  id: string,
  input: NodeInput,
  existingSlug: string,
  existingTitle: string,
) {
  const supabase = createSupabaseAdmin();
  const slug =
    existingTitle === input.title ? existingSlug : await getUniqueSlug(input.title, id);

  const { data, error } = await supabase
    .from(TABLE)
    .update({
      title: input.title,
      slug,
      content: input.content,
      topicId: input.topicId,
      branchQuestion: null,
      branchLabel: null,
      parentId: input.parentId ?? null,
      relatedIds: input.relatedIds ?? "",
      tags: input.tags ?? "",
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapNode(data as DbRow);
}

export async function deleteThoughtNode(id: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
