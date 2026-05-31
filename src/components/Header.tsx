"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderSearch } from "@/components/HeaderSearch";

export function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header
      className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f7f5f0]/95 backdrop-blur-sm"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-5">
        <Link href="/" className="group min-w-0 flex-1 touch-manipulation">
          <p className="font-serif text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:text-xs sm:tracking-[0.25em]">
            Arjen
          </p>
          <h1 className="truncate font-serif text-lg text-stone-900 transition group-hover:text-[#4a5d49] sm:text-2xl">
            Bu düşüncelerde ne?
          </h1>
        </Link>
        {!isAdmin && (
          <nav className="hidden shrink-0 items-center gap-3 sm:flex">
            <HeaderSearch />
            <Link
              href="/aile"
              className="rounded-lg px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 touch-manipulation"
            >
              Aile girişi
            </Link>
            <Link
              href="/hakkinda"
              className="rounded-lg px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 touch-manipulation"
            >
              Hakkında
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
