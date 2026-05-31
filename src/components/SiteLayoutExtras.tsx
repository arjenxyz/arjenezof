"use client";

import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PwaRegister } from "@/components/PwaRegister";

function showMobileNav(pathname: string) {
  return !pathname.startsWith("/admin") && pathname !== "/offline";
}

export function SiteLayoutExtras() {
  const pathname = usePathname();
  const navVisible = showMobileNav(pathname);

  return (
    <>
      <PwaRegister />
      {navVisible && (
        <>
          <MobileBottomNav />
          <div
            className="h-[calc(3.75rem+env(safe-area-inset-bottom,0px))] sm:hidden"
            aria-hidden="true"
          />
        </>
      )}
    </>
  );
}
