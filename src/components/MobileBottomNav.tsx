"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Ana", match: (path: string) => path === "/" },
  { href: "/ara", label: "Ara", match: (path: string) => path.startsWith("/ara") },
  { href: "/aile", label: "Aile", match: (path: string) => path.startsWith("/aile") },
  { href: "/hakkinda", label: "Hakkında", match: (path: string) => path.startsWith("/hakkinda") },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200/90 bg-[#f7f5f0]/95 backdrop-blur-sm sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Ana menü"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
        {ITEMS.map(({ href, label, match }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex min-h-[48px] flex-col items-center justify-center rounded-lg px-2 py-2 text-xs font-medium transition touch-manipulation ${
                  active ? "text-[#4a5d49]" : "text-stone-600 hover:text-stone-900"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`mb-0.5 h-1 w-6 rounded-full transition ${
                    active ? "bg-[#4a5d49]" : "bg-transparent"
                  }`}
                  aria-hidden="true"
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
