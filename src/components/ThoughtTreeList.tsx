import Link from "next/link";
import type { ThoughtNodeWithChildren } from "@/lib/nodes-shared";
import { parseTags } from "@/lib/nodes-shared";

type Props = {
  node: ThoughtNodeWithChildren;
  depth?: number;
};

export function ThoughtTreeList({ node, depth = 0 }: Props) {
  const tags = parseTags(node.tags);

  return (
    <li className="relative">
      <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition hover:border-[#8fa38e] hover:shadow-md sm:p-4">
        {node.branchLabel && (
          <span className="mb-2 inline-block rounded-full bg-[#eef2ed] px-2.5 py-0.5 text-xs font-medium text-[#4a5d49]">
            {node.branchLabel}
          </span>
        )}
        <Link href={`/dusunce/${node.slug}`} className="group block touch-manipulation">
          <h3 className="font-serif text-base leading-snug text-stone-900 group-hover:text-[#4a5d49] sm:text-lg">
            {node.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">
            {node.content}
          </p>
        </Link>
        {node.branchQuestion && (
          <p className="mt-3 rounded-lg border border-dashed border-stone-200 bg-stone-50 px-3 py-2 text-sm leading-relaxed text-stone-700">
            <span className="font-medium text-stone-800">Sonraki soru:</span>{" "}
            {node.branchQuestion}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {node.children.length > 0 && (
        <ul
          className={`mt-3 space-y-3 border-l-2 border-stone-200 sm:mt-4 sm:space-y-4 ${
            depth === 0 ? "ml-2 pl-3 sm:ml-3 sm:pl-4" : "ml-2 pl-3 sm:pl-4"
          }`}
        >
          {node.children.map((child) => (
            <ThoughtTreeList key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
