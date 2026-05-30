"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  topics: { id: string; title: string }[];
  parents: { id: string; title: string; topicId: string }[];
  defaultTopicId?: string;
  initial?: {
    id: string;
    title: string;
    content: string;
    branchQuestion: string;
    branchLabel: string;
    parentId: string;
    topicId: string;
    tags: string;
    sortOrder: number;
    published: boolean;
  };
};

export function AdminNodeForm({ topics, parents, defaultTopicId, initial }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topicId, setTopicId] = useState(initial?.topicId ?? defaultTopicId ?? topics[0]?.id ?? "");
  const fieldClass =
    "w-full rounded-lg border border-stone-300 px-3 py-3 text-base text-stone-900 outline-none focus:border-[#6b7f6a] sm:py-2 sm:text-sm";
  const buttonPrimaryClass =
    "rounded-lg bg-[#4a5d49] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#3d4d3c] disabled:opacity-60 touch-manipulation sm:py-2";

  const filteredParents = useMemo(
    () => parents.filter((parent) => parent.topicId === topicId && parent.id !== initial?.id),
    [parents, topicId, initial?.id],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
      topicId: String(formData.get("topicId") ?? ""),
      branchQuestion: String(formData.get("branchQuestion") ?? ""),
      branchLabel: String(formData.get("branchLabel") ?? ""),
      parentId: String(formData.get("parentId") ?? ""),
      tags: String(formData.get("tags") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      published: formData.get("published") === "on",
    };

    const url = initial ? `/api/nodes/${initial.id}` : "/api/nodes";
    const method = initial ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Kayıt sırasında bir hata oluştu.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial) return;
    if (!confirm("Bu düşünceyi ve alt dallarını silmek istediğine emin misin?")) return;

    setLoading(true);
    const response = await fetch(`/api/nodes/${initial.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Silme işlemi başarısız oldu.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="topicId" className="mb-1 block text-sm font-medium text-stone-700">
          Konu
        </label>
        <select
          id="topicId"
          name="topicId"
          required
          value={topicId}
          onChange={(event) => setTopicId(event.target.value)}
          className={fieldClass}
        >
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-stone-700">
          Başlık / Soru
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initial?.title}
          className={fieldClass}
          placeholder="Örn: Yaratıcı nedir?"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium text-stone-700">
          Düşünce metni
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={10}
          defaultValue={initial?.content}
          className={`${fieldClass} leading-relaxed`}
          placeholder="Bu düşünceni buraya yaz..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="branchQuestion" className="mb-1 block text-sm font-medium text-stone-700">
            Sonraki soru (opsiyonel)
          </label>
          <input
            id="branchQuestion"
            name="branchQuestion"
            defaultValue={initial?.branchQuestion}
            className={fieldClass}
            placeholder="Örn: Yaratıcı var mıdır?"
          />
        </div>
        <div>
          <label htmlFor="branchLabel" className="mb-1 block text-sm font-medium text-stone-700">
            Dal etiketi (opsiyonel)
          </label>
          <input
            id="branchLabel"
            name="branchLabel"
            defaultValue={initial?.branchLabel}
            className={fieldClass}
            placeholder="Örn: Evet, Hayır"
          />
          <p className="mt-1 text-xs text-stone-500">
            Üst düğümden bu düğüme giden cevabı ifade eder.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="parentId" className="mb-1 block text-sm font-medium text-stone-700">
            Üst düşünce (aynı konu)
          </label>
          <select
            id="parentId"
            name="parentId"
            defaultValue={initial?.parentId ?? ""}
            className={fieldClass}
          >
            <option value="">Kök düşünce (en üst)</option>
            {filteredParents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder" className="mb-1 block text-sm font-medium text-stone-700">
            Sıra
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={initial?.sortOrder ?? 0}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="mb-1 block text-sm font-medium text-stone-700">
          Etiketler
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={initial?.tags}
          className={fieldClass}
          placeholder="din, doğa, felsefe"
        />
        <p className="mt-1 text-xs text-stone-500">Virgülle ayır.</p>
      </div>

      <label className="flex min-h-[44px] items-center gap-3 text-sm text-stone-700 touch-manipulation">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial?.published ?? true}
          className="h-5 w-5 rounded border-stone-300"
        />
        Yayında
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className={buttonPrimaryClass}>
          {loading ? "Kaydediliyor..." : initial ? "Güncelle" : "Oluştur"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg border border-red-200 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60 touch-manipulation sm:py-2"
          >
            Sil
          </button>
        )}
      </div>
    </form>
  );
}
