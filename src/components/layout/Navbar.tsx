"use client";

import Link from "next/link";
import { useState } from "react";
import { homeNavigationItems } from "@/src/data/navigation";
import { createWhatsAppLink } from "@/src/lib/whatsapp";
import { Icon } from "@/src/components/ui/Icon";
import { LogoMark } from "@/src/components/ui/LogoMark";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-una-deep/95 text-white backdrop-blur-xl">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/#home"
          className="group flex min-w-0 items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <LogoMark size="md" className="transition-transform group-hover:rotate-3" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-heading text-lg font-bold tracking-[-0.01em]">
              UNA Project
            </span>
            <span className="block truncate text-[0.62rem] font-bold uppercase tracking-[0.12em] text-una-gold-light">
              Jam Waktu Sholat Digital
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {homeNavigationItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-white/72 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={createWhatsAppLink({
              message: "Halo UNA Project, saya ingin konsultasi produk UNA Project.",
            })}
            target="_blank"
            rel="noreferrer"
            className="gold-cta motion-button hidden min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-black text-una-gold-ink shadow-[0_10px_22px_rgb(214_164_55_/_16%)] hover:brightness-105 sm:inline-flex"
          >
            <Icon name="whatsapp" className="size-4" />
            Hubungi Kami
          </a>

          <button
            type="button"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="motion-button grid size-11 place-items-center rounded-full border border-white/15 text-white lg:hidden"
          >
            <Icon name={isOpen ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </nav>

      <div
        className={`border-t border-white/10 bg-una-deep px-4 py-5 shadow-lg shadow-black/20 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1">
          {homeNavigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={createWhatsAppLink({
              message: "Halo UNA Project, saya ingin konsultasi produk UNA Project.",
            })}
            target="_blank"
            rel="noreferrer"
            className="gold-cta mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-black text-una-gold-ink"
          >
            <Icon name="whatsapp" className="size-4" />
            Konsultasi WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
