"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigationItems } from "@/src/data/admin";

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi dashboard"
      className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
    >
      {adminNavigationItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-una-gold ${
              isActive
                ? "bg-white text-una-deep"
                : "text-white/70 hover:bg-white/8 hover:text-white"
            }`}
          >
            <span
              aria-hidden="true"
              className={`grid size-7 place-items-center rounded-md text-[0.65rem] tracking-[0.08em] ${
                isActive
                  ? "bg-una-gold text-una-gold-ink"
                  : "bg-white/8 text-white/75"
              }`}
            >
              {item.shortLabel}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
