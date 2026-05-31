"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { familyAudienceBorderClass } from "@/components/FamilyAudienceBadge";
import {
  FAMILY_ADMIN_HINTS,
  FAMILY_LABELS,
  type FamilyAudience,
} from "@/lib/family-shared";

type Props = {
  allowedAudiences: FamilyAudience[];
  redirectPath: string;
  audienceHints: Partial<Record<FamilyAudience, string>>;
  initial?: {
    id: string;
    title: string;
    content: string;
    audience: FamilyAudience;
    sortOrder: number;
    published: boolean;
  };
  showSortOrder?: boolean;
  showPublishedToggle?: boolean;
  legend?: string;
  helper?: string;
};

export function FamilyMessageForm({
  allowedAudiences,
  redirectPath,
  audienceHints,
  initial,
  showSortOrder = true,
  showPublishedToggle = true,
  legend = "Kime yazıyorsun?",
  helper,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audience, setAudience] = useState<FamilyAudience>(
    initial?.audience ?? allowedAudiences[0] ?? "children",
  );

  const fieldClass =
    "w-full rounded-lg border border-stone-300 px-3 py-3 text-base text-stone-900 outline-none focus:border-[#6b7f6a] sm:py-2 sm:text-sm";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
      audience,
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      published: showPublishedToggle ? formData.get("published") === "on" : true,
    };

    const url = initial ? `/api/family/messages/${initial.id}` : "/api/family/messages";
    const method = initial ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Kayıt sırasında bir hata oluştu.");
      setLoading(false);
      return;
    }

    router.push(redirectPath);
    router.refresh();
  }

  async function handleDelete() {
    if (!initial) return;
    if (!confirm("Bu yazıyı silmek istediğine emin misin?")) return;

    setLoading(true);
    const response = await fetch(`/api/family/messages/${initial.id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Silme işlemi başarısız oldu.");
      setLoading(false);
      return;
    }

    router.push(redirectPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-stone-800">{legend}</legend>
        {helper && <p className="text-xs text-stone-500">{helper}</p>}
        <div
          className={`grid gap-3 ${allowedAudiences.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
        >
          {allowedAudiences.map((item) => (
            <label
              key={item}
              className={`cursor-pointer rounded-xl border-2 p-4 transition touch-manipulation ${
                audience === item
                  ? `${familyAudienceBorderClass(item)} border-current`
                  : "border-stone-200 bg-white hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="audiencePick"
                value={item}
                checked={audience === item}
                onChange={() => setAudience(item)}
                className="sr-only"
              />
              <span className="font-medium text-stone-900">{FAMILY_LABELS[item]}</span>
              <p className="mt-2 text-xs leading-relaxed text-stone-600">
                {audienceHints[item] ?? FAMILY_ADMIN_HINTS[item]}
              </p>
            </label>
          ))}
        </div>
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
          placeholder="Örn: Sevgili çocuklarım"
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
          placeholder="Kalbinden geçeni yaz…"
        />
      </div>

      {showSortOrder && (
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
      )}

      {showPublishedToggle && (
        <label className="flex min-h-[44px] items-center gap-3 text-sm text-stone-700">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? true}
            className="h-5 w-5 rounded border-stone-300"
          />
          Yayında
        </label>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#4a5d49] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#3d4d3c] disabled:opacity-60 touch-manipulation"
        >
          {loading ? "Kaydediliyor…" : initial ? "Güncelle" : "Kaydet"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg border border-red-200 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60 touch-manipulation"
          >
            Sil
          </button>
        )}
      </div>
    </form>
  );
}
