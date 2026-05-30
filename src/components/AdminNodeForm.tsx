"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatRelatedIds, parseRelatedIds } from "@/lib/nodes-shared";

type Props = {
  topics: { id: string; title: string }[];
  allWritings: { id: string; title: string; topicId: string }[];
  defaultTopicId?: string;
  initial?: {
    id: string;
    title: string;
    content: string;
    parentId: string;
    topicId: string;
    relatedIds: string;
    tags: string;
    sortOrder: number;
    published: boolean;
  };
};

type TopicMode = "existing" | "new";

export function AdminNodeForm({ topics, allWritings, defaultTopicId, initial }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topicMode, setTopicMode] = useState<TopicMode>(
    initial
      ? "existing"
      : topics.length === 0
        ? "new"
        : defaultTopicId
          ? "existing"
          : "new",
  );
  const [topicId, setTopicId] = useState(initial?.topicId ?? defaultTopicId ?? topics[0]?.id ?? "");
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const [relatedIds, setRelatedIds] = useState<string[]>(
    initial ? parseRelatedIds(initial.relatedIds) : [],
  );

  const fieldClass =
    "w-full rounded-lg border border-stone-300 px-3 py-3 text-base text-stone-900 outline-none focus:border-[#6b7f6a] sm:py-2 sm:text-sm";
  const buttonPrimaryClass =
    "rounded-lg bg-[#4a5d49] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#3d4d3c] disabled:opacity-60 touch-manipulation sm:py-2";

  const activeTopicId = topicMode === "existing" ? topicId : "";

  const continuesFromOptions = useMemo(
    () =>
      allWritings.filter(
        (writing) =>
          writing.id !== initial?.id &&
          (topicMode === "new" || writing.topicId === activeTopicId),
      ),
    [allWritings, topicMode, activeTopicId, initial?.id],
  );

  const relatedOptions = useMemo(
    () => allWritings.filter((writing) => writing.id !== initial?.id),
    [allWritings, initial?.id],
  );

  function toggleRelated(id: string) {
    setRelatedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
      parentId: String(formData.get("parentId") ?? ""),
      tags: String(formData.get("tags") ?? ""),
      relatedIds: formatRelatedIds(relatedIds),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      published: formData.get("published") === "on",
      ...(topicMode === "new"
        ? {
            newTopic: {
              title: newTopicTitle,
              description: newTopicDescription,
            },
          }
        : { topicId }),
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
    if (!confirm("Bu metni silmek istediğine emin misin?")) return;

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
      <fieldset className="space-y-3 rounded-xl border border-stone-200 bg-stone-50/50 p-4">
        <legend className="px-1 text-sm font-medium text-stone-700">Konu</legend>
        <p className="text-xs leading-relaxed text-stone-500">
          Metni hangi konu altında gruplayacağını seç veya yeni bir konu adı yaz.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-stone-700 touch-manipulation">
            <input
              type="radio"
              name="topicMode"
              checked={topicMode === "new"}
              onChange={() => setTopicMode("new")}
              className="h-4 w-4 border-stone-300"
            />
            Yeni konu yaz
          </label>
          {topics.length > 0 && (
            <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-stone-700 touch-manipulation">
              <input
                type="radio"
                name="topicMode"
                checked={topicMode === "existing"}
                onChange={() => setTopicMode("existing")}
                className="h-4 w-4 border-stone-300"
              />
              Mevcut konudan seç
            </label>
          )}
        </div>

        {topicMode === "new" ? (
          <div className="space-y-3">
            <div>
              <label htmlFor="newTopicTitle" className="mb-1 block text-sm font-medium text-stone-700">
                Konu adı
              </label>
              <input
                id="newTopicTitle"
                required
                value={newTopicTitle}
                onChange={(event) => setNewTopicTitle(event.target.value)}
                className={fieldClass}
                placeholder="Örn: Kuşlar nasıl uçar?"
              />
            </div>
            <div>
              <label
                htmlFor="newTopicDescription"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Konu giriş metni (opsiyonel)
              </label>
              <textarea
                id="newTopicDescription"
                rows={3}
                value={newTopicDescription}
                onChange={(event) => setNewTopicDescription(event.target.value)}
                className={`${fieldClass} leading-relaxed`}
                placeholder="Konu sayfasında görünecek kısa giriş…"
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="topicId" className="mb-1 block text-sm font-medium text-stone-700">
              Konu seç
            </label>
            <select
              id="topicId"
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
        )}
      </fieldset>

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-stone-700">
          Başlık
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initial?.title}
          className={fieldClass}
          placeholder="Metnin başlığı"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium text-stone-700">
          Metin
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={12}
          defaultValue={initial?.content}
          className={`${fieldClass} leading-relaxed`}
          placeholder="Denemeni veya düşünceni buraya yaz…"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="parentId" className="mb-1 block text-sm font-medium text-stone-700">
            Devam ettiği metin (opsiyonel)
          </label>
          <select
            id="parentId"
            name="parentId"
            defaultValue={initial?.parentId ?? ""}
            className={fieldClass}
          >
            <option value="">Bağımsız metin</option>
            {continuesFromOptions.map((writing) => (
              <option key={writing.id} value={writing.id}>
                {writing.title}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-stone-500">
            Bu metin seçilen metnin devamı olarak gösterilir.
          </p>
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
          İlgi alanı etiketleri
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={initial?.tags}
          className={fieldClass}
          placeholder="kuş, fizik, merak, doğa"
        />
        <p className="mt-1 text-xs text-stone-500">
          Virgülle ayır. Ziyaretçiler etiketlere göre benzer metinleri bulabilir.
        </p>
      </div>

      {relatedOptions.length > 0 && (
        <fieldset className="rounded-xl border border-stone-200 p-4">
          <legend className="px-1 text-sm font-medium text-stone-700">
            Benzer metinler (opsiyonel)
          </legend>
          <p className="mb-3 text-xs text-stone-500">
            Elle bağlamak istediğin metinleri seç. Etiketlerle otomatik öneriler de eklenir.
          </p>
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {relatedOptions.map((writing) => (
              <label
                key={writing.id}
                className="flex min-h-[40px] cursor-pointer items-center gap-2 text-sm text-stone-700"
              >
                <input
                  type="checkbox"
                  checked={relatedIds.includes(writing.id)}
                  onChange={() => toggleRelated(writing.id)}
                  className="h-4 w-4 rounded border-stone-300"
                />
                {writing.title}
              </label>
            ))}
          </div>
        </fieldset>
      )}

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
