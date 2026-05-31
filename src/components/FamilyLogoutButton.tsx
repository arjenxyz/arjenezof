"use client";

import { useRouter } from "next/navigation";

export function FamilyLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/family/auth/logout", { method: "POST", credentials: "same-origin" });
    router.push("/aile");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-stone-500 transition hover:text-stone-800 touch-manipulation"
    >
      Çıkış
    </button>
  );
}
