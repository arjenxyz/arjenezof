import { createSupabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/nodes-shared";

export const TOPIC_TABLE = "Topic";

export type TopicRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type TopicRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

function mapTopic(row: TopicRow): TopicRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sortOrder,
    published: row.published,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

export async function getUniqueTopicSlug(title: string, excludeId?: string) {
  const supabase = createSupabaseAdmin();
  const base = slugify(title) || "konu";
  let slug = base;
  let counter = 1;

  while (true) {
    const { data } = await supabase.from(TOPIC_TABLE).select("id").eq("slug", slug).maybeSingle();
    if (!data || data.id === excludeId) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

export async function getPublishedTopics() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TOPIC_TABLE)
    .select("*")
    .eq("published", true)
    .order("sortOrder", { ascending: true })
    .order("title", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as TopicRow[]).map(mapTopic);
}

export async function getAllTopics() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TOPIC_TABLE)
    .select("*")
    .order("sortOrder", { ascending: true })
    .order("title", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as TopicRow[]).map(mapTopic);
}

export async function getTopicBySlug(slug: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TOPIC_TABLE)
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapTopic(data as TopicRow) : null;
}

export async function getTopicById(id: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from(TOPIC_TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapTopic(data as TopicRow) : null;
}

type TopicInput = {
  title: string;
  description: string;
  sortOrder?: number;
  published?: boolean;
};

export async function createTopic(input: TopicInput) {
  const supabase = createSupabaseAdmin();
  const slug = await getUniqueTopicSlug(input.title);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from(TOPIC_TABLE)
    .insert({
      id: crypto.randomUUID(),
      title: input.title,
      slug,
      description: input.description,
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
      createdAt: now,
      updatedAt: now,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapTopic(data as TopicRow);
}

export async function updateTopic(
  id: string,
  input: TopicInput,
  existingSlug: string,
  existingTitle: string,
) {
  const supabase = createSupabaseAdmin();
  const slug =
    existingTitle === input.title ? existingSlug : await getUniqueTopicSlug(input.title, id);

  const { data, error } = await supabase
    .from(TOPIC_TABLE)
    .update({
      title: input.title,
      slug,
      description: input.description,
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapTopic(data as TopicRow);
}

export async function deleteTopic(id: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from(TOPIC_TABLE).delete().eq("id", id);
  if (error) throw error;
}

export async function countNodesForTopic(topicId: string) {
  const supabase = createSupabaseAdmin();
  const { count, error } = await supabase
    .from("ThoughtNode")
    .select("*", { count: "exact", head: true })
    .eq("topicId", topicId)
    .eq("published", true);

  if (error) throw error;
  return count ?? 0;
}
