"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError("Şifre hatalı.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Yönetim</p>
        <h1 className="mt-2 font-serif text-2xl text-stone-900">Giriş yap</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-stone-700">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-3 text-base outline-none focus:border-[#6b7f6a] sm:py-2"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#4a5d49] py-3 text-sm font-medium text-white transition hover:bg-[#3d4d3c] disabled:opacity-60 touch-manipulation sm:py-2"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş"}
          </button>
        </form>
      </div>
    </main>
  );
}
