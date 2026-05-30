import { createSupabaseAdmin, TABLE } from "@/lib/supabase";
import {
  buildTree,
  countNodes,
  formatDate,
  parseTags,
  slugify,
  type ThoughtNodeRecord,
  type ThoughtNodeWithChildren,
} from "@/lib/nodes-shared";

export type { ThoughtNodeWithChildren, ThoughtNodeRecord as ThoughtNode };
export { buildTree, countNodes, formatDate, parseTags, slugify };

type DbRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
  branchQuestion: string | null;
  branchLabel: string | null;
  sortOrder: number;
  tags: string;
  published: boolean;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ThoughtNodeDetail = ThoughtNodeRecord & {
  parent: ThoughtNodeRecord | null;
  children: ThoughtNodeRecord[];
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
    published: row.published,
    parentId: row.parentId,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

export async function getUniqueSlug(title: string, excludeId?: string) {
  const supabase = createSupabaseAdmin();
  const base = slugify(title) || "dusunce";
  let slug = base;
  let counter = 1;

  while (true) {
    const { data } = await supabase.from(TABLE).select("id").eq("slug", slug).maybeSingle();
    if (!data || data.id === excludeId) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

export async function getPublishedTree() {
  const nodes = await getPublishedFlatNodes();
  return buildTree(nodes) as ThoughtNodeWithChildren[];
}

export async function getPublishedFlatNodes() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("published", true)
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

export async function getNodeBySlug(slug: string): Promise<ThoughtNodeDetail | null> {
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

  const { data: children, error: childrenError } = await supabase
    .from(TABLE)
    .select("*")
    .eq("parentId", mapped.id)
    .eq("published", true)
    .order("sortOrder", { ascending: true })
    .order("title", { ascending: true });

  if (childrenError) throw childrenError;

  let parent: ThoughtNodeRecord | null = null;
  if (mapped.parentId) {
    const { data: parentRow, error: parentError } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", mapped.parentId)
      .maybeSingle();
    if (parentError) throw parentError;
    parent = parentRow ? mapNode(parentRow as DbRow) : null;
  }

  return {
    ...mapped,
    parent,
    children: ((children ?? []) as DbRow[]).map(mapNode),
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
  branchQuestion?: string | null;
  branchLabel?: string | null;
  parentId?: string | null;
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
      branchQuestion: input.branchQuestion ?? null,
      branchLabel: input.branchLabel ?? null,
      parentId: input.parentId ?? null,
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

export async function updateThoughtNode(id: string, input: NodeInput, existingSlug: string, existingTitle: string) {
  const supabase = createSupabaseAdmin();
  const slug =
    existingTitle === input.title ? existingSlug : await getUniqueSlug(input.title, id);

  const { data, error } = await supabase
    .from(TABLE)
    .update({
      title: input.title,
      slug,
      content: input.content,
      branchQuestion: input.branchQuestion ?? null,
      branchLabel: input.branchLabel ?? null,
      parentId: input.parentId ?? null,
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
