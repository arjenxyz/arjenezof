"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { familyMenuItemsForRole, type FamilyMenuItem, type FamilyRole } from "@/lib/family-shared";

type Props = {
  role: FamilyRole;
};

function isMenuActive(pathname: string, href: string) {
  if (href === "/aile") return pathname === "/aile";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, item: FamilyMenuItem) {
  if (item.href && isMenuActive(pathname, item.href)) return true;
  return item.children?.some((child) => child.href && isMenuActive(pathname, child.href)) ?? false;
}

function MenuLink({
  item,
  pathname,
  nested,
  onNavigate,
}: {
  item: FamilyMenuItem;
  pathname: string;
  nested?: boolean;
  onNavigate?: () => void;
}) {
  if (!item.href) return null;

  const active = isMenuActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`block rounded-xl transition touch-manipulation ${
        nested ? "px-3 py-2.5" : "px-4 py-3"
      } ${
        active ? "bg-[#eef2ed] text-[#4a5d49]" : "text-stone-800 hover:bg-stone-50"
      }`}
    >
      <span className={`${nested ? "text-sm" : ""} font-medium`}>{item.label}</span>
      {item.description && (
        <span className="mt-1 block text-xs leading-relaxed text-stone-500">{item.description}</span>
      )}
    </Link>
  );
}

export function FamilyDrawerMenu({ role }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
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

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/family/auth/logout", { method: "POST", credentials: "same-origin" });
    setOpen(false);
    router.push("/aile");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 text-stone-700 shadow-sm transition hover:bg-stone-50 touch-manipulation sm:px-4"
        aria-label="Menüyü aç"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
        <span className="hidden text-sm font-medium sm:inline">Menü</span>
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
            className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-xl"
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
                if (item.children?.length) {
                  const groupActive = isGroupActive(pathname, item);
                  return (
                    <li key={item.id} className="mb-1">
                      <p
                        className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                          groupActive ? "text-[#4a5d49]" : "text-stone-400"
                        }`}
                      >
                        {item.label}
                      </p>
                      <ul className="ml-3 space-y-0.5 border-l border-stone-200 pl-2">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <MenuLink
                              item={child}
                              pathname={pathname}
                              nested
                              onNavigate={() => setOpen(false)}
                            />
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <MenuLink
                      item={item}
                      pathname={pathname}
                      onNavigate={() => setOpen(false)}
                    />
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-stone-200 p-3">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60 touch-manipulation"
              >
                {loggingOut ? "Çıkış yapılıyor…" : "Çıkış yap"}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
