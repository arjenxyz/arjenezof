"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { familyMenuItemsForRole, type FamilyRole } from "@/lib/family-shared";

type Props = {
  role: FamilyRole;
};

function isMenuActive(pathname: string, href: string) {
  if (href === "/aile") return pathname === "/aile";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FamilyDrawerMenu({ role }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = familyMenuItemsForRole(role);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:bg-stone-50 touch-manipulation"
        aria-label="Menüyü aç"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-stone-900/40"
            aria-label="Menüyü kapat"
            onClick={() => setOpen(false)}
          />
          <nav
            className="absolute left-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-xl"
            aria-label="Aile menüsü"
            style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
          >
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
              <p className="text-sm font-medium text-stone-900">Menü</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 touch-manipulation"
              >
                Kapat
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto p-3">
              {items.map((item) => {
                const active = isMenuActive(pathname, item.href);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`block rounded-xl px-4 py-3 transition touch-manipulation ${
                        active
                          ? "bg-[#eef2ed] text-[#4a5d49]"
                          : "text-stone-800 hover:bg-stone-50"
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.description && (
                        <span className="mt-1 block text-xs leading-relaxed text-stone-500">
                          {item.description}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
