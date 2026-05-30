export type ThoughtNodeRecord = {
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
  topicId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ThoughtNodeWithChildren = ThoughtNodeRecord & {
  children: ThoughtNodeWithChildren[];
};

export function parseTags(tags: string): string[] {
  if (!tags.trim()) return [];
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function countNodes(nodes: ThoughtNodeWithChildren[]): number {
  return nodes.reduce((sum, node) => sum + 1 + countNodes(node.children), 0);
}

export function buildTree<T extends ThoughtNodeRecord>(nodes: T[]): (T & { children: (T & { children: unknown[] })[] })[] {
  type TreeNode = T & { children: TreeNode[] };
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const node of nodes) {
    map.set(node.id, { ...node, children: [] });
  }

  for (const node of nodes) {
    const current = map.get(node.id)!;
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(current);
    } else {
      roots.push(current);
    }
  }

  const sortNodes = (items: TreeNode[]) => {
    items.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "tr"));
    for (const item of items) {
      sortNodes(item.children);
    }
  };

  sortNodes(roots);
  return roots;
}
