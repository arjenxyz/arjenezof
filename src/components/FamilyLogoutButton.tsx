"use client";

import { useRouter } from "next/navigation";

export function FamilyLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/family/auth/logout", { method: "POST" });
    router.push("/aile");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50 touch-manipulation"
    >
      Çıkış
    </button>
  );
}
