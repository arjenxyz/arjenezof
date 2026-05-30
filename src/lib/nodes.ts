import type { ThoughtNode } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  buildTree,
  countNodes,
  formatDate,
  parseTags,
  slugify,
  type ThoughtNodeWithChildren,
} from "@/lib/nodes-shared";

export type { ThoughtNodeWithChildren };
export { buildTree, countNodes, formatDate, parseTags, slugify };

export async function getUniqueSlug(title: string, excludeId?: string) {
  const base = slugify(title) || "dusunce";
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.thoughtNode.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

export async function getPublishedTree() {
  const nodes = await prisma.thoughtNode.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
  return buildTree(nodes) as ThoughtNodeWithChildren[];
}

export async function getAllNodes() {
  return prisma.thoughtNode.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}

export async function getNodeBySlug(slug: string) {
  return prisma.thoughtNode.findFirst({
    where: { slug, published: true },
    include: {
      parent: true,
      children: {
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      },
    },
  });
}

export async function getNodeById(id: string) {
  return prisma.thoughtNode.findUnique({
    where: { id },
    include: {
      parent: true,
      children: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
    },
  });
}

export type { ThoughtNode };
