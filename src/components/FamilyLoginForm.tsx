"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function FamilyLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/family/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Giriş başarısız.");
      setLoading(false);
      return;
    }

    router.push("/aile/metinler");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="family-password" className="mb-1 block text-sm font-medium text-stone-700">
          Şifre
        </label>
        <input
          id="family-password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-stone-300 px-3 py-3 text-base outline-none focus:border-[#6b7f6a] sm:py-2 sm:text-sm"
          placeholder="Sana verilen şifre"
          autoComplete="current-password"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#4a5d49] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#3d4d3c] disabled:opacity-60 touch-manipulation"
      >
        {loading ? "Giriş yapılıyor…" : "Giriş"}
      </button>
    </form>
  );
}
