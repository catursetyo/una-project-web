import Link from "next/link";

const navigationItems = [
  { label: "Halaman", href: "/" },
  { label: "Produk", href: "/products" },
  { label: "Transaksi", href: "/order" },
  { label: "Tutorial", href: "/tutorial" },
  { label: "Tentang", href: "/about" },
];

export function Navbar() {
  return (
    <header className="animate-slide-down sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3 rounded-2xl pr-2 transition-transform hover:-translate-y-0.5"
          >
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 grid-cols-2 gap-1 rounded-xl bg-primary p-1.5 shadow-lg shadow-primary/25 transition-transform group-hover:rotate-3 sm:size-10"
            >
              <span className="rounded bg-white" />
              <span className="rounded bg-white/70" />
              <span className="rounded bg-white/70" />
              <span className="rounded bg-white" />
            </span>
            <span className="truncate text-lg font-black tracking-tight text-zinc-950 sm:text-xl">
              UNA Project
            </span>
          </Link>

          <div className="hidden items-center gap-1 rounded-2xl border border-zinc-200 bg-background/80 p-1.5 text-sm font-black tracking-[0.04em] text-zinc-700 shadow-sm shadow-primary/5 lg:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link-motion"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            className="motion-button inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-black tracking-[0.08em] text-white shadow-xl shadow-primary/20 hover:bg-tertiary sm:px-5"
          >
            Konsultasi
          </Link>
        </div>

        <div className="mt-3 overflow-x-auto pb-1 lg:hidden">
          <div className="flex w-max min-w-full items-center gap-1 rounded-2xl border border-zinc-200 bg-background/80 p-1.5 text-sm font-black tracking-[0.04em] text-zinc-700 shadow-sm shadow-primary/5">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link-motion shrink-0"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
