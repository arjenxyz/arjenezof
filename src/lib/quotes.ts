import { createSupabaseAdmin } from "@/lib/supabase";

export const QUOTE_TABLE = "Quote";

export type QuoteRecord = {
  id: string;
  text: string;
  author: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type QuoteRow = {
  id: string;
  text: string;
  author: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function mapQuote(row: QuoteRow): QuoteRecord {
  return {
    id: row.id,
    text: row.text,
    author: row.author,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

export async function getPublishedQuotes() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(QUOTE_TABLE)
    .select("*")
    .eq("published", true)
    .order("sortOrder", { ascending: true })
    .order("createdAt", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as QuoteRow[]).map(mapQuote);
}

export async function getAllQuotes() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(QUOTE_TABLE)
    .select("*")
    .order("sortOrder", { ascending: true })
    .order("createdAt", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as QuoteRow[]).map(mapQuote);
}

export async function getQuoteById(id: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from(QUOTE_TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapQuote(data as QuoteRow) : null;
}

type QuoteInput = {
  text: string;
  author?: string;
  sortOrder?: number;
  published?: boolean;
};

export async function createQuote(input: QuoteInput) {
  const supabase = createSupabaseAdmin();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from(QUOTE_TABLE)
    .insert({
      id: crypto.randomUUID(),
      text: input.text,
      author: input.author?.trim() ?? "",
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
      createdAt: now,
      updatedAt: now,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapQuote(data as QuoteRow);
}

export async function updateQuote(id: string, input: QuoteInput) {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from(QUOTE_TABLE)
    .update({
      text: input.text,
      author: input.author?.trim() ?? "",
      sortOrder: input.sortOrder ?? 0,
      published: input.published ?? true,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapQuote(data as QuoteRow);
}

export async function deleteQuote(id: string) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from(QUOTE_TABLE).delete().eq("id", id);
  if (error) throw error;
}
