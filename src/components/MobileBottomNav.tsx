"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  match: (path: string) => boolean;
  Icon: ({ active }: { active: boolean }) => React.ReactNode;
};

function IconHome({ active }: { active: boolean }) {
  const className = active ? "text-[#4a5d49]" : "text-stone-500";
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" strokeLinejoin="round" />
    </svg>
  );
}

function IconSearch({ active }: { active: boolean }) {
  const className = active ? "text-[#4a5d49]" : "text-stone-500";
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  );
}

function IconFamily({ active }: { active: boolean }) {
  const className = active ? "text-[#4a5d49]" : "text-stone-500";
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3.5" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconAbout({ active }: { active: boolean }) {
  const className = active ? "text-[#4a5d49]" : "text-stone-500";
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" strokeLinecap="round" />
    </svg>
  );
}

const ITEMS: NavItem[] = [
  { href: "/", label: "Ana sayfa", match: (path) => path === "/", Icon: IconHome },
  { href: "/ara", label: "Arama", match: (path) => path.startsWith("/ara"), Icon: IconSearch },
  { href: "/aile", label: "Aile", match: (path) => path.startsWith("/aile"), Icon: IconFamily },
  {
    href: "/hakkinda",
    label: "Hakkında",
    match: (path) => path.startsWith("/hakkinda"),
    Icon: IconAbout,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200/90 bg-[#f7f5f0]/95 backdrop-blur-md sm:hidden"
      aria-label="Ana menü"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1.5 pb-1">
        {ITEMS.map(({ href, label, match, Icon }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transition touch-manipulation ${
                  active ? "bg-[#eef2ed]/90 text-[#4a5d49]" : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon active={active} />
                <span
                  className={`max-w-full truncate text-[10px] font-medium leading-tight sm:text-[11px] ${
                    active ? "text-[#4a5d49]" : "text-stone-600"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
