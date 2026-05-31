import type { ThoughtNodeRecord } from "@/lib/nodes-shared";
import { parseRelatedIds, parseTags } from "@/lib/nodes-shared";

export function collectTagsFromWritings(writings: ThoughtNodeRecord[]) {
  const counts = new Map<string, number>();
  for (const writing of writings) {
    for (const tag of parseTags(writing.tags)) {
      const key = tag.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "tr"))
    .map(([tag]) => tag);
}

export function writingMatchesTag(writing: ThoughtNodeRecord, tag: string) {
  const needle = tag.toLowerCase();
  return parseTags(writing.tags).some((item) => item.toLowerCase() === needle);
}

export function discoverRelatedWritings(
  current: ThoughtNodeRecord,
  allWritings: ThoughtNodeRecord[],
  limit = 6,
) {
  const seen = new Set<string>([current.id]);
  const results: ThoughtNodeRecord[] = [];

  const add = (writing: ThoughtNodeRecord | undefined) => {
    if (!writing || seen.has(writing.id)) return;
    seen.add(writing.id);
    results.push(writing);
  };

  for (const id of parseRelatedIds(current.relatedIds)) {
    add(allWritings.find((item) => item.id === id));
    if (results.length >= limit) return results;
  }

  const currentTags = new Set(parseTags(current.tags).map((tag) => tag.toLowerCase()));

  const scored = allWritings
    .filter((item) => item.id !== current.id && !seen.has(item.id))
    .map((item) => {
      const itemTags = parseTags(item.tags).map((tag) => tag.toLowerCase());
      const overlap = itemTags.filter((tag) => currentTags.has(tag)).length;
      const sameTopic = item.topicId === current.topicId ? 1 : 0;
      return { item, score: overlap * 2 + sameTopic };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "tr"));

  for (const { item } of scored) {
    add(item);
    if (results.length >= limit) break;
  }

  return results;
}

export function getRelatedTagsForTag(writings: ThoughtNodeRecord[], tag: string, limit = 8) {
  const needle = tag.toLowerCase();
  const counts = new Map<string, number>();

  for (const writing of writings) {
    const tags = parseTags(writing.tags).map((item) => item.toLowerCase());
    if (!tags.includes(needle)) continue;
    for (const item of tags) {
      if (item === needle) continue;
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "tr"))
    .slice(0, limit)
    .map(([item]) => item);
}
