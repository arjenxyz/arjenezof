"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FAMILY_LABELS, type FamilyRole } from "@/lib/family-shared";

type Meta = {
  role: FamilyRole;
  updatedAt: string;
};

type Props = {
  credentials: Meta[];
};

export function AdminFamilyPasswordForm({ credentials }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fieldClass =
    "w-full rounded-lg border border-stone-300 px-3 py-3 text-base outline-none focus:border-[#6b7f6a] sm:py-2 sm:text-sm";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const payload = {
      wife: String(formData.get("wife") ?? ""),
      children: String(formData.get("children") ?? ""),
      grandchildren: String(formData.get("grandchildren") ?? ""),
    };

    const response = await fetch("/api/family/passwords", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Şifreler güncellenemedi.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    router.refresh();
  }

  const metaByRole = new Map(credentials.map((item) => [item.role, item.updatedAt]));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-stone-600">
        Her grubun şifresi farklı olmalı. Boş bıraktığın alanlar değişmez. Aile girişi:{" "}
        <code className="rounded bg-stone-100 px-1">/aile</code>
      </p>

      {(["wife", "children", "grandchildren"] as FamilyRole[]).map((role) => (
        <div key={role}>
          <label htmlFor={`pwd-${role}`} className="mb-1 block text-sm font-medium text-stone-700">
            {FAMILY_LABELS[role]} — yeni şifre
          </label>
          {metaByRole.get(role) && (
            <p className="mb-1 text-xs text-stone-500">
              Son güncelleme:{" "}
              {new Intl.DateTimeFormat("tr-TR", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(metaByRole.get(role)!))}
            </p>
          )}
          <input
            id={`pwd-${role}`}
            name={role}
            type="password"
            minLength={4}
            autoComplete="new-password"
            className={fieldClass}
            placeholder="Değiştirmek için yaz"
          />
        </div>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">Şifreler güncellendi.</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[#4a5d49] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#3d4d3c] disabled:opacity-60"
      >
        {loading ? "Kaydediliyor…" : "Şifreleri kaydet"}
      </button>
    </form>
  );
}
