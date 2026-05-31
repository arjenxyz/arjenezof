import type { MetadataRoute } from "next";
import { getAllPublishedWritings } from "@/lib/nodes";
import { getPublishedTopics } from "@/lib/topics";
import { collectTagsFromWritings } from "@/lib/discovery";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [topics, writings] = await Promise.all([
    getPublishedTopics(),
    getAllPublishedWritings(),
  ]);
  const tags = collectTagsFromWritings(writings);

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/hakkinda`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const topicPages = topics.map((topic) => ({
    url: `${base}/konu/${topic.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const writingPages = writings.map((writing) => ({
    url: `${base}/dusunce/${writing.slug}`,
    lastModified: writing.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const tagPages = tags.map((tag) => ({
    url: `${base}/etiket/${encodeURIComponent(tag)}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...topicPages, ...writingPages, ...tagPages];
}
