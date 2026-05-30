"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initial?: {
    id: string;
    title: string;
    description: string;
    sortOrder: number;
    published: boolean;
  };
};

export function AdminTopicForm({ initial }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fieldClass =
    "w-full rounded-lg border border-stone-300 px-3 py-3 text-base text-stone-900 outline-none focus:border-[#6b7f6a] sm:py-2 sm:text-sm";
  const buttonPrimaryClass =
    "rounded-lg bg-[#4a5d49] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#3d4d3c] disabled:opacity-60 touch-manipulation sm:py-2";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      published: formData.get("published") === "on",
    };

    const url = initial ? `/api/topics/${initial.id}` : "/api/topics";
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

    router.push("/admin/topics");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial) return;
    if (!confirm("Bu konuyu ve içindeki tüm düşünceleri silmek istediğine emin misin?")) return;

    setLoading(true);
    const response = await fetch(`/api/topics/${initial.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Silme işlemi başarısız oldu.");
      setLoading(false);
      return;
    }

    router.push("/admin/topics");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-stone-700">
          Konu başlığı
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initial?.title}
          className={fieldClass}
          placeholder="Örn: Kuşlar nasıl uçar?"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-stone-700">
          Konu açıklaması
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={initial?.description}
          className={`${fieldClass} leading-relaxed`}
          placeholder="Konu sayfasında görünecek kısa giriş… Boş bırakabilirsin."
        />
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
