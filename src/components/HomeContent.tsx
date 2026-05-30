"use client";

import { useState } from "react";
import type { ThoughtNodeRecord, ThoughtNodeWithChildren } from "@/lib/nodes-shared";
import { ThoughtFlowChart } from "@/components/ThoughtFlowChart";
import { ThoughtTreeList } from "@/components/ThoughtTreeList";

type Props = {
  flatNodes: ThoughtNodeRecord[];
  tree: ThoughtNodeWithChildren[];
};

type View = "schema" | "list";

export function HomeContent({ flatNodes, tree }: Props) {
  const [view, setView] = useState<View>("list");

  return (
    <>
      <div className="mb-4 flex rounded-xl border border-stone-200 bg-white p-1 sm:hidden">
        <button
          type="button"
          onClick={() => setView("list")}
          className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition touch-manipulation ${
            view === "list"
              ? "bg-[#4a5d49] text-white"
              : "text-stone-600 hover:bg-stone-50"
          }`}
        >
          Liste
        </button>
        <button
          type="button"
          onClick={() => setView("schema")}
          className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition touch-manipulation ${
            view === "schema"
              ? "bg-[#4a5d49] text-white"
              : "text-stone-600 hover:bg-stone-50"
          }`}
        >
          Şema
        </button>
      </div>

      <section className={`mb-12 ${view === "schema" ? "block" : "hidden sm:block"}`}>
        <h3 className="mb-3 font-serif text-xl text-stone-900 sm:mb-4 sm:text-2xl">
          Şema görünümü
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-stone-600">
          Kutulara tıklayarak detay metinlerine gidebilirsin. Bu görünüm salt okunurdur;
          yol seçimi yapmazsın — tüm dalları bir arada görürsün.
        </p>
        <ThoughtFlowChart nodes={flatNodes} />
      </section>

      <section className={view === "list" ? "block" : "hidden sm:block"}>
        <h3 className="mb-4 font-serif text-xl text-stone-900 sm:mb-6 sm:text-2xl">
          Liste görünümü
        </h3>
        {tree.length === 0 ? (
          <p className="text-stone-500">Henüz yayınlanmış düşünce yok.</p>
        ) : (
          <ul className="space-y-4 sm:space-y-6">
            {tree.map((node) => (
              <ThoughtTreeList key={node.id} node={node} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
